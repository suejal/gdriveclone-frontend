import { create } from "zustand";
import { api } from "../lib/api";

type User = { id: string; email: string; name?: string };

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loadMe: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  async login(email, password) {
    set({ loading: true });
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      set({ token: data.token });
      await get().loadMe();
    } finally {
      set({ loading: false });
    }
  },
  async signup(email, password, name) {
    set({ loading: true });
    try {
      await api.post("/api/auth/signup", { email, password, name });
      await get().login(email, password);
    } finally {
      set({ loading: false });
    }
  },
  logout() {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
  async loadMe() {
    try {
      const { data } = await api.get("/api/me");
      set({ user: data.user });
    } catch {
      set({ user: null });
    }
  },
}));

