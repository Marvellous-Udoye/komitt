"use client";

const SESSION_KEY = "commit.session";

export type CommitSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

export function getStoredSession(): CommitSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CommitSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: CommitSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function readSessionFromHash(hash: string): CommitSession | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  if (!accessToken) return null;

  const expiresIn = Number(params.get("expires_in") ?? "0");
  return {
    accessToken,
    refreshToken: params.get("refresh_token") ?? undefined,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
  };
}
