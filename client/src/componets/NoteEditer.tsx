import { useEffect, useState } from "react";
import { useAutoSave } from "../hooks/useAutoSave";
import type { Note } from "../store/notesStore";
import SaveStatus from "./SaveStatus";

type NoteEditerProps = {
  activeNote: Note | null;
  status: "idle" | "editing" | "saving" | "saved" | "error";
  error: string | null;
  onCreateNote: () => void;
  onUpdateNote: (noteId: string, payload: { title?: string; content?: string }) => Promise<void>;
};

const NoteEditer = ({
  activeNote,
  status,
  error,
  onCreateNote,
  onUpdateNote,
}: NoteEditerProps) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(activeNote?.title ?? "");
    setContent(activeNote?.content ?? "");
  }, [activeNote]);

  useAutoSave(activeNote?.id ?? null, { title, content }, onUpdateNote);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <SaveStatus status={status} error={error} />

      {activeNote ? (
        <div className="grid gap-3">
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-3 text-xl font-black text-slate-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            value={title}
            placeholder="Note title"
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            className="min-h-[55svh] w-full resize-y rounded-md border border-slate-200 px-3 py-3 text-base leading-7 text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            name="Notes"
            value={content}
            placeholder="Start writing..."
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
      ) : (
        <div className="grid min-h-[45svh] place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <div>
            <h2 className="text-2xl font-black text-slate-950">No notes yet</h2>
            <p className="mt-2 text-slate-500">Create a note to start writing.</p>
            <button
              className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800"
              type="button"
              onClick={onCreateNote}
            >
              Create first note
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NoteEditer;
