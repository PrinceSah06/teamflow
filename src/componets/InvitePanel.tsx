import { useState } from "react";

type InvitePanelProps = {
  inviteLink: string | null;
  onCreateInvite: (email: string) => Promise<void>;
};

const InvitePanel = ({ inviteLink, onCreateInvite }: InvitePanelProps) => {
  const [email, setEmail] = useState("");
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      return;
    }

    await onCreateInvite(email.trim());
    setEmail("");
    setCopiedInvite(false);
  };

  const handleCopyInvite = async () => {
    if (!inviteLink) {
      return;
    }

    await navigator.clipboard.writeText(inviteLink);
    setCopiedInvite(true);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Invite member
          <input
            className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            type="email"
            value={email}
            placeholder="teammate@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <button
          className="rounded-md bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
          type="button"
          onClick={() => void handleInvite()}
        >
          Create invite
        </button>
      </div>

      {inviteLink && (
        <div className="mt-3 flex flex-col gap-2 rounded-md border border-teal-200 bg-teal-50 p-3 sm:flex-row sm:items-center">
          <a
            className="min-w-0 flex-1 break-all text-sm font-bold text-teal-800 no-underline hover:text-teal-900"
            href={inviteLink}
          >
            {inviteLink}
          </a>
          <button
            className="rounded-md bg-white px-3 py-2 text-sm font-black text-teal-800 ring-1 ring-teal-200 transition hover:bg-teal-100"
            type="button"
            onClick={() => void handleCopyInvite()}
          >
            {copiedInvite ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </section>
  );
};

export default InvitePanel;
