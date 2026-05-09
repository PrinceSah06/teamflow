import { create } from "zustand";
import api from "../config/axios";

export type Note = {
  id: string;
  title: string | null;
  content: string | null;
  updatedAt: string | null;
};

export type Organization = {
  id: string;
  name: string;
  createdAt: string;
  role: "owner" | "admin" | "member";
};

export type OrgMember = {
  id: string;
  userId: string;
  email: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
};

type NotesState = {
  notes: Note[];
  activeNote: Note | null;
  organizations: Organization[];
  orgMembers: OrgMember[];
  orgId: string | null;
  status: "idle" | "editing" | "saving" | "saved" | "error";
  error: string | null;
  inviteLink: string | null;

  setActiveNote: (note: Note) => void;
  setStatus: (
    status: "idle" | "editing" | "saving" | "saved" | "error",
  ) => void;
  setNotes: (notes: Note[]) => void;
  loadOrganizations: () => Promise<void>;
  loadOrgMembers: (orgId?: string) => Promise<void>;
  selectOrganization: (orgId: string) => Promise<void>;
  createOrganization: () => Promise<void>;
  createInvite: (email: string) => Promise<void>;
  loadNotes: () => Promise<void>;
  createNote: () => Promise<void>;
  updateNote: (noteId: string, payload: { title?: string; content?: string }) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  clearNotes: () => void;
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
  organizations: [],
  orgMembers: [],
  orgId: null,
  status: "idle",
  error: null,
  inviteLink: null,

  setActiveNote: (note) => {
    set({ activeNote: note });
  },
  setStatus: (status) => {
    set({ status });
  },

  setNotes: (notes: Note[]) => {
    set({ notes });
  },

  loadOrganizations: async () => {
    set({ status: "saving", error: null });

    try {
      const orgId = get().orgId ?? (await getOrCreateOrgId());
      const response = await api.get("/api/orgs/me");
      const organizations = response.data.data.organizations as Organization[];
      const selectedOrgId = organizations.some((org) => org.id === orgId)
        ? orgId
        : (organizations[0]?.id ?? null);

      set({
        organizations,
        orgId: selectedOrgId,
        status: "saved",
      });
      await get().loadOrgMembers(selectedOrgId ?? undefined);
    } catch (error) {
      set({ status: "error", error: getErrorMessage(error, "Unable to load organizations") });
    }
  },

  loadOrgMembers: async (selectedOrgId) => {
    const orgId = selectedOrgId ?? get().orgId;

    if (!orgId) {
      set({ orgMembers: [] });
      return;
    }

    try {
      // This is how the UI knows which users are in the same organization:
      // the selected org id is sent to the API, and the server returns members
      // whose member.orgId matches this value.
      const response = await api.get(`/api/orgs/${orgId}/members`);
      set({ orgMembers: response.data.data.members as OrgMember[] });
    } catch (error) {
      set({
        orgMembers: [],
        status: "error",
        error: getErrorMessage(error, "Unable to load organization members"),
      });
    }
  },

  selectOrganization: async (orgId) => {
    set({ orgId, activeNote: null, notes: [], orgMembers: [], inviteLink: null });
    await get().loadNotes();
  },

  createOrganization: async () => {
    set({ status: "saving", error: null, inviteLink: null });

    try {
      const createResponse = await api.post("/api/orgs");
      const orgId = createResponse.data.data.organization.id as string;
      const orgsResponse = await api.get("/api/orgs/me");
      const organizations = orgsResponse.data.data.organizations as Organization[];

      set({ organizations, orgId, notes: [], activeNote: null, orgMembers: [], status: "saved" });
      await get().loadNotes();
    } catch (error) {
      set({ status: "error", error: getErrorMessage(error, "Unable to create organization") });
    }
  },

  createInvite: async (email) => {
    const orgId = get().orgId;

    if (!orgId) {
      set({ status: "error", error: "Organization not loaded" });
      return;
    }

    set({ status: "saving", error: null, inviteLink: null });

    try {
      const response = await api.post(`/api/orgs/${orgId}/invite-link`, { email });
      set({
        inviteLink: response.data.data.inviteLink as string,
        status: "saved",
      });
    } catch (error) {
      set({ status: "error", error: getErrorMessage(error, "Unable to create invite link") });
    }
  },

  loadNotes: async () => {
    set({ status: "saving", error: null });

    try {
      const orgId = get().orgId ?? (await getOrCreateOrgId());
      const orgsResponse = await api.get("/api/orgs/me");
      const response = await api.get(`/notes/${orgId}`);
      const organizations = orgsResponse.data.data.organizations as Organization[];
      const notes = response.data.data.notes as Note[];

      set({
        orgId,
        organizations,
        notes,
        activeNote: notes[0] ?? null,
        status: "saved",
      });
      await get().loadOrgMembers(orgId);
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

  deleteNote: async (noteId) => {
    const orgId = get().orgId;

    if (!orgId) {
      set({ status: "error", error: "Organization not loaded" });
      return;
    }

    set({ status: "saving", error: null });

    try {
      await api.delete(`/notes/${orgId}/${noteId}`);

      set((state) => {
        const notes = state.notes.filter((note) => note.id !== noteId);
        return {
          notes,
          activeNote: state.activeNote?.id === noteId ? (notes[0] ?? null) : state.activeNote,
          status: "saved",
        };
      });
    } catch (error) {
      set({ status: "error", error: getErrorMessage(error, "Unable to delete note") });
    }
  },

  clearNotes: () => {
    set({
      notes: [],
      activeNote: null,
      organizations: [],
      orgMembers: [],
      orgId: null,
      status: "idle",
      error: null,
      inviteLink: null,
    });
  },
}));
