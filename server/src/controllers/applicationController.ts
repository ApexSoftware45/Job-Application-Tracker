import { Application as PrismaApplication, ApplicationStatus } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Application, ApplicationInput } from "../types/Application";

const DEFAULT_USER_ID = "demo-user";

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

export const getApplications = async (_req: Request, res: Response) => {
  try {
    // This database read goes through Prisma, so applications persist in PostgreSQL after restart.
    const applications = await prisma.application.findMany({
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

export const createApplication = async (req: Request, res: Response) => {
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
        userId: body.userId || DEFAULT_USER_ID,
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

export const updateApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: ApplicationInput = req.body;
  const { company, position, status } = body;

  if (!hasRequiredFields(body) || !status || !isValidStatus(status)) {
    return res.status(400).json({
      message: "company, position, and status are required"
    });
  }

  try {
    // Prisma updates the matching database row and returns the saved version.
    const updatedApplication = await prisma.application.update({
      where: {
        id
      },
      data: {
        userId: body.userId || DEFAULT_USER_ID,
        company: company || "",
        position: position || "",
        location: body.location || null,
        jobUrl: body.jobUrl || null,
        status,
        dateApplied: parseDateApplied(body.dateApplied),
        notes: body.notes || null
      }
    });

    res.json(toApiApplication(updatedApplication));
  } catch (error) {
    logDatabaseError("update an application", error);
    res.status(404).json({ message: "Application not found" });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Deleting through Prisma removes the row from PostgreSQL permanently.
    await prisma.application.delete({
      where: {
        id
      }
    });

    res.status(204).send();
  } catch (error) {
    logDatabaseError("delete an application", error);
    res.status(404).json({ message: "Application not found" });
  }
};
