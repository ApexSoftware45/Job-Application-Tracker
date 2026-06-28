import { FormEvent, useEffect, useState } from "react";
import { Application, ApplicationStatus } from "../types/Application";

type ApplicationFormData = Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">;

type ApplicationFormProps = {
  initialData?: Application | null;
  onSubmit: (data: ApplicationFormData) => void;
  onCancelEdit?: () => void;
};

const emptyForm: ApplicationFormData = {
  company: "",
  position: "",
  location: "",
  jobUrl: "",
  status: "SAVED",
  dateApplied: "",
  notes: "",
};

const statuses: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export function ApplicationForm({ initialData, onSubmit, onCancelEdit }: ApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormData>(emptyForm);

  useEffect(() => {
    if (initialData) {
      const { company, position, location, jobUrl, status, dateApplied, notes } = initialData;
      setFormData({ company, position, location, jobUrl, status, dateApplied, notes });
      return;
    }

    setFormData(emptyForm);
  }, [initialData]);

  function updateField(field: keyof ApplicationFormData, value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(formData);

    if (!initialData) {
      setFormData(emptyForm);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-slate-950">
          {initialData ? "Edit Application" : "Add Application"}
        </h2>
        <p className="text-sm text-slate-500">Track the role, status, and notes in one place.</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Company</span>
          <input
            required
            value={formData.company}
            onChange={(event) => updateField("company", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Acme Inc."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Position</span>
          <input
            required
            value={formData.position}
            onChange={(event) => updateField("position", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Frontend Developer"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Location</span>
          <input
            value={formData.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Remote"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Job URL</span>
          <input
            type="url"
            value={formData.jobUrl}
            onChange={(event) => updateField("jobUrl", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="https://example.com/job"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={formData.status}
            onChange={(event) => updateField("status", event.target.value as ApplicationStatus)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Date Applied</span>
          <input
            type="date"
            value={formData.dateApplied}
            onChange={(event) => updateField("dateApplied", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Notes</span>
        <textarea
          value={formData.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Interview details, follow-up reminders, or resume notes..."
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Add Application"}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
