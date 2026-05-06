import { create } from "zustand";
import api from "../config/axios";

export type Note = {
  id: string;
  title: string | null;
  content: string | null;
  updatedAt: string | null;
};

type Organization = {
  id: string;
  name: string;
  createdAt: string;
  role: "owner" | "admin" | "member";
};

type NotesState = {
  notes: Note[];
  activeNote: Note | null;
  orgId: string | null;
  status: "idle" | "editing" | "saving" | "saved" | "error";
  error: string | null;

  setActiveNote: (note: Note) => void;
  setStatus: (
    status: "idle" | "editing" | "saving" | "saved" | "error",
  ) => void;
  setNotes: (notes: Note[]) => void;
  loadNotes: () => Promise<void>;
  createNote: () => Promise<void>;
  updateNote: (noteId: string, payload: { title?: string; content?: string }) => Promise<void>;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { error?: string; message?: string } } })
      .response;
    return response?.data?.error ?? response?.data?.message ?? fallback;
  }

  return fallback;
};

const getOrCreateOrgId = async () => {
  const orgsResponse = await api.get("/api/orgs/me");
  const organizations = orgsResponse.data.data.organizations as Organization[];

  if (organizations.length > 0) {
    return organizations[0].id;
  }

  const createResponse = await api.post("/api/orgs");
  return createResponse.data.data.organization.id as string;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  activeNote: null,
  notes: [],
  orgId: null,
  status: "idle",
  error: null,

  setActiveNote: (note) => {
    set({ activeNote: note });
  },
  setStatus: (status) => {
    set({ status });
  },

  setNotes: (notes: Note[]) => {
    set({ notes });
  },

  loadNotes: async () => {
    set({ status: "saving", error: null });

    try {
      const orgId = get().orgId ?? (await getOrCreateOrgId());
      const response = await api.get(`/notes/${orgId}`);
      const notes = response.data.data.notes as Note[];

      set({
        orgId,
        notes,
        activeNote: notes[0] ?? null,
        status: "saved",
      });
    } catch (error) {
      set({ status: "error", error: getErrorMessage(error, "Unable to load notes") });
    }
  },

  createNote: async () => {
    set({ status: "saving", error: null });

    try {
      const orgId = get().orgId ?? (await getOrCreateOrgId());
      await api.post(`/notes/${orgId}`, {
        title: "Untitled note",
        content: "",
      });

      const response = await api.get(`/notes/${orgId}`);
      const notes = response.data.data.notes as Note[];

      set({
        orgId,
        notes,
        activeNote: notes[0] ?? null,
        status: "saved",
      });
    } catch (error) {
      set({ status: "error", error: getErrorMessage(error, "Unable to create note") });
    }
  },

  updateNote: async (noteId, payload) => {
    const orgId = get().orgId;

    if (!orgId) {
      set({ status: "error", error: "Organization not loaded" });
      return;
    }

    set({ status: "saving", error: null });

    try {
      const response = await api.patch(`/notes/${orgId}/${noteId}`, payload);
      const updatedNote = response.data.data.note as Note;

      set((state) => ({
        notes: state.notes.map((note) => (note.id === noteId ? updatedNote : note)),
        activeNote: state.activeNote?.id === noteId ? updatedNote : state.activeNote,
        status: "saved",
      }));
    } catch (error) {
      set({ status: "error", error: getErrorMessage(error, "Unable to save note") });
    }
  },
}));
