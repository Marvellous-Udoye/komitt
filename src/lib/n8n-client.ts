"use client";

import { config } from "@/lib/config";

type RequestOptions = {
  token?: string;
  body?: unknown;
};

async function request<T>(path: string, method: "GET" | "POST", options: RequestOptions = {}) {
  if (!config.n8nBaseUrl) {
    throw new Error("NEXT_PUBLIC_N8N_BASE_URL is not configured.");
  }

  const response = await fetch(`${config.n8nBaseUrl.replace(/\/$/, "")}/webhook/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`n8n request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export type DashboardStats = {
  goalsCompleted: number;
  tasksCompleted: number;
  weeklyConsistency: number;
  currentStreak: number;
  upcomingDeadlines: Array<{ id: string; title: string; due_date: string; priority: string }>;
  weeklyTasks?: Array<{ day: string; completed: number; total: number }>;
  insights?: Array<{ id: string; content: string; created_at: string }>;
};

export function getDashboard(token?: string) {
  return request<DashboardStats>("dashboard", "GET", { token });
}

export function createGoal(token: string | undefined, body: { title: string; description: string }) {
  return request<{ ok: boolean; goalId?: string }>("goal-create", "POST", { token, body });
}

export function submitCheckin(
  token: string | undefined,
  body: { completion_status: "yes" | "partially" | "no"; reflection: string },
) {
  return request<{ ok: boolean; feedback?: string }>("checkin", "POST", { token, body });
}
