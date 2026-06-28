"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.createApplication = exports.getApplications = void 0;
const crypto_1 = require("crypto");
// Temporary data store for iteration 1. This resets whenever the server restarts.
let applications = [
    {
        id: (0, crypto_1.randomUUID)(),
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
const hasRequiredFields = (body) => {
    return Boolean(body.company && body.position && body.status);
};
const getApplications = (_req, res) => {
    res.json(applications);
};
exports.getApplications = getApplications;
const createApplication = (req, res) => {
    const body = req.body;
    const { company, position, status } = body;
    if (!hasRequiredFields(body)) {
        return res.status(400).json({
            message: "company, position, and status are required"
        });
    }
    const now = new Date().toISOString();
    const newApplication = {
        id: (0, crypto_1.randomUUID)(),
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
exports.createApplication = createApplication;
const updateApplication = (req, res) => {
    const { id } = req.params;
    const body = req.body;
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
    const updatedApplication = {
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
exports.updateApplication = updateApplication;
const deleteApplication = (req, res) => {
    const { id } = req.params;
    const applicationExists = applications.some((application) => application.id === id);
    if (!applicationExists) {
        return res.status(404).json({ message: "Application not found" });
    }
    applications = applications.filter((application) => application.id !== id);
    res.status(204).send();
};
exports.deleteApplication = deleteApplication;
