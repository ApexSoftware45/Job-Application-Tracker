import { Application } from "../types/Application";

// Local sample data stands in for a future applications API.
export const sampleApplications: Application[] = [
  {
    id: "app-1",
    userId: "user-1",
    company: "Acme Analytics",
    position: "Frontend Developer",
    location: "Remote",
    jobUrl: "https://example.com/frontend-developer",
    status: "APPLIED",
    dateApplied: "2026-06-10",
    notes: "Submitted resume and portfolio link.",
    createdAt: "2026-06-10T12:00:00.000Z",
    updatedAt: "2026-06-10T12:00:00.000Z",
  },
  {
    id: "app-2",
    userId: "user-1",
    company: "Northstar Labs",
    position: "Junior Software Engineer",
    location: "Seattle, WA",
    jobUrl: "https://example.com/junior-software-engineer",
    status: "INTERVIEWING",
    dateApplied: "2026-06-14",
    notes: "Phone screen scheduled for next week.",
    createdAt: "2026-06-14T16:30:00.000Z",
    updatedAt: "2026-06-18T09:15:00.000Z",
  },
  {
    id: "app-3",
    userId: "user-1",
    company: "BrightPath Health",
    position: "React Developer",
    location: "Los Angeles, CA",
    jobUrl: "https://example.com/react-developer",
    status: "SAVED",
    dateApplied: "",
    notes: "Need to tailor resume before applying.",
    createdAt: "2026-06-20T18:45:00.000Z",
    updatedAt: "2026-06-20T18:45:00.000Z",
  },
];
