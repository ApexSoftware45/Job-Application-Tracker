import { Application, ApplicationStatus } from "../types/Application";

type ApplicationCardProps = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
};

const statusStyles: Record<ApplicationStatus, string> = {
  SAVED: "bg-slate-700/80 text-slate-100 ring-slate-500/40",
  APPLIED: "bg-cyan-500/15 text-cyan-200 ring-cyan-400/30",
  INTERVIEWING: "bg-violet-500/15 text-violet-200 ring-violet-400/30",
  OFFER: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30",
  REJECTED: "bg-rose-500/15 text-rose-200 ring-rose-400/30",
  WITHDRAWN: "bg-amber-500/15 text-amber-200 ring-amber-400/30",
};

export function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  return (
    <article className="rounded-lg bg-slate-900 p-5 shadow-lg shadow-slate-950/25 ring-1 ring-slate-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100">{application.position}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[application.status]}`}
            >
              {application.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-300">{application.company}</p>
          <p className="text-sm text-slate-400">{application.location || "Location not listed"}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-950/30 transition hover:bg-rose-400"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-100">Date applied:</span>{" "}
          {application.dateApplied || "Not applied yet"}
        </p>
        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-emerald-300 hover:text-emerald-200"
          >
            View job posting
          </a>
        )}
      </div>

      {(application.nextActionDate || application.nextActionNote) && (
        <div className="mt-4 rounded-md bg-amber-400/10 p-3 text-sm text-amber-100 ring-1 ring-amber-400/30">
          <p className="font-semibold text-amber-300">Next action</p>
          {application.nextActionDate && <p className="mt-1">Date: {application.nextActionDate}</p>}
          {application.nextActionNote && <p className="mt-1">{application.nextActionNote}</p>}
        </div>
      )}

      {application.notes && <p className="mt-4 text-sm leading-6 text-slate-300">{application.notes}</p>}
    </article>
  );
}
