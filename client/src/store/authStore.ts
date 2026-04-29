import { create } from "zustand";
import api from "../config/axios";

type AuthState = {
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  user: AuthUser | null;
  login: (payload: AuthPayload) => Promise<string>;
  signup: (payload: AuthPayload) => Promise<string>;
  logout: () => Promise<void>;
  setAuth: (payload: AuthSuccess) => void;
  clearToken: () => void;
};

type AuthPayload = {
  email: string;
  password: string;
};

type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

type AuthSuccess = {
  accessToken?: string | null;
  user?: AuthUser | null;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? fallback;
  }

  return fallback;
};

const setAuthorizationHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  accessToken: null,
  user: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/login", payload);
      const { accessToken, user, message } = response.data;

      setAuthorizationHeader(accessToken);
      set({
        accessToken,
        user,
        isLoading: false,
        error: null,
      });

      return message ?? "Logged in successfully";
    } catch (error) {
      const message = getErrorMessage(error, "Login failed");
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  signup: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/register", payload);
      const { user, message } = response.data;

      set({
        user,
        isLoading: false,
        error: null,
      });

      return message ?? "Account created successfully";
    } catch (error) {
      const message = getErrorMessage(error, "Signup failed");
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await api.post("/logout");
    } finally {
      setAuthorizationHeader(null);
      set({
        accessToken: null,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  },

  setAuth: ({ accessToken = null, user = null }) => {
    setAuthorizationHeader(accessToken);
    set(() => ({
      accessToken,
      user,
      error: null,
    }));
  },

  clearToken: () => {
    setAuthorizationHeader(null);
    set(() => ({
      accessToken: null,
      user: null,
      error: null,
    }));
  },
}));
