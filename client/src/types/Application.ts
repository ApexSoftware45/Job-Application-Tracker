export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

// Main job application record used by cards, forms, filters, and stats.
export type Application = {
  id: string;
  userId: string;
  company: string;
  position: string;
  location: string;
  jobUrl: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
