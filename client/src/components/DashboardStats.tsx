import { Application } from "../types/Application";

type DashboardStatsProps = {
  applications: Application[];
};

export function DashboardStats({ applications }: DashboardStatsProps) {
  const stats = [
    { label: "Total", value: applications.length, accent: "bg-slate-400" },
    { label: "Applied", value: applications.filter((app) => app.status === "APPLIED").length, accent: "bg-cyan-400" },
    {
      label: "Interviewing",
      value: applications.filter((app) => app.status === "INTERVIEWING").length,
      accent: "bg-violet-400",
    },
    { label: "Offers", value: applications.filter((app) => app.status === "OFFER").length, accent: "bg-emerald-400" },
    { label: "Rejected", value: applications.filter((app) => app.status === "REJECTED").length, accent: "bg-rose-400" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg bg-slate-900 p-5 shadow-lg shadow-slate-950/25 ring-1 ring-slate-800">
          <div className={`h-1.5 w-10 rounded-full ${stat.accent}`} />
          <p className="mt-4 text-sm font-medium text-slate-400">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
