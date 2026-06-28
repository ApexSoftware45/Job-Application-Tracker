import { useMemo, useState } from "react";
import { sampleApplications } from "../api/applicationApi";
import { ApplicationCard } from "../components/ApplicationCard";
import { ApplicationForm } from "../components/ApplicationForm";
import { DashboardStats } from "../components/DashboardStats";
import { Navbar } from "../components/Navbar";
import { StatusFilter, StatusFilterValue } from "../components/StatusFilter";
import { useAuth } from "../context/AuthContext";
import { Application } from "../types/Application";

type ApplicationFormData = Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">;

export function DashboardPage() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterValue>("ALL");
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const filteredApplications = useMemo(() => {
    if (selectedStatus === "ALL") {
      return applications;
    }

    return applications.filter((application) => application.status === selectedStatus);
  }, [applications, selectedStatus]);

  function handleSaveApplication(formData: ApplicationFormData) {
    const timestamp = new Date().toISOString();

    if (editingApplication) {
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === editingApplication.id
            ? { ...application, ...formData, updatedAt: timestamp }
            : application,
        ),
      );
      setEditingApplication(null);
      return;
    }

    const newApplication: Application = {
      ...formData,
      id: crypto.randomUUID(),
      userId: currentUser?.id || "user-1",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setApplications((currentApplications) => [newApplication, ...currentApplications]);
  }

  function handleDeleteApplication(id: string) {
    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id),
    );

    if (editingApplication?.id === id) {
      setEditingApplication(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
          <p className="text-sm text-slate-500">
            Manage saved roles, applications, interview progress, and outcomes.
          </p>
        </div>

        <DashboardStats applications={applications} />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
          <ApplicationForm
            initialData={editingApplication}
            onSubmit={handleSaveApplication}
            onCancelEdit={() => setEditingApplication(null)}
          />

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="mb-3 flex flex-col gap-1">
                <h3 className="font-bold text-slate-950">Applications</h3>
                <p className="text-sm text-slate-500">Filter your pipeline by current status.</p>
              </div>
              <StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            </div>

            {filteredApplications.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onEdit={setEditingApplication}
                    onDelete={handleDeleteApplication}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                <p className="font-semibold text-slate-950">No applications found</p>
                <p className="mt-1 text-sm text-slate-500">Try another filter or add a new role.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
