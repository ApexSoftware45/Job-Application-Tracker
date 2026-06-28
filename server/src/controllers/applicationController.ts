import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { Application, ApplicationInput } from "../types/Application";

// Temporary data store for iteration 1. This resets whenever the server restarts.
let applications: Application[] = [
  {
    id: randomUUID(),
    userId: "demo-user",
    company: "Acme Design Co.",
    position: "Frontend Developer",
    location: "Remote",
    jobUrl: "https://example.com/jobs/frontend-developer",
    status: "APPLIED",
    dateApplied: new Date().toISOString(),
    notes: "Demo application stored in memory.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const hasRequiredFields = (body: ApplicationInput) => {
  return Boolean(body.company && body.position && body.status);
};

export const getApplications = (_req: Request, res: Response) => {
  res.json(applications);
};

export const createApplication = (req: Request, res: Response) => {
  const body: ApplicationInput = req.body;
  const { company, position, status } = body;

  if (!hasRequiredFields(body)) {
    return res.status(400).json({
      message: "company, position, and status are required"
    });
  }

  const now = new Date().toISOString();

  const newApplication: Application = {
    id: randomUUID(),
    userId: body.userId || "demo-user",
    company: company || "",
    position: position || "",
    location: body.location || "",
    jobUrl: body.jobUrl || "",
    status: status || "SAVED",
    dateApplied: body.dateApplied || now,
    notes: body.notes || "",
    createdAt: now,
    updatedAt: now
  };

  applications.push(newApplication);

  res.status(201).json(newApplication);
};

export const updateApplication = (req: Request, res: Response) => {
  const { id } = req.params;
  const body: ApplicationInput = req.body;
  const { company, position, status } = body;

  if (!hasRequiredFields(body)) {
    return res.status(400).json({
      message: "company, position, and status are required"
    });
  }

  const applicationIndex = applications.findIndex((application) => application.id === id);

  if (applicationIndex === -1) {
    return res.status(404).json({ message: "Application not found" });
  }

  const existingApplication = applications[applicationIndex];

  const updatedApplication: Application = {
    ...existingApplication,
    userId: body.userId || existingApplication.userId,
    company: company || existingApplication.company,
    position: position || existingApplication.position,
    location: body.location || existingApplication.location,
    jobUrl: body.jobUrl || existingApplication.jobUrl,
    status: status || existingApplication.status,
    dateApplied: body.dateApplied || existingApplication.dateApplied,
    notes: body.notes || existingApplication.notes,
    updatedAt: new Date().toISOString()
  };

  applications[applicationIndex] = updatedApplication;

  res.json(updatedApplication);
};

export const deleteApplication = (req: Request, res: Response) => {
  const { id } = req.params;
  const applicationExists = applications.some((application) => application.id === id);

  if (!applicationExists) {
    return res.status(404).json({ message: "Application not found" });
  }

  applications = applications.filter((application) => application.id !== id);

  res.status(204).send();
};
