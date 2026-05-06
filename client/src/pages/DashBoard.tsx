import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAutoSave } from "../hooks/useAutoSave";
import { useNotesStore } from "../store/notesStore";

const DashBoard = () => {
  const notes = useNotesStore((state) => state.notes);
  const [openInEditer, setOpenInEditer] = useState<string>("");
  const [title, setTitle] = useState("");
  const setActiveNote = useNotesStore((state) => state.setActiveNote);
  const activeNote = useNotesStore((state) => state.activeNote);
  const status = useNotesStore((state) => state.status);
  const error = useNotesStore((state) => state.error);
  const loadNotes = useNotesStore((state) => state.loadNotes);
  const createNote = useNotesStore((state) => state.createNote);
  const updateNote = useNotesStore((state) => state.updateNote);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    setTitle(activeNote?.title ?? "");
    setOpenInEditer(activeNote?.content ?? "");
  }, [activeNote]);

  useAutoSave(activeNote?.id ?? null, { title, content: openInEditer }, updateNote);

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-6 text-left text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <Link className="text-sm font-semibold text-teal-700" to="/">
                Home
              </Link>
              <h1 className="m-0 text-2xl font-bold text-slate-950">Dashboard</h1>
            </div>
            <button
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              type="button"
              onClick={() => void createNote()}
            >
              New
            </button>
          </div>

          <div className="grid gap-2">
            {notes.map((note) => (
              <button
                className={`rounded-md border px-3 py-2 text-left transition ${
                  activeNote?.id === note.id
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
                key={note.id}
                type="button"
                onClick={() => {
                  setActiveNote(note);
                }}
              >
                <h2 className="m-0 truncate text-base font-semibold text-slate-950">
                  {note.title || "Untitled note"}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {note.content || "No content yet"}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <p className="text-sm font-medium capitalize text-slate-500">{status}</p>
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          </div>

          {activeNote ? (
            <div className="grid gap-3">
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-3 text-xl font-bold text-slate-950 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                value={title}
                placeholder="Note title"
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="min-h-[520px] w-full resize-none rounded-md border border-slate-200 px-3 py-3 text-base leading-7 text-slate-700 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                name="Notes"
                value={openInEditer}
                placeholder="Start writing..."
                onChange={(e) => setOpenInEditer(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid min-h-[520px] place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div>
                <h2 className="m-0 text-xl font-bold text-slate-950">No notes yet</h2>
                <p className="mt-2 text-slate-500">Create a note to start writing.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashBoard;
