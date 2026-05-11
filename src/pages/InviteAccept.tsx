import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../config/axios";
import { useNotesStore } from "../store/notesStore";

const InviteAccept = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const loadNotes = useNotesStore((state) => state.loadNotes);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Joining organization...");
  const hasFetched = useRef(false);

  useEffect(() => {
    const acceptInvite = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invite token is missing.");
        return;
      }

      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await api.post(`/api/invites/${token}/accept`);
        setStatus("success");
        setMessage(response.data.data.message ?? "Joined organization");
        await loadNotes();
      } catch (error) {
        const response = (error as { response?: { data?: { error?: string; message?: string } } })
          .response;
        setStatus("error");
        setMessage(response?.data?.error ?? response?.data?.message ?? "Unable to accept invite");
      }
    };

    void acceptInvite();
  }, [loadNotes, token]);

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-6 text-slate-900">
      <main className="mx-auto grid min-h-[calc(100svh-48px)] max-w-xl place-items-center">
        <section className="w-full rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-bold uppercase text-teal-700">Team invite</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {status === "loading" ? "Accepting invite" : status === "success" ? "You're in" : "Invite failed"}
          </h1>
          <p className="mt-3 text-base text-slate-600">{message}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {status === "success" && (
              <button
                className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                type="button"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Open dashboard
              </button>
            )}
            {status === "error" && (
              <Link
                className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-slate-800"
                to="/dashboard"
              >
                Back to dashboard
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default InviteAccept;
