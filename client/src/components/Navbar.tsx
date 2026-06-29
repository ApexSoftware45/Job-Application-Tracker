import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Job Application Tracker</h1>
          <p className="text-sm text-slate-400">Welcome back, {currentUser?.name}</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
