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
  nextActionDate: "",
  nextActionNote: "",
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

function toDateInputValue(dateValue?: string) {
  return dateValue ? dateValue.slice(0, 10) : "";
}

export function ApplicationForm({ initialData, onSubmit, onCancelEdit }: ApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormData>(emptyForm);

  useEffect(() => {
    if (initialData) {
      const {
        company,
        position,
        location,
        jobUrl,
        status,
        dateApplied,
        nextActionDate,
        nextActionNote,
        notes,
      } = initialData;
      setFormData({
        company,
        position,
        location,
        jobUrl,
        status,
        dateApplied: toDateInputValue(dateApplied),
        nextActionDate: toDateInputValue(nextActionDate),
        nextActionNote: nextActionNote || "",
        notes,
      });
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
    <form onSubmit={handleSubmit} className="rounded-lg bg-slate-900 p-5 shadow-lg shadow-slate-950/25 ring-1 ring-slate-800">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-slate-100">
          {initialData ? "Edit Application" : "Add Application"}
        </h2>
        <p className="text-sm text-slate-400">Track the role, status, and notes in one place.</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Company</span>
          <input
            required
            value={formData.company}
            onChange={(event) => updateField("company", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="Acme Inc."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Position</span>
          <input
            required
            value={formData.position}
            onChange={(event) => updateField("position", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="Frontend Developer"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Location</span>
          <input
            value={formData.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="Remote"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Job URL</span>
          <input
            type="url"
            value={formData.jobUrl}
            onChange={(event) => updateField("jobUrl", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="https://example.com/job"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Status</span>
          <select
            value={formData.status}
            onChange={(event) => updateField("status", event.target.value as ApplicationStatus)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Date Applied</span>
          <input
            type="date"
            value={toDateInputValue(formData.dateApplied)}
            onChange={(event) => updateField("dateApplied", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Next Action Date</span>
          <input
            type="date"
            value={toDateInputValue(formData.nextActionDate)}
            onChange={(event) => updateField("nextActionDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Next Action Note</span>
          <input
            value={formData.nextActionNote || ""}
            onChange={(event) => updateField("nextActionNote", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            placeholder="Follow up with recruiter"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-300">Notes</span>
        <textarea
          value={formData.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          placeholder="Interview details, follow-up reminders, or resume notes..."
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-950/30 transition hover:bg-emerald-400"
        >
          {initialData ? "Save Changes" : "Add Application"}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
