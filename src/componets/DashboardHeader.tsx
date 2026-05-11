import { Link } from "react-router-dom";

type DashboardHeaderProps = {
  email?: string;
  onLogout: () => void;
};

const DashboardHeader = ({ email, onLogout }: DashboardHeaderProps) => {
  const displayName = email?.split("@")[0] ?? "User";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div>
          <Link className="text-sm font-black text-teal-700 no-underline" to="/">
            TeamFlow
          </Link>
          <h1 className="mt-1 text-2xl font-black tracking-normal text-slate-950 md:text-3xl">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-sm font-black leading-4 text-slate-950">{displayName}</p>
            <p className="max-w-[210px] truncate text-xs leading-4 text-slate-500">{email}</p>
          </div>
          <button
            className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
            type="button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
