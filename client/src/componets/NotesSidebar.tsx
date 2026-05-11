import { useMemo, useState } from "react";
import type { Note } from "../store/notesStore";

type NotesSidebarProps = {
  notes: Note[];
  activeNote: Note | null;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onSelectNote: (note: Note) => void;
};

const NotesSidebar = ({
  notes,
  activeNote,
  onCreateNote,
  onDeleteNote,
  onSelectNote,
}: NotesSidebarProps) => {
  const [search, setSearch] = useState("");
  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter((note) => {
      return [note.title, note.content].some((value) =>
        value?.toLowerCase().includes(query),
      );
    });
  }, [notes, search]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-normal text-slate-500">
            Notes
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-950">{notes.length} total</h2>
        </div>
        <button
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white transition hover:bg-slate-800"
          type="button"
          onClick={onCreateNote}
        >
          New note
        </button>
      </div>

      <input
        className="mt-4 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        value={search}
        placeholder="Search notes"
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="mt-4 grid max-h-[420px] gap-2 overflow-auto pr-1">
        {filteredNotes.map((note) => (
          <div
            className={`rounded-md border transition ${
              activeNote?.id === note.id
                ? "border-teal-500 bg-teal-50"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
            key={note.id}
          >
            <button
              className="w-full px-3 py-2 text-left"
              type="button"
              onClick={() => onSelectNote(note)}
            >
              <h3 className="truncate text-sm font-black text-slate-950">
                {note.title || "Untitled note"}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {note.content || "No content yet"}
              </p>
            </button>
            <div className="flex justify-end border-t border-slate-200 px-3 py-2">
              <button
                className="text-xs font-black text-red-600 transition hover:text-red-700"
                type="button"
                onClick={() => onDeleteNote(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
            No notes match your search.
          </p>
        )}
      </div>
    </section>
  );
};

export default NotesSidebar;
