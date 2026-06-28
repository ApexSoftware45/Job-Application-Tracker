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
import { useAuth } from "../context/AuthContext";
import { Application } from "../types/Application";

type ApplicationFormData = Omit<Application, "id" | "userId" | "createdAt" | "updatedAt">;

export function DashboardPage() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterValue>("ALL");
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
    if (selectedStatus === "ALL") {
      return applications;
    }

    return applications.filter((application) => application.status === selectedStatus);
  }, [applications, selectedStatus]);

  async function handleSaveApplication(formData: ApplicationFormData) {
    const applicationData = {
      ...formData,
      userId: currentUser?.id || "user-1",
    };

    try {
      setErrorMessage("");

      if (editingApplication) {
        const updatedApplication = await updateApplication(editingApplication.id, applicationData);

        setApplications((currentApplications) =>
          currentApplications.map((application) =>
            application.id === editingApplication.id ? updatedApplication : application,
          ),
        );
        setEditingApplication(null);
        return;
      }

      const newApplication = await createApplication(applicationData);

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

        {errorMessage && (
          <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
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
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="mb-3 flex flex-col gap-1">
                <h3 className="font-bold text-slate-950">Applications</h3>
                <p className="text-sm text-slate-500">Filter your pipeline by current status.</p>
              </div>
              <StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            </div>

            {isLoading ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                <p className="font-semibold text-slate-950">Loading applications...</p>
                <p className="mt-1 text-sm text-slate-500">Getting your job tracker data.</p>
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
