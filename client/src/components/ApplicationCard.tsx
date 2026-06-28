import { Application, ApplicationStatus } from "../types/Application";

type ApplicationCardProps = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
};

const statusStyles: Record<ApplicationStatus, string> = {
  SAVED: "bg-slate-100 text-slate-700",
  APPLIED: "bg-blue-100 text-blue-700",
  INTERVIEWING: "bg-amber-100 text-amber-800",
  OFFER: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  WITHDRAWN: "bg-zinc-100 text-zinc-700",
};

export function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  return (
    <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-950">{application.position}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[application.status]}`}
            >
              {application.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-700">{application.company}</p>
          <p className="text-sm text-slate-500">{application.location || "Location not listed"}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-800">Date applied:</span>{" "}
          {application.dateApplied || "Not applied yet"}
        </p>
        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View job posting
          </a>
        )}
      </div>

      {application.notes && <p className="mt-4 text-sm leading-6 text-slate-600">{application.notes}</p>}
    </article>
  );
}
