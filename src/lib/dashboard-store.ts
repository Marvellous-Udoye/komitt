"use client";

import { create } from "zustand";
import {
  TODAY,
  toISODate,
  type Checkin,
  type Goal,
  type GoalStatus,
  type Insight,
  type Milestone,
  type MilestoneStatus,
  type WeeklyPoint,
} from "@/lib/demo-data";
import {
  createGoalLive,
  generateMilestonesLive,
  getCheckinHistoryLive,
  getDashboard,
  isLiveMode,
  submitCheckinLive,
  transcribeLive,
  type MilestoneDraft,
  type N8nDashboard,
} from "@/lib/n8n-client";
import {
  fetchDashboardData,
  updateMilestoneStatusDirect,
  updateNotificationHourDirect,
} from "@/lib/supabase-client";
import { getStoredSession } from "@/lib/auth-session";

let counter = 100;

function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

export type DashboardStatus = "loading" | "ready" | "error";

type GoalCreateInput = {
  title: string;
  description: string;
  applicationTags: string[];
  milestonesSource: "ai_generated" | "user_provided";
  targetStartDate: string | null;
  targetEndDate: string;
  milestones: MilestoneDraft[];
};

type CheckinInput = {
  goalId: string;
  milestoneId: string;
  context: string;
  marksMilestoneComplete: boolean;
};

type DashboardState = {
  status: DashboardStatus;
  error: string | null;

  goals: Goal[];
  milestones: Milestone[];
  checkins: Checkin[];
  insights: Insight[];
  weekly: WeeklyPoint[];
  streak: number;
  notificationHour: number;

  liveGoalsCompleted: number | null;
  liveMilestonesCompleted: number | null;
  liveWeeklyConsistency: string | null;
  liveStreak: number | null;

  generateMilestones: (input: {
    title: string;
    description: string;
    applicationTags: string[];
  }) => Promise<MilestoneDraft[]>;
  createGoal: (input: GoalCreateInput) => Promise<void>;
  setGoalStatus: (id: string, status: GoalStatus) => void;
  setMilestoneStatus: (id: string, status: MilestoneStatus) => Promise<void>;
  submitCheckin: (input: CheckinInput) => Promise<string>;
  loadCheckinHistory: (goalId: string, milestoneId: string) => Promise<Checkin[]>;
  transcribeAudio: (audioBase64: string, mimeType: string) => Promise<string>;
  setNotificationHour: (hour: number) => Promise<void>;
  syncFromN8n: () => Promise<void>;
  resetDemo: () => void;
};

function sessionToken() {
  return getStoredSession()?.accessToken;
}

function demoMilestonesFor(title: string): MilestoneDraft[] {
  const base = title.trim() || "Skill goal";
  return [
    { title: `Map the ${base} fundamentals`, order_index: 0 },
    { title: `Build one practical ${base} project`, order_index: 1 },
    { title: `Apply ${base} in a real-world scenario`, order_index: 2 },
  ];
}

function normalizeConsistency(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  return typeof value === "number" ? `${value}%` : value;
}

function applyDashboardPayload(payload: N8nDashboard | undefined) {
  if (!payload) {
    return {
      liveGoalsCompleted: null,
      liveMilestonesCompleted: null,
      liveWeeklyConsistency: null,
      liveStreak: null,
      deadlineMilestones: [] as Milestone[],
    };
  }

  return {
    liveGoalsCompleted: payload.goals_completed ?? null,
    liveMilestonesCompleted: payload.milestones_completed ?? null,
    liveWeeklyConsistency: normalizeConsistency(payload.weekly_consistency),
    liveStreak: payload.current_streak ?? null,
    deadlineMilestones: (payload.upcoming_milestone_deadlines ?? []).map((item, index) => ({
      id: item.id,
      goalId: item.goal_id ?? "",
      goalTitle: "-",
      title: item.title,
      orderIndex: index,
      aiGenerated: false,
      startDate: "",
      endDate: item.end_date ?? item.due_date ?? "",
      status: item.status === "completed" || item.status === "in_progress" ? item.status : "pending",
    })) satisfies Milestone[],
  };
}

export const useDashboard = create<DashboardState>((set, get) => ({
  status: "loading",
  error: null,

  goals: [],
  milestones: [],
  checkins: [],
  insights: [],
  weekly: [],
  streak: 0,
  notificationHour: 7,

  liveGoalsCompleted: null,
  liveMilestonesCompleted: null,
  liveWeeklyConsistency: null,
  liveStreak: null,

  generateMilestones: async (input) => {
    if (isLiveMode()) {
      const result = await generateMilestonesLive(sessionToken(), {
        title: input.title,
        description: input.description,
        application_tags: input.applicationTags,
      });
      if (result?.milestones?.length) return result.milestones;
    }
    return demoMilestonesFor(input.title);
  },

  createGoal: async (input) => {
    if (isLiveMode()) {
      await createGoalLive(sessionToken(), {
        title: input.title,
        description: input.description,
        application_tags: input.applicationTags,
        milestones_source: input.milestonesSource,
        target_start_date: input.targetStartDate,
        target_end_date: input.targetEndDate,
        milestones: input.milestones,
      });
      await get().syncFromN8n();
      return;
    }

    set((state) => {
      const goalId = nextId("g");
      const goal: Goal = {
        id: goalId,
        title: input.title,
        description: input.description,
        applicationTags: input.applicationTags,
        milestonesSource: input.milestonesSource,
        status: input.targetStartDate ? "active" : "not_started",
        milestones: input.milestones.length,
        milestonesDone: 0,
        createdAt: TODAY,
        targetStartDate: input.targetStartDate,
        targetEndDate: input.targetEndDate,
      };
      const milestones = input.milestones.map((milestone, index) => ({
        id: nextId("m"),
        goalId,
        goalTitle: goal.title,
        title: milestone.title,
        orderIndex: milestone.order_index ?? index,
        aiGenerated: input.milestonesSource === "ai_generated",
        startDate: milestone.start_date ?? input.targetStartDate ?? "",
        endDate: milestone.end_date ?? input.targetEndDate,
        status: "pending" as const,
      }));

      return {
        goals: [goal, ...state.goals],
        milestones: [...milestones, ...state.milestones],
      };
    });
  },

  setGoalStatus: (id, status) =>
    set((state) => ({
      goals: state.goals.map((goal) => (goal.id === id ? { ...goal, status } : goal)),
    })),

  setMilestoneStatus: async (id, status) => {
    const token = sessionToken();
    if (isLiveMode() && token && token !== "demo-session-token") {
      await updateMilestoneStatusDirect(token, id, status);
    }
    set((state) => {
      const milestones = state.milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, status } : milestone,
      );
      const goals = state.goals.map((goal) => {
        const goalMilestones = milestones.filter((milestone) => milestone.goalId === goal.id);
        return {
          ...goal,
          milestones: goalMilestones.length,
          milestonesDone: goalMilestones.filter((milestone) => milestone.status === "completed").length,
        };
      });
      return { milestones, goals };
    });
  },

  submitCheckin: async (input) => {
    let feedback =
      "Logged. Keep the next milestone visible, small, and connected to the reason this skill matters.";
    if (isLiveMode()) {
      const response = await submitCheckinLive(sessionToken(), {
        goal_id: input.goalId,
        milestone_id: input.milestoneId,
        context: input.context,
        marks_milestone_complete: input.marksMilestoneComplete,
      });
      feedback = response?.feedback ?? feedback;
      await get().syncFromN8n();
      return feedback;
    }

    set((state) => {
      const milestone = state.milestones.find((item) => item.id === input.milestoneId);
      const goal = state.goals.find((item) => item.id === input.goalId);
      const checkin: Checkin = {
        id: nextId("c"),
        goalId: input.goalId,
        goalTitle: goal?.title ?? "-",
        milestoneId: input.milestoneId,
        milestoneTitle: milestone?.title ?? "-",
        context: input.context,
        feedback,
        marksMilestoneComplete: input.marksMilestoneComplete,
        createdAt: new Date().toISOString(),
      };
      return {
        checkins: [checkin, ...state.checkins],
        streak: Math.max(1, state.streak + 1),
        milestones: input.marksMilestoneComplete
          ? state.milestones.map((item) =>
              item.id === input.milestoneId ? { ...item, status: "completed" as const } : item,
            )
          : state.milestones,
      };
    });
    return feedback;
  },

  loadCheckinHistory: async (goalId, milestoneId) => {
    if (isLiveMode()) {
      const result = await getCheckinHistoryLive(sessionToken(), goalId, milestoneId);
      return (result?.history ?? []).map((item) => ({
        id: item.id,
        goalId,
        goalTitle: get().goals.find((goal) => goal.id === goalId)?.title ?? "-",
        milestoneId,
        milestoneTitle: get().milestones.find((milestone) => milestone.id === milestoneId)?.title ?? "-",
        context: item.context,
        feedback: item.feedback ?? "",
        marksMilestoneComplete: item.marks_milestone_complete ?? false,
        createdAt: item.created_at,
      }));
    }
    return get().checkins.filter((checkin) => checkin.goalId === goalId && checkin.milestoneId === milestoneId);
  },

  transcribeAudio: async (audioBase64, mimeType) => {
    const result = await transcribeLive(sessionToken(), { audio_base64: audioBase64, mime_type: mimeType });
    return result?.text ?? "";
  },

  setNotificationHour: async (hour) => {
    const token = sessionToken();
    const user = getStoredSession()?.user;
    if (isLiveMode() && token && user?.id) {
      await updateNotificationHourDirect(token, user.id, hour);
    }
    set({ notificationHour: hour });
  },

  syncFromN8n: async () => {
    set({ status: "loading", error: null });

    if (!isLiveMode()) {
      set({ status: "ready" });
      return;
    }

    const token = sessionToken();
    let goals: Goal[] = [];
    let milestones: Milestone[] = [];
    let checkins: Checkin[] = [];
    let insights: Insight[] = [];
    let weekly: WeeklyPoint[] = [];
    let streak = 0;
    let notificationHour = 7;

    const supabaseData = token ? await fetchDashboardData(token) : null;
    if (supabaseData) {
      goals = supabaseData.goals;
      milestones = supabaseData.milestones;
      checkins = supabaseData.checkins;
      insights = supabaseData.insights;
      weekly = supabaseData.weekly;
      streak = supabaseData.streak;
      notificationHour = supabaseData.notificationHour;
    }

    let n8nPayload: N8nDashboard | undefined;
    try {
      n8nPayload = (await getDashboard()) ?? undefined;
    } catch {
      n8nPayload = undefined;
    }

    const live = applyDashboardPayload(n8nPayload);
    for (const deadline of live.deadlineMilestones) {
      if (!milestones.some((milestone) => milestone.id === deadline.id)) {
        milestones.push(deadline);
      }
    }

    set({
      status: "ready",
      error: null,
      goals,
      milestones,
      checkins,
      insights,
      weekly,
      streak,
      notificationHour,
      liveGoalsCompleted: live.liveGoalsCompleted,
      liveMilestonesCompleted: live.liveMilestonesCompleted,
      liveWeeklyConsistency: live.liveWeeklyConsistency,
      liveStreak: live.liveStreak,
    });
  },

  resetDemo: () =>
    set({
      status: "ready",
      error: null,
      goals: [],
      milestones: [],
      checkins: [],
      insights: [],
      weekly: [],
      streak: 0,
      notificationHour: 7,
      liveGoalsCompleted: null,
      liveMilestonesCompleted: null,
      liveWeeklyConsistency: null,
      liveStreak: null,
    }),
}));
