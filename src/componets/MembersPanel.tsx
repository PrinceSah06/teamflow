import type { OrgMember } from "../store/notesStore";

type MembersPanelProps = {
  members: OrgMember[];
  currentUserId?: string;
};

const MembersPanel = ({ members, currentUserId }: MembersPanelProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-normal text-slate-500">
            Same organization users
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-950">
            {members.length} {members.length === 1 ? "member" : "members"}
          </h2>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">
          Active org
        </span>
      </div>

      <p className="mt-3 rounded-md border border-teal-100 bg-teal-50 p-3 text-xs leading-5 text-teal-900">
        These users are in the same organization because the backend reads the
        `member` table by the selected `orgId` and joins it with `users`.
      </p>

      <div className="mt-4 grid gap-2">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;

          return (
            <div
              className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
              key={member.id}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-black text-slate-950">
                    {member.email.split("@")[0]}
                  </p>
                  {isCurrentUser && (
                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[11px] font-black text-teal-800">
                      You
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-500">{member.email}</p>
              </div>
              <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
                {member.role}
              </span>
            </div>
          );
        })}

        {members.length === 0 && (
          <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
            No members found for this organization.
          </p>
        )}
      </div>
    </section>
  );
};

export default MembersPanel;
