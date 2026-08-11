"use client";

import { create } from "zustand";
import {
  toISODate,
  TODAY,
  type Checkin,
  type CheckinStatus,
  type Goal,
  type GoalStatus,
  type Insight,
  type Task,
  type TaskStatus,
  type WeeklyPoint,
} from "@/lib/demo-data";
import {
  getDashboard,
  isLiveMode,
  type N8nDashboard,
  type N8nTaskInput,
} from "@/lib/n8n-client";
import { fetchDashboardData } from "@/lib/supabase-client";

let counter = 100;

function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

export type DashboardStatus = "loading" | "ready" | "error";

type DashboardState = {
  status: DashboardStatus;
  error: string | null;

  goals: Goal[];
  tasks: Task[];
  checkins: Checkin[];
  insights: Insight[];
  weekly: WeeklyPoint[];
  streak: number;
  lastCheckinStatus: CheckinStatus | null;

  liveGoalsCompleted: number | null;
  liveTasksCompleted: number | null;
  liveWeeklyConsistency: string | null;
  liveStreak: number | null;

  addGoal: (input: {
    title: string;
    description: string;
    category: string;
    dueDate: string;
  }) => void;
  setGoalStatus: (id: string, status: GoalStatus) => void;
  addTask: (input: {
    title: string;
    goalId: string;
    goalTitle: string;
    priority: Task["priority"];
    estimate: string;
    dueDate: string;
  }) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  submitCheckin: (status: CheckinStatus, reflection: string) => string;
  addInsight: (content: string, category: Insight["category"]) => void;
  applyGoalBreakdown: (input: {
    goalId: string;
    title: string;
    description: string;
    category: string;
    dueDate: string;
    milestones: number;
    tasks: N8nTaskInput[];
  }) => void;
  syncFromN8n: () => Promise<void>;
  resetDemo: () => void;
};

export const useDashboard = create<DashboardState>((set) => ({
  status: "loading",
  error: null,

  goals: [],
  tasks: [],
  checkins: [],
  insights: [],
  weekly: [],
  streak: 0,
  lastCheckinStatus: null,

  liveGoalsCompleted: null,
  liveTasksCompleted: null,
  liveWeeklyConsistency: null,
  liveStreak: null,

  addGoal: (input) =>
    set((state) => {
      const goal: Goal = {
        id: nextId("g"),
        title: input.title,
        description: input.description,
        category: input.category || "Personal",
        status: "active",
        milestones: 0,
        milestonesDone: 0,
        createdAt: TODAY,
        dueDate: input.dueDate || toISODate(new Date(Date.now() + 30 * 86400000)),
      };
      return { goals: [goal, ...state.goals] };
    }),

  setGoalStatus: (id, status) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, status } : goal,
      ),
    })),

  addTask: (input) =>
    set((state) => {
      const task: Task = {
        id: nextId("t"),
        title: input.title,
        goalId: input.goalId,
        goalTitle: input.goalTitle,
        status: "todo",
        priority: input.priority,
        estimate: input.estimate,
        dueDate: input.dueDate || TODAY,
      };
      return { tasks: [task, ...state.tasks] };
    }),

  setTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task,
      ),
    })),

  submitCheckin: (status, reflection) => {
    const feedbackByStatus: Record<CheckinStatus, string> = {
      yes: "Strong finish. Keep the same first task tomorrow to protect your streak.",
      partially:
        "Partial counts — you showed up. Reschedule what slipped to tomorrow morning.",
      no: "A miss is data, not a verdict. Shrink tomorrow's first task to 20 minutes.",
    };
    const feedback = feedbackByStatus[status];

    set((state) => {
      const checkin: Checkin = {
        id: nextId("c"),
        date: TODAY,
        status,
        reflection,
        feedback,
      };
      const streak =
        status === "no" ? 1 : Math.max(1, state.streak + (status === "yes" ? 1 : 0));
      const insight: Insight = {
        id: nextId("i"),
        content:
          status === "yes"
            ? "You just extended your streak. Momentum is compounding — protect the pattern tomorrow."
            : "Logged a check-in. Consistency is measured in check-ins logged, not perfection.",
        created_at: "Today",
        category: "coaching",
      };
      return {
        checkins: [checkin, ...state.checkins],
        streak,
        lastCheckinStatus: status,
        insights: [insight, ...state.insights],
      };
    });

    return feedback;
  },

  addInsight: (content, category) =>
    set((state) => ({
      insights: [
        { id: nextId("i"), content, created_at: "Today", category },
        ...state.insights,
      ],
    })),

  applyGoalBreakdown: (input) =>
    set((state) => {
      const goal: Goal = {
        id: input.goalId,
        title: input.title,
        description: input.description,
        category: input.category,
        status: "active",
        milestones: input.milestones,
        milestonesDone: 0,
        createdAt: TODAY,
        dueDate: input.dueDate || toISODate(new Date(Date.now() + 30 * 86400000)),
      };

      const tasks: Task[] = input.tasks
        .filter((task) => task.id && task.title)
        .map((task) => {
          const priority =
            task.priority === "low" || task.priority === "high"
              ? task.priority
              : "medium";
          return {
            id: task.id,
            title: task.title,
            goalId: goal.id,
            goalTitle: goal.title,
            status: "todo" as const,
            priority,
            estimate: task.estimated_duration_minutes
              ? `${task.estimated_duration_minutes} min`
              : "—",
            dueDate: task.due_date ?? TODAY,
          };
        });

      return {
        goals: [goal, ...state.goals],
        tasks: [...state.tasks, ...tasks],
      };
    }),

  syncFromN8n: async () => {
    set({ status: "loading", error: null });

    if (!isLiveMode()) {
      set({ status: "ready" });
      return;
    }

    const sessionToken =
      typeof window === "undefined"
        ? undefined
        : (() => {
            const raw = window.localStorage.getItem("komitt.session");
            if (!raw) return undefined;
            try {
              const session = JSON.parse(raw) as { accessToken?: string };
              return session.accessToken;
            } catch {
              return undefined;
            }
          })();

    let goals: Goal[] = [];
    let tasks: Task[] = [];
    let checkins: Checkin[] = [];
    let insights: Insight[] = [];
    let weekly: WeeklyPoint[] = [];
    let streak = 0;
    let liveGoalsCompleted: number | null = null;
    let liveTasksCompleted: number | null = null;
    let liveWeeklyConsistency: string | null = null;
    let liveStreak: number | null = null;

    const supabaseData = sessionToken ? await fetchDashboardData(sessionToken) : null;
    if (supabaseData) {
      goals = supabaseData.goals;
      tasks = supabaseData.tasks;
      checkins = supabaseData.checkins;
      insights = supabaseData.insights;
      weekly = supabaseData.weekly;
      streak = supabaseData.streak;
    }

    let n8nPayload: N8nDashboard | undefined;
    try {
      n8nPayload = (await getDashboard()) ?? undefined;
    } catch {
      n8nPayload = undefined;
    }

    if (n8nPayload) {
      for (const deadline of n8nPayload.upcoming_deadlines ?? []) {
        if (!tasks.some((task) => task.id === deadline.id)) {
          const priority =
            deadline.priority === "low" || deadline.priority === "high"
              ? deadline.priority
              : "medium";
          tasks.push({
            id: deadline.id,
            title: deadline.title,
            goalId: "",
            goalTitle: "—",
            status: "todo",
            priority,
            estimate: "—",
            dueDate: deadline.due_date ?? TODAY,
          });
        }
      }
      liveGoalsCompleted = n8nPayload.goals_completed ?? null;
      liveTasksCompleted = n8nPayload.tasks_completed ?? null;
      liveWeeklyConsistency = n8nPayload.weekly_consistency ?? null;
      liveStreak = n8nPayload.current_streak ?? null;
    }

    set({
      status: "ready",
      error: null,
      goals,
      tasks,
      checkins,
      insights,
      weekly,
      streak,
      liveGoalsCompleted,
      liveTasksCompleted,
      liveWeeklyConsistency,
      liveStreak,
    });
  },

  resetDemo: () =>
    set({
      status: "ready",
      error: null,
      goals: [],
      tasks: [],
      checkins: [],
      insights: [],
      weekly: [],
      streak: 0,
      lastCheckinStatus: null,
      liveGoalsCompleted: null,
      liveTasksCompleted: null,
      liveWeeklyConsistency: null,
      liveStreak: null,
    }),
}));