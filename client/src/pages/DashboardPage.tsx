import { useEffect, useMemo, useState } from "react";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "../api/applicationApi";
import { ApplicationCard } from "../components/ApplicationCard";
import { ApplicationForm } from "../components/ApplicationForm";
import { DashboardStats } from "../components/DashboardStats";
import { Navbar } from "../components/Navbar";
import { StatusFilter, StatusFilterValue } from "../components/StatusFilter";
import { Application } from "../types/Application";

type ApplicationFormData = Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">;

export function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterValue>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        setErrorMessage("");
        const applicationsFromApi = await getApplications();
        setApplications(applicationsFromApi);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load applications from the API.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus = selectedStatus === "ALL" || application.status === selectedStatus;
      const matchesSearch =
        !normalizedSearchQuery ||
        [application.company, application.position, application.location].some((value) =>
          value.toLowerCase().includes(normalizedSearchQuery),
        );

      return matchesStatus && matchesSearch;
    });
  }, [applications, selectedStatus, searchQuery]);

  async function handleSaveApplication(formData: ApplicationFormData) {
    try {
      setErrorMessage("");

      if (editingApplication) {
        const updatedApplication = await updateApplication(editingApplication.id, formData);

        setApplications((currentApplications) =>
          currentApplications.map((application) =>
            application.id === editingApplication.id ? updatedApplication : application,
          ),
        );
        setEditingApplication(null);
        return;
      }

      const newApplication = await createApplication(formData);

      setApplications((currentApplications) => [newApplication, ...currentApplications]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not save the application to the API.",
      );
    }
  }

  async function handleDeleteApplication(id: string) {
    try {
      setErrorMessage("");

      await deleteApplication(id);

      setApplications((currentApplications) =>
        currentApplications.filter((application) => application.id !== id),
      );

      if (editingApplication?.id === id) {
        setEditingApplication(null);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not delete the application from the API.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
          <p className="text-sm text-slate-400">
            Manage saved roles, applications, interview progress, and outcomes.
          </p>
        </div>

        <DashboardStats applications={applications} />

        {errorMessage && (
          <div className="rounded-lg bg-rose-500/10 p-4 text-sm font-medium text-rose-200 ring-1 ring-rose-500/40">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
          <ApplicationForm
            initialData={editingApplication}
            onSubmit={handleSaveApplication}
            onCancelEdit={() => setEditingApplication(null)}
          />

          <div className="space-y-4">
            <div className="rounded-lg bg-slate-900 p-4 shadow-lg shadow-slate-950/25 ring-1 ring-slate-800">
              <div className="mb-3 flex flex-col gap-1">
                <h3 className="font-bold text-slate-100">Applications</h3>
                <p className="text-sm text-slate-400">
                  Filter your pipeline by company, role, location, or status.
                </p>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="mb-3 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                placeholder="Search company, position, or location"
              />
              <StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            </div>

            {isLoading ? (
              <div className="rounded-lg bg-slate-900 p-8 text-center shadow-lg shadow-slate-950/25 ring-1 ring-slate-800">
                <p className="font-semibold text-slate-100">Loading applications...</p>
                <p className="mt-1 text-sm text-slate-400">Getting your job tracker data.</p>
              </div>
            ) : filteredApplications.length > 0 ? (
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
              <div className="rounded-lg bg-slate-900 p-8 text-center shadow-lg shadow-slate-950/25 ring-1 ring-slate-800">
                <p className="font-semibold text-slate-100">No applications found</p>
                <p className="mt-1 text-sm text-slate-400">Try another filter or add a new role.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
