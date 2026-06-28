import { Application as PrismaApplication, ApplicationStatus } from "@prisma/client";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import prisma from "../prisma/client";
import { Application, ApplicationInput } from "../types/Application";

const hasRequiredFields = (body: ApplicationInput) => {
  return Boolean(body.company && body.position && body.status);
};

const isValidStatus = (status: string) => {
  return Object.values(ApplicationStatus).includes(status as ApplicationStatus);
};

const parseDateApplied = (dateApplied?: string) => {
  if (!dateApplied) {
    return null;
  }

  const date = new Date(dateApplied);

  return Number.isNaN(date.getTime()) ? null : date;
};

const toApiApplication = (application: PrismaApplication): Application => {
  return {
    id: application.id,
    userId: application.userId,
    company: application.company,
    position: application.position,
    location: application.location || "",
    jobUrl: application.jobUrl || "",
    status: application.status,
    dateApplied: application.dateApplied ? application.dateApplied.toISOString() : "",
    notes: application.notes || "",
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString()
  };
};

const logDatabaseError = (action: string, error: unknown) => {
  console.error(`Database error while trying to ${action}:`, error);
};

export const getApplications = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Prisma reads only rows owned by the logged-in user, so each account sees its own tracker.
    const applications = await prisma.application.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(applications.map(toApiApplication));
  } catch (error) {
    logDatabaseError("load applications", error);
    res.status(500).json({ message: "Could not load applications" });
  }
};

export const createApplication = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body: ApplicationInput = req.body;
  const { company, position, status } = body;

  if (!hasRequiredFields(body) || !status || !isValidStatus(status)) {
    return res.status(400).json({
      message: "company, position, and status are required"
    });
  }

  try {
    // Prisma creates the row in PostgreSQL instead of a temporary in-memory array.
    const newApplication = await prisma.application.create({
      data: {
        userId: req.user.id,
        company: company || "",
        position: position || "",
        location: body.location || null,
        jobUrl: body.jobUrl || null,
        status,
        dateApplied: parseDateApplied(body.dateApplied),
        notes: body.notes || null
      }
    });

    res.status(201).json(toApiApplication(newApplication));
  } catch (error) {
    logDatabaseError("create an application", error);
    res.status(500).json({ message: "Could not create application" });
  }
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const body: ApplicationInput = req.body;
  const { company, position, status } = body;

  if (!hasRequiredFields(body) || !status || !isValidStatus(status)) {
    return res.status(400).json({
      message: "company, position, and status are required"
    });
  }

  try {
    // updateMany lets us require both the application id and the owner id.
    const updateResult = await prisma.application.updateMany({
      where: {
        id,
        userId: req.user.id
      },
      data: {
        company: company || "",
        position: position || "",
        location: body.location || null,
        jobUrl: body.jobUrl || null,
        status,
        dateApplied: parseDateApplied(body.dateApplied),
        notes: body.notes || null
      }
    });

    if (updateResult.count === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const updatedApplication = await prisma.application.findUniqueOrThrow({
      where: {
        id
      }
    });

    res.json(toApiApplication(updatedApplication));
  } catch (error) {
    logDatabaseError("update an application", error);
    res.status(404).json({ message: "Application not found" });
  }
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    // The owner check prevents one user from deleting another user's application.
    const deleteResult = await prisma.application.deleteMany({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(204).send();
  } catch (error) {
    logDatabaseError("delete an application", error);
    res.status(404).json({ message: "Application not found" });
  }
};
