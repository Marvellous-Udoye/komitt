export type GoalStatus = "active" | "paused" | "completed";

export type Goal = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: GoalStatus;
  milestones: number;
  milestonesDone: number;
  createdAt: string;
  dueDate: string;
};

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  goalId: string;
  goalTitle: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  estimate: string;
  dueDate: string;
};

export type CheckinStatus = "yes" | "partially" | "no";

export type Checkin = {
  id: string;
  date: string;
  status: CheckinStatus;
  reflection: string;
  feedback: string;
};

export type InsightCategory = "coaching" | "consistency" | "warning";

export type Insight = {
  id: string;
  content: string;
  created_at: string;
  category: InsightCategory;
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

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const TODAY = toISODate(new Date());