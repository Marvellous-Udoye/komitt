"use client";

import { create } from "zustand";
import {
  initialCheckins,
  initialGoals,
  initialInsights,
  initialStreak,
  initialTasks,
  initialWeekly,
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

let counter = 100;

function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

type DashboardState = {
  goals: Goal[];
  tasks: Task[];
  checkins: Checkin[];
  insights: Insight[];
  weekly: WeeklyPoint[];
  streak: number;
  lastCheckinStatus: CheckinStatus | null;

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
  resetDemo: () => void;
};

export const useDashboard = create<DashboardState>((set) => ({
  goals: initialGoals,
  tasks: initialTasks,
  checkins: initialCheckins,
  insights: initialInsights,
  weekly: initialWeekly,
  streak: initialStreak,
  lastCheckinStatus: null,

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

  resetDemo: () =>
    set({
      goals: initialGoals,
      tasks: initialTasks,
      checkins: initialCheckins,
      insights: initialInsights,
      weekly: initialWeekly,
      streak: initialStreak,
      lastCheckinStatus: null,
    }),
}));
