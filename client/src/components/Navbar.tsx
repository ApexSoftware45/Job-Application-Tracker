import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-bold text-slate-950">Job Application Tracker</h1>
          <p className="text-sm text-slate-500">Welcome back, {currentUser?.name}</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
