import { Application } from "../types/Application";

type DashboardStatsProps = {
  applications: Application[];
};

export function DashboardStats({ applications }: DashboardStatsProps) {
  const stats = [
    { label: "Total", value: applications.length },
    { label: "Applied", value: applications.filter((app) => app.status === "APPLIED").length },
    {
      label: "Interviewing",
      value: applications.filter((app) => app.status === "INTERVIEWING").length,
    },
    { label: "Offers", value: applications.filter((app) => app.status === "OFFER").length },
    { label: "Rejected", value: applications.filter((app) => app.status === "REJECTED").length },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
