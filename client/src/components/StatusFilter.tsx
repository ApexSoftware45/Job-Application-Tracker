import { ApplicationStatus } from "../types/Application";

export type StatusFilterValue = ApplicationStatus | "ALL";

type StatusFilterProps = {
  selectedStatus: StatusFilterValue;
  onStatusChange: (status: StatusFilterValue) => void;
};

const statuses: { label: string; value: StatusFilterValue }[] = [
  { label: "All", value: "ALL" },
  { label: "Saved", value: "SAVED" },
  { label: "Applied", value: "APPLIED" },
  { label: "Interviewing", value: "INTERVIEWING" },
  { label: "Offer", value: "OFFER" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

export function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const isSelected = selectedStatus === status.value;

        return (
          <button
            key={status.value}
            type="button"
            onClick={() => onStatusChange(status.value)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              isSelected
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}
