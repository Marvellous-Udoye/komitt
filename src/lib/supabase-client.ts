"use client";

import { config } from "@/lib/config";
import {
  addDays,
  toISODate,
  type Checkin,
  type CheckinStatus,
  type Goal,
  type GoalStatus,
  type Insight,
  type Task,
  type TaskStatus,
  type WeeklyPoint,
} from "@/lib/demo-data";

const CHECKIN_STATUS_MAP: Record<string, CheckinStatus> = {
  yes: "yes",
  partially: "partially",
  no: "no",
};

type GoalRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
};

type MilestoneRow = {
  id: string;
  goal_id: string;
  title: string;
  order_index: number | null;
  status: string;
  created_at: string;
};

type TaskRow = {
  id: string;
  user_id: string;
  milestone_id: string | null;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
};

type CheckinRow = {
  id: string;
  user_id: string;
  created_at: string;
  completion_status: string;
  reflection: string | null;
};

export type SupabaseDashboardData = {
  goals: Goal[];
  milestones: Array<{ id: string; goalId: string; title: string; done: boolean }>;
  tasks: Task[];
  checkins: Checkin[];
  insights: Insight[];
  weekly: WeeklyPoint[];
  streak: number;
};

async function supabase<T>(table: string, select: string, token: string): Promise<T[]> {
  if (!config.supabaseUrl || !config.supabaseAnonKey || !token) return [];

  const response = await fetch(
    `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?select=${encodeURIComponent(
      select,
    )}`,
    {
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase read failed (${response.status})${body ? ` — ${body}` : ""}`);
  }

  return (await response.json()) as T[];
}

function normalizeGoalStatus(status: string): GoalStatus {
  if (status === "completed") return "completed";
  if (status === "paused") return "paused";
  return "active";
}

function normalizeTaskStatus(status: string): TaskStatus {
  if (status === "done") return "done";
  if (status === "in_progress") return "in_progress";
  return "todo";
}

function normalizePriority(priority: string): Task["priority"] {
  if (priority === "low" || priority === "high") return priority;
  return "medium";
}

export async function fetchDashboardData(token: string): Promise<SupabaseDashboardData | null> {
  const [goalRows, milestoneRows, taskRows, checkinRows] = await Promise.all([
    supabase<GoalRow>("goals", "*,created_at", token),
    supabase<MilestoneRow>("milestones", "*,created_at", token),
    supabase<TaskRow>("tasks", "*,created_at", token),
    supabase<CheckinRow>("checkins", "*,created_at", token),
  ]);

  const goalsById = new Map<string, Goal>();
  const goals: Goal[] = goalRows.map((row) => {
    const goal: Goal = {
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      category: "Personal",
      status: normalizeGoalStatus(row.status),
      milestones: 0,
      milestonesDone: 0,
      createdAt: (row.created_at ?? "").slice(0, 10),
      dueDate: "",
    };
    goalsById.set(row.id, goal);
    return goal;
  });

  const milestones = milestoneRows.map((row) => ({
    id: row.id,
    goalId: row.goal_id,
    title: row.title,
    done: row.status === "completed" || row.status === "done",
  }));

  for (const milestone of milestones) {
    const goal = goalsById.get(milestone.goalId);
    if (!goal) continue;
    goal.milestones += 1;
    if (milestone.done) goal.milestonesDone += 1;
  }

  const goalTitleById = new Map<string, string>();
  for (const milestone of milestones) {
    goalTitleById.set(milestone.id, goalsById.get(milestone.goalId)?.title ?? "—");
  }

  const tasks: Task[] = taskRows.map((row) => ({
    id: row.id,
    title: row.title,
    goalId: "",
    goalTitle: row.milestone_id ? (goalTitleById.get(row.milestone_id) ?? "—") : "—",
    status: normalizeTaskStatus(row.status),
    priority: normalizePriority(row.priority),
    estimate: "—",
    dueDate: row.due_date ?? "",
  }));

  for (const task of tasks) {
    const goal = goalsById.get(task.goalId);
    if (goal && task.dueDate && task.dueDate > (goal.dueDate || "")) {
      goal.dueDate = task.dueDate;
    }
  }

  for (const goal of goals) {
    if (!goal.dueDate) goal.dueDate = goal.createdAt || toISODate(new Date());
  }

  const checkins: Checkin[] = checkinRows
    .filter((row) => row.completion_status in CHECKIN_STATUS_MAP)
    .map((row) => ({
      id: row.id,
      date: (row.created_at ?? "").slice(0, 10),
      status: CHECKIN_STATUS_MAP[row.completion_status],
      reflection: row.reflection ?? "",
      feedback: "",
    }));

  const weekly = buildWeekly(tasks);

  const insights = buildInsights({ goals, tasks, checkins, weekly });
  const streak = computeStreak(checkins);

  return { goals, milestones, tasks, checkins, insights, weekly, streak };
}

function buildWeekly(tasks: Task[]): WeeklyPoint[] {
  const start = addDays(new Date(), -6);
  const points: WeeklyPoint[] = [];
  for (let index = 0; index < 7; index += 1) {
    const day = toISODate(addDays(start, index));
    const dayTasks = tasks.filter(
      (task) => task.dueDate && task.dueDate.slice(0, 10) === day,
    );
    points.push({
      day: day.slice(5),
      completed: dayTasks.filter((task) => task.status === "done").length,
      total: dayTasks.length,
    });
  }
  return points;
}

function computeStreak(checkins: Checkin[]): number {
  if (checkins.length === 0) return 0;
  const dates = new Set(
    checkins.map((checkin) => checkin.date).sort((a, b) => (a < b ? 1 : -1)),
  );

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

function buildInsights(input: {
  goals: Goal[];
  tasks: Task[];
  checkins: Checkin[];
  weekly: WeeklyPoint[];
}): Insight[] {
  const { checkins, weekly, tasks } = input;
  const insights: Insight[] = [];

  const done = tasks.filter((task) => task.status === "done").length;
  const consistency = weekly.length
    ? Math.round(
        (weekly.reduce((sum, point) => sum + point.completed, 0) /
          Math.max(weekly.reduce((sum, point) => sum + point.total, 0), 1)) *
          100,
      )
    : 0;

  if (done > 0 || consistency > 0) {
    insights.push({
      id: "in-consistency",
      content: `You've completed ${done} task${done === 1 ? "" : "s"} this window with ${consistency}% weekly consistency. Keep the first task small so it gets done before the day shifts.`,
      created_at: "This week",
      category: "consistency",
    });
  }

  const recent = checkins.slice(0, 3);
  if (recent.length > 0) {
    const yes = recent.filter((checkin) => checkin.status === "yes").length;
    if (yes <= 1) {
      insights.push({
        id: "in-coaching",
        content:
          checkins.length <= 1
            ? "You logged your first check-in. Consistency is measured in check-ins logged, not perfection — protect the pattern tomorrow."
            : "Recent check-ins are mixed. Shrink tomorrow's first task to 20 minutes so a small win keeps the loop alive.",
        created_at: "Today",
        category: "coaching",
      });
    }
  }

  return insights;
}