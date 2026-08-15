"use client";

import { config } from "@/lib/config";
import { getStoredSession, refreshSession } from "@/lib/auth-session";
import type { Goal, Milestone } from "@/lib/demo-data";

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
    throw new Error(`n8n request failed (${response.status})${detail ? ` - ${detail}` : ""}`);
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

export type MilestoneDraft = {
  title: string;
  order_index: number;
  start_date?: string | null;
  end_date?: string | null;
};

export type N8nDashboard = {
  success?: boolean;
  goals_completed: number;
  milestones_completed: number;
  weekly_consistency: string | number;
  current_streak: number;
  upcoming_milestone_deadlines: Array<{
    id: string;
    goal_id?: string;
    title: string;
    end_date?: string | null;
    due_date?: string | null;
    status?: string;
  }>;
};

export type N8nCreateGoalResult = {
  success: boolean;
  goal?: Partial<Goal> & { id: string };
  milestones?: Array<Partial<Milestone> & { id: string; title: string }>;
};

export type N8nCheckinResult = {
  success?: boolean;
  feedback?: string;
};

export type N8nCheckinHistoryResult = {
  history: Array<{
    id: string;
    context: string;
    feedback?: string | null;
    created_at: string;
    marks_milestone_complete?: boolean;
  }>;
};

export function getDashboard(token?: string) {
  return request<N8nDashboard>("dashboard", "GET", { token });
}

export function generateMilestonesLive(
  token: string | undefined,
  body: { title: string; description: string; application_tags: string[] },
) {
  return request<{ milestones: MilestoneDraft[] }>("generate-milestones", "POST", { token, body });
}

export function createGoalLive(
  token: string | undefined,
  body: {
    title: string;
    description: string;
    application_tags: string[];
    milestones_source: "ai_generated" | "user_provided";
    target_start_date: string | null;
    target_end_date: string;
    milestones: MilestoneDraft[];
  },
) {
  return request<N8nCreateGoalResult>("goal-create", "POST", { token, body });
}

export function submitCheckinLive(
  token: string | undefined,
  body: {
    goal_id: string;
    milestone_id: string;
    context: string;
    marks_milestone_complete: boolean;
  },
) {
  return request<N8nCheckinResult>("checkin", "POST", { token, body });
}

export function getMilestonesLive(token: string | undefined, goalId: string) {
  return request<{ milestones: Milestone[] }>(`milestones?goal_id=${encodeURIComponent(goalId)}`, "GET", { token });
}

export function getCheckinHistoryLive(token: string | undefined, goalId: string, milestoneId: string) {
  return request<N8nCheckinHistoryResult>(
    `checkin-history?goal_id=${encodeURIComponent(goalId)}&milestone_id=${encodeURIComponent(milestoneId)}`,
    "GET",
    { token },
  );
}

export function transcribeLive(token: string | undefined, body: { audio_base64: string; mime_type: string }) {
  return request<{ text: string }>("transcribe", "POST", { token, body });
}
