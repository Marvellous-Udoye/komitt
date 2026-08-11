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

    let payload: N8nDashboard;
    try {
      payload = await getDashboard();
    } catch (error) {
      set({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Could not reach the n8n dashboard webhook.",
      });
      return;
    }

    set((state) => {
      const merged = state.tasks.slice();
      for (const deadline of payload.upcoming_deadlines ?? []) {
        if (!merged.some((task) => task.id === deadline.id)) {
          const priority =
            deadline.priority === "low" || deadline.priority === "high"
              ? deadline.priority
              : "medium";
          merged.push({
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

      return {
        status: "ready",
        liveGoalsCompleted: payload.goals_completed,
        liveTasksCompleted: payload.tasks_completed,
        liveWeeklyConsistency: payload.weekly_consistency,
        liveStreak: payload.current_streak,
        tasks: merged,
      };
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