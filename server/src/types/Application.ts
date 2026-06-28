export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

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

export type ApplicationInput = Partial<Omit<Application, "id" | "createdAt" | "updatedAt">>;
