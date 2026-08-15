"use client";

import { config } from "@/lib/config";
import {
  addDays,
  toISODate,
  type Checkin,
  type Goal,
  type GoalStatus,
  type Insight,
  type Milestone,
  type MilestoneStatus,
  type WeeklyPoint,
} from "@/lib/demo-data";

type GoalRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  application_tags: string[] | null;
  milestones_source: "ai_generated" | "user_provided" | null;
  target_start_date: string | null;
  target_end_date: string | null;
  status: string;
  created_at: string;
};

type MilestoneRow = {
  id: string;
  goal_id: string;
  title: string;
  order_index: number | null;
  ai_generated: boolean | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
};

type CheckinRow = {
  id: string;
  user_id: string;
  goal_id: string;
  milestone_id: string;
  context: string;
  marks_milestone_complete: boolean | null;
  created_at: string;
};

type InsightRow = {
  id: string;
  goal_id: string | null;
  milestone_id: string | null;
  checkin_id: string | null;
  insight_type: Insight["category"];
  content: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  timezone: string;
  email: string | null;
  notification_hour: number | null;
};

export type SupabaseDashboardData = {
  goals: Goal[];
  milestones: Milestone[];
  checkins: Checkin[];
  insights: Insight[];
  weekly: WeeklyPoint[];
  streak: number;
  notificationHour: number;
};

async function supabase<T>(table: string, select: string, token: string): Promise<T[]> {
  if (!config.supabaseUrl || !config.supabaseAnonKey || !token) return [];

  const response = await fetch(
    `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?select=${encodeURIComponent(select)}`,
    {
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase read failed (${response.status})${body ? ` - ${body}` : ""}`);
  }

  return (await response.json()) as T[];
}

async function patchSupabase(table: string, id: string, token: string, body: unknown) {
  if (!config.supabaseUrl || !config.supabaseAnonKey || !token) return false;

  const response = await fetch(
    `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    },
  );

  return response.ok;
}

function normalizeGoalStatus(status: string): GoalStatus {
  if (status === "not_started" || status === "paused" || status === "completed") return status;
  return "active";
}

function normalizeMilestoneStatus(status: string): MilestoneStatus {
  if (status === "in_progress" || status === "completed") return status;
  return "pending";
}

export async function fetchDashboardData(token: string): Promise<SupabaseDashboardData | null> {
  const [profileRows, goalRows, milestoneRows, checkinRows, insightRows] = await Promise.all([
    supabase<ProfileRow>("profiles", "id,timezone,email,notification_hour", token),
    supabase<GoalRow>("goals", "*", token),
    supabase<MilestoneRow>("milestones", "*", token),
    supabase<CheckinRow>("checkins", "*", token),
    supabase<InsightRow>("ai_insights", "*", token),
  ]);

  const goalsById = new Map<string, Goal>();
  const goals: Goal[] = goalRows.map((row) => {
    const goal: Goal = {
      id: row.id,
      title: row.title,
      description: row.description,
      applicationTags: row.application_tags ?? [],
      milestonesSource: row.milestones_source ?? "ai_generated",
      status: normalizeGoalStatus(row.status),
      milestones: 0,
      milestonesDone: 0,
      createdAt: (row.created_at ?? "").slice(0, 10),
      targetStartDate: row.target_start_date,
      targetEndDate: row.target_end_date ?? "",
    };
    goalsById.set(goal.id, goal);
    return goal;
  });

  const milestones: Milestone[] = milestoneRows
    .map((row) => {
      const goal = goalsById.get(row.goal_id);
      return {
        id: row.id,
        goalId: row.goal_id,
        goalTitle: goal?.title ?? "-",
        title: row.title,
        orderIndex: row.order_index ?? 0,
        aiGenerated: row.ai_generated ?? false,
        startDate: row.start_date ?? "",
        endDate: row.end_date ?? "",
        status: normalizeMilestoneStatus(row.status),
      };
    })
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const milestonesById = new Map(milestones.map((milestone) => [milestone.id, milestone]));
  for (const milestone of milestones) {
    const goal = goalsById.get(milestone.goalId);
    if (!goal) continue;
    goal.milestones += 1;
    if (milestone.status === "completed") goal.milestonesDone += 1;
  }

  const checkins: Checkin[] = checkinRows
    .map((row) => {
      const milestone = milestonesById.get(row.milestone_id);
      const goal = goalsById.get(row.goal_id);
      const feedback =
        insightRows.find((insight) => insight.checkin_id === row.id && insight.insight_type === "checkin_feedback")
          ?.content ?? "";
      return {
        id: row.id,
        goalId: row.goal_id,
        goalTitle: goal?.title ?? "-",
        milestoneId: row.milestone_id,
        milestoneTitle: milestone?.title ?? "-",
        context: row.context,
        feedback,
        marksMilestoneComplete: row.marks_milestone_complete ?? false,
        createdAt: row.created_at,
      };
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const insights = insightRows
    .filter((row) => row.insight_type !== "checkin_feedback")
    .map((row) => ({
      id: row.id,
      content: row.content,
      created_at: row.created_at,
      category: row.insight_type,
      goalId: row.goal_id,
      milestoneId: row.milestone_id,
    }));

  return {
    goals,
    milestones,
    checkins,
    insights,
    weekly: buildWeekly(milestones),
    streak: computeStreak(checkins),
    notificationHour: profileRows[0]?.notification_hour ?? 7,
  };
}

function buildWeekly(milestones: Milestone[]): WeeklyPoint[] {
  const start = addDays(new Date(), -6);
  const points: WeeklyPoint[] = [];
  for (let index = 0; index < 7; index += 1) {
    const day = toISODate(addDays(start, index));
    const dayMilestones = milestones.filter(
      (milestone) => milestone.endDate && milestone.endDate.slice(0, 10) === day,
    );
    points.push({
      day: day.slice(5),
      completed: dayMilestones.filter((milestone) => milestone.status === "completed").length,
      total: dayMilestones.length,
    });
  }
  return points;
}

function computeStreak(checkins: Checkin[]): number {
  if (checkins.length === 0) return 0;
  const dates = new Set(checkins.map((checkin) => checkin.createdAt.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  if (!dates.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function updateMilestoneStatusDirect(token: string, milestoneId: string, status: MilestoneStatus) {
  return patchSupabase("milestones", milestoneId, token, { status });
}

export function updateNotificationHourDirect(token: string, profileId: string, notificationHour: number) {
  return patchSupabase("profiles", profileId, token, { notification_hour: notificationHour });
}
