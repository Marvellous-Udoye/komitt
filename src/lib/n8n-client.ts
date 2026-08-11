"use client";

import { config } from "@/lib/config";
import { getStoredSession, refreshSession } from "@/lib/auth-session";

type RequestOptions = {
  token?: string;
  body?: unknown;
};

async function request<T>(path: string, method: "GET" | "POST", options: RequestOptions = {}) {
  let token = options.token;
  if (!token) {
    const session = getStoredSession();
    if (session && session.accessToken !== "demo-session-token") {
      token = (await refreshSession())?.accessToken ?? session.accessToken;
    }
  }

  const response = await fetch(`/api/n8n/${path}`, {
    method,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`n8n request failed (${response.status})${detail ? ` — ${detail}` : ""}`);
  }

  const text = await response.text().catch(() => "");
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

export function isLiveMode() {
  if (!config.n8nBaseUrl) return false;
  const token = typeof window === "undefined" ? undefined : getStoredSession()?.accessToken;
  return Boolean(token && token !== "demo-session-token");
}

export type N8nUpcomingDeadline = {
  id: string;
  title: string;
  due_date: string;
  priority: string;
};

export type N8nDashboard = {
  success: boolean;
  goals_completed: number;
  tasks_completed: number;
  weekly_consistency: string;
  current_streak: number;
  upcoming_deadlines: N8nUpcomingDeadline[];
};

export type N8nTaskInput = {
  id: string;
  title: string;
  priority?: string | null;
  due_date?: string | null;
  estimated_duration_minutes?: number | null;
  milestone_id?: string;
};

export type N8nCreateGoalResult = {
  success: boolean;
  goal?: {
    id: string;
    user_id?: string;
    title: string;
    description: string | null;
  };
  milestones?: Array<{ id: string; title: string; order_index?: number }>;
  tasks?: N8nTaskInput[];
};

export type N8nCheckinResult = {
  success: boolean;
  feedback?: string;
};

export function getDashboard(token?: string) {
  return request<N8nDashboard>("dashboard", "GET", { token });
}

export function createGoalLive(
  token: string | undefined,
  body: { title: string; description: string },
) {
  return request<N8nCreateGoalResult>("goal-create", "POST", { token, body });
}

export function submitCheckinLive(
  token: string | undefined,
  body: { completion_status: "yes" | "partially" | "no"; reflection: string },
) {
  return request<N8nCheckinResult>("checkin", "POST", { token, body });
}