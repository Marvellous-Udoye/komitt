export type GoalStatus = "not_started" | "active" | "paused" | "completed";

export type Goal = {
  id: string;
  title: string;
  description: string;
  applicationTags: string[];
  milestonesSource: "ai_generated" | "user_provided";
  status: GoalStatus;
  milestones: number;
  milestonesDone: number;
  createdAt: string;
  targetStartDate: string | null;
  targetEndDate: string;
};

export type MilestoneStatus = "pending" | "in_progress" | "completed";

export type Milestone = {
  id: string;
  goalId: string;
  goalTitle: string;
  title: string;
  orderIndex: number;
  aiGenerated: boolean;
  startDate: string;
  endDate: string;
  status: MilestoneStatus;
};

export type Checkin = {
  id: string;
  goalId: string;
  goalTitle: string;
  milestoneId: string;
  milestoneTitle: string;
  context: string;
  feedback: string;
  marksMilestoneComplete: boolean;
  createdAt: string;
};

export type InsightCategory = "coaching" | "consistency" | "warning" | "checkin_feedback";

export type Insight = {
  id: string;
  content: string;
  created_at: string;
  category: InsightCategory;
  goalId?: string | null;
  milestoneId?: string | null;
};

export type WeeklyPoint = {
  day: string;
  completed: number;
  total: number;
};

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDate(iso?: string | null) {
  if (!iso) return "-";
  const date = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const TODAY = toISODate(new Date());
