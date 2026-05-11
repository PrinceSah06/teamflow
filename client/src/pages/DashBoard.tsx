import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../componets/DashboardHeader";
import InvitePanel from "../componets/InvitePanel";
import MembersPanel from "../componets/MembersPanel";
import NoteEditer from "../componets/NoteEditer";
import NotesSidebar from "../componets/NotesSidebar";
import WorkspacePanel from "../componets/WorkspacePanel";
import { socket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/notesStore";

const DashBoard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const notes = useNotesStore((state) => state.notes);
  const activeNote = useNotesStore((state) => state.activeNote);
  const organizations = useNotesStore((state) => state.organizations);
  const orgMembers = useNotesStore((state) => state.orgMembers);
  const orgId = useNotesStore((state) => state.orgId);
  const status = useNotesStore((state) => state.status);
  const error = useNotesStore((state) => state.error);
  const inviteLink = useNotesStore((state) => state.inviteLink);
  const loadNotes = useNotesStore((state) => state.loadNotes);
  const setActiveNote = useNotesStore((state) => state.setActiveNote);
  const createNote = useNotesStore((state) => state.createNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const createOrganization = useNotesStore((state) => state.createOrganization);
  const selectOrganization = useNotesStore((state) => state.selectOrganization);
  const createInvite = useNotesStore((state) => state.createInvite);
  const clearNotes = useNotesStore((state) => state.clearNotes);
  const activeOrganization = organizations.find((org) => org.id === orgId);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    const handleConnect = () => {
      if (orgId) {
        socket.emit("join-room", orgId);
      }
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      socket.connect();
    } else if (orgId) {
      socket.emit("join-room", orgId);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [orgId]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    clearNotes();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-svh bg-slate-100 text-left text-slate-900">
      <DashboardHeader email={user?.email} onLogout={() => void handleLogout()} />

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[320px_1fr]">
        <aside className="grid gap-4 lg:sticky lg:top-4 lg:self-start">
          <WorkspacePanel
            organizations={organizations}
            activeOrganization={activeOrganization}
            orgId={orgId}
            onCreateOrganization={() => void createOrganization()}
            onSelectOrganization={(selectedOrgId) => void selectOrganization(selectedOrgId)}
          />

          <MembersPanel members={orgMembers} currentUserId={user?.id} />

          <NotesSidebar
            notes={notes}
            activeNote={activeNote}
            onCreateNote={() => void createNote()}
            onDeleteNote={(noteId) => void deleteNote(noteId)}
            onSelectNote={setActiveNote}
          />
        </aside>

        <section className="grid gap-4">
          <InvitePanel
            inviteLink={inviteLink}
            onCreateInvite={(email) => createInvite(email)}
          />

          <NoteEditer
            activeNote={activeNote}
            status={status}
            error={error}
            onCreateNote={() => void createNote()}
            onUpdateNote={updateNote}
          />
        </section>
      </main>
    </div>
  );
};

export default DashBoard;
