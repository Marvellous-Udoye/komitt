"use client";

import { config } from "@/lib/config";

const SESSION_KEY = "komitt.session";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export type KomittSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user?: UserProfile;
};

export function getStoredSession(): KomittSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as KomittSession;
    if (!session.user && session.accessToken && session.accessToken !== "demo-session-token") {
      const decoded = getUserFromJwt(session.accessToken);
      if (decoded) session.user = decoded;
    }
    return session;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function getSessionUser(): UserProfile | null {
  return getStoredSession()?.user ?? null;
}

export function isRealSession(): boolean {
  const session = getStoredSession();
  return Boolean(session?.accessToken && session.accessToken !== "demo-session-token");
}

export function storeSession(session: KomittSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export async function refreshSession(): Promise<KomittSession | null> {
  const session = getStoredSession();
  if (!session?.accessToken || session.accessToken === "demo-session-token") return null;
  if (session.expiresAt && session.expiresAt > Date.now() + 60000) return session;
  if (!session.refreshToken || !config.supabaseUrl) return null;

  try {
    const response = await fetch(
      `${config.supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.supabaseAnonKey,
        },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      user?: UserProfile;
    };
    const next: KomittSession = {
      accessToken: data.access_token ?? session.accessToken,
      refreshToken: data.refresh_token ?? session.refreshToken,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : session.expiresAt,
      user: data.user ?? session.user,
    };
    storeSession(next);
    return next;
  } catch {
    return session;
  }
}

export function readSessionFromHash(hash: string): KomittSession | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  if (!accessToken) return null;

  const expiresIn = Number(params.get("expires_in") ?? "0");
  const session: KomittSession = {
    accessToken,
    refreshToken: params.get("refresh_token") ?? undefined,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
  };

  const user = parseUserParam(params.get("user")) ?? getUserFromJwt(accessToken);
  if (user) session.user = user;

  return session;
}

function parseUserParam(rawUser: string | null): UserProfile | null {
  if (!rawUser) return null;
  try {
    const parsed = JSON.parse(rawUser) as {
      id?: string;
      email?: string;
      avatar_url?: string;
      user_metadata?: {
        full_name?: string;
        name?: string;
        email?: string;
        avatar_url?: string;
        picture?: string;
      };
    };
    const meta = parsed.user_metadata ?? {};
    const email = parsed.email ?? meta.email ?? "";
    const name = meta.full_name ?? meta.name ?? (email ? email.split("@")[0] : "") ?? "Komitt user";
    return {
      id: parsed.id ?? "",
      email,
      name,
      avatarUrl: meta.avatar_url ?? meta.picture ?? parsed.avatar_url ?? undefined,
    };
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getUserFromJwt(token: string): UserProfile | null {
  const data = decodeJwtPayload(token);
  if (!data) return null;
  const meta = (data.user_metadata ?? {}) as Record<string, unknown>;
  const email = (data.email as string) ?? "";
  const name =
    (meta.full_name as string) ??
    (meta.name as string) ??
    (email ? email.split("@")[0] : "Komitt user");
  return {
    id: (data.sub as string) ?? "",
    email,
    name,
    avatarUrl: (meta.avatar_url as string) ?? (meta.picture as string) ?? undefined,
  };
}

export function signOut() {
  const token = getStoredSession()?.accessToken;
  clearSession();

  if (token && config.supabaseUrl) {
    fetch(`${config.supabaseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => undefined);
  }

  window.location.href = "/";
}

export function backendSignOut() {
  const token = getStoredSession()?.accessToken;
  clearSession();
  if (token && config.supabaseUrl) {
    fetch(`${config.supabaseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => undefined);
  }
}

export function isSessionExpired(): boolean {
  const session = getStoredSession();
  if (!session?.accessToken || session.accessToken === "demo-session-token") return false;
  if (!session.expiresAt) return false;
  return session.expiresAt <= Date.now();
}