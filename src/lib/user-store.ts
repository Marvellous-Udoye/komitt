"use client";

import { create } from "zustand";
import { getStoredSession, type UserProfile } from "@/lib/auth-session";

type UserState = {
  user: UserProfile | null;
  initialized: boolean;
  hydrate: () => void;
  setUser: (user: UserProfile | null) => void;
};

export const useUser = create<UserState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user, initialized: true }),
  hydrate: () => {
    const session = getStoredSession();
    set({ user: session?.user ?? null, initialized: true });
  },
}));