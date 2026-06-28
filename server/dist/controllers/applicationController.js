"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.createApplication = exports.getApplications = void 0;
const client_1 = require("@prisma/client");
const client_2 = __importDefault(require("../prisma/client"));
const DEFAULT_USER_ID = "demo-user";
const hasRequiredFields = (body) => {
    return Boolean(body.company && body.position && body.status);
};
const isValidStatus = (status) => {
    return Object.values(client_1.ApplicationStatus).includes(status);
};
const parseDateApplied = (dateApplied) => {
    if (!dateApplied) {
        return null;
    }
    const date = new Date(dateApplied);
    return Number.isNaN(date.getTime()) ? null : date;
};
const toApiApplication = (application) => {
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
const logDatabaseError = (action, error) => {
    console.error(`Database error while trying to ${action}:`, error);
};
const getApplications = async (_req, res) => {
    try {
        // This database read goes through Prisma, so applications persist in PostgreSQL after restart.
        const applications = await client_2.default.application.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        res.json(applications.map(toApiApplication));
    }
    catch (error) {
        logDatabaseError("load applications", error);
        res.status(500).json({ message: "Could not load applications" });
    }
};
exports.getApplications = getApplications;
const createApplication = async (req, res) => {
    const body = req.body;
    const { company, position, status } = body;
    if (!hasRequiredFields(body) || !status || !isValidStatus(status)) {
        return res.status(400).json({
            message: "company, position, and status are required"
        });
    }
    try {
        // Prisma creates the row in PostgreSQL instead of a temporary in-memory array.
        const newApplication = await client_2.default.application.create({
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
    }
    catch (error) {
        logDatabaseError("create an application", error);
        res.status(500).json({ message: "Could not create application" });
    }
};
exports.createApplication = createApplication;
const updateApplication = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const { company, position, status } = body;
    if (!hasRequiredFields(body) || !status || !isValidStatus(status)) {
        return res.status(400).json({
            message: "company, position, and status are required"
        });
    }
    try {
        // Prisma updates the matching database row and returns the saved version.
        const updatedApplication = await client_2.default.application.update({
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
    }
    catch (error) {
        logDatabaseError("update an application", error);
        res.status(404).json({ message: "Application not found" });
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res) => {
    const { id } = req.params;
    try {
        // Deleting through Prisma removes the row from PostgreSQL permanently.
        await client_2.default.application.delete({
            where: {
                id
            }
        });
        res.status(204).send();
    }
    catch (error) {
        logDatabaseError("delete an application", error);
        res.status(404).json({ message: "Application not found" });
    }
};
exports.deleteApplication = deleteApplication;
