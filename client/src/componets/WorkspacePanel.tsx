import type { Organization } from "../store/notesStore";

type WorkspacePanelProps = {
  organizations: Organization[];
  activeOrganization?: Organization;
  orgId: string | null;
  onCreateOrganization: () => void;
  onSelectOrganization: (orgId: string) => void;
};

const WorkspacePanel = ({
  organizations,
  activeOrganization,
  orgId,
  onCreateOrganization,
  onSelectOrganization,
}: WorkspacePanelProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-normal text-slate-500">
            Workspace
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-950">
            {activeOrganization?.name ?? "Your organization"}
          </h2>
        </div>
        <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-black text-teal-700">
          {activeOrganization?.role ?? "member"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-500">Organizations</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{organizations.length}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-500">Your role</p>
          <p className="mt-1 truncate text-lg font-black text-slate-950">
            {activeOrganization?.role ?? "member"}
          </p>
        </div>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        Switch organization
        <select
          className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          value={orgId ?? ""}
          onChange={(event) => onSelectOrganization(event.target.value)}
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name} ({org.role})
            </option>
          ))}
        </select>
      </label>

      <button
        className="mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-800 transition hover:bg-slate-100"
        type="button"
        onClick={onCreateOrganization}
      >
        New organization
      </button>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <p className="text-xs font-black uppercase tracking-normal text-slate-500">
          All organizations
        </p>
        <div className="mt-2 grid gap-2">
          {organizations.map((org) => (
            <button
              className={`rounded-md border px-3 py-2 text-left transition ${
                org.id === orgId
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              key={org.id}
              type="button"
              onClick={() => onSelectOrganization(org.id)}
            >
              <p className="truncate text-sm font-black text-slate-950">{org.name}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{org.role}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkspacePanel;
