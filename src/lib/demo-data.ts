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

export const initialGoals: Goal[] = [
  {
    id: "g-1",
    title: "Launch my startup",
    description:
      "Ship the waitlist landing page, validate with 50 signups, and open a private beta.",
    category: "Startup",
    status: "active",
    milestones: 3,
    milestonesDone: 1,
    createdAt: addDays(new Date(), -24).toISOString().slice(0, 10),
    dueDate: addDays(new Date(), 34).toISOString().slice(0, 10),
  },
  {
    id: "g-2",
    title: "Learn React deeply",
    description:
      "Master state management, rendering patterns, and build three portfolio projects.",
    category: "Learning",
    status: "active",
    milestones: 4,
    milestonesDone: 2,
    createdAt: addDays(new Date(), -41).toISOString().slice(0, 10),
    dueDate: addDays(new Date(), 20).toISOString().slice(0, 10),
  },
  {
    id: "g-3",
    title: "Lose 10kg",
    description:
      "Sustainable strength and cardio plan with weekly weigh-ins and meal discipline.",
    category: "Health",
    status: "active",
    milestones: 5,
    milestonesDone: 3,
    createdAt: addDays(new Date(), -55).toISOString().slice(0, 10),
    dueDate: addDays(new Date(), 60).toISOString().slice(0, 10),
  },
  {
    id: "g-4",
    title: "Read 24 books this year",
    description: "Two books a month across fiction and non-fiction for breadth.",
    category: "Learning",
    status: "paused",
    milestones: 6,
    milestonesDone: 3,
    createdAt: addDays(new Date(), -90).toISOString().slice(0, 10),
    dueDate: addDays(new Date(), 140).toISOString().slice(0, 10),
  },
  {
    id: "g-5",
    title: "Publish personal site v2",
    description: "Redesign portfolio with a blog engine and case study templates.",
    category: "Startup",
    status: "completed",
    milestones: 2,
    milestonesDone: 2,
    createdAt: addDays(new Date(), -70).toISOString().slice(0, 10),
    dueDate: addDays(new Date(), -8).toISOString().slice(0, 10),
  },
];

export const initialTasks: Task[] = [
  {
    id: "t-1",
    title: "Draft landing page hero copy",
    goalId: "g-1",
    goalTitle: "Launch my startup",
    status: "in_progress",
    priority: "high",
    estimate: "35 min",
    dueDate: TODAY,
  },
  {
    id: "t-2",
    title: "Set up waitlist signup form",
    goalId: "g-1",
    goalTitle: "Launch my startup",
    status: "todo",
    priority: "high",
    estimate: "45 min",
    dueDate: TODAY,
  },
  {
    id: "t-3",
    title: "React state practice — hooks",
    goalId: "g-2",
    goalTitle: "Learn React deeply",
    status: "todo",
    priority: "medium",
    estimate: "45 min",
    dueDate: TODAY,
  },
  {
    id: "t-4",
    title: "Evening strength workout",
    goalId: "g-3",
    goalTitle: "Lose 10kg",
    status: "todo",
    priority: "low",
    estimate: "30 min",
    dueDate: TODAY,
  },
  {
    id: "t-5",
    title: "Interview 3 target customers",
    goalId: "g-1",
    goalTitle: "Launch my startup",
    status: "done",
    priority: "high",
    estimate: "60 min",
    dueDate: addDays(new Date(), -1).toISOString().slice(0, 10),
  },
  {
    id: "t-6",
    title: "Read 40 pages — Atomic Habits",
    goalId: "g-4",
    goalTitle: "Read 24 books this year",
    status: "done",
    priority: "low",
    estimate: "30 min",
    dueDate: addDays(new Date(), -1).toISOString().slice(0, 10),
  },
  {
    id: "t-7",
    title: "Build case study template",
    goalId: "g-5",
    goalTitle: "Publish personal site v2",
    status: "done",
    priority: "medium",
    estimate: "50 min",
    dueDate: addDays(new Date(), -2).toISOString().slice(0, 10),
  },
  {
    id: "t-8",
    title: "Send investor update email",
    goalId: "g-1",
    goalTitle: "Launch my startup",
    status: "todo",
    priority: "medium",
    estimate: "20 min",
    dueDate: addDays(new Date(), 1).toISOString().slice(0, 10),
  },
  {
    id: "t-9",
    title: "Morning run — 5km",
    goalId: "g-3",
    goalTitle: "Lose 10kg",
    status: "todo",
    priority: "medium",
    estimate: "40 min",
    dueDate: addDays(new Date(), 1).toISOString().slice(0, 10),
  },
  {
    id: "t-10",
    title: "Write first portfolio project blog",
    goalId: "g-2",
    goalTitle: "Learn React deeply",
    status: "todo",
    priority: "low",
    estimate: "60 min",
    dueDate: addDays(new Date(), 2).toISOString().slice(0, 10),
  },
];

export const initialCheckins: Checkin[] = [
  {
    id: "c-1",
    date: addDays(new Date(), -1).toISOString().slice(0, 10),
    status: "yes",
    reflection: "Focused block before noon cleared the hardest task.",
    feedback:
      "Strong finish. Tomorrow, keep the first task under 45 minutes to protect the streak.",
  },
  {
    id: "c-2",
    date: addDays(new Date(), -2).toISOString().slice(0, 10),
    status: "partially",
    reflection: "Meetings ate the afternoon. Rescheduled two tasks.",
    feedback:
      "Partial counts. Move the interrupted tasks to tomorrow morning instead of evening.",
  },
  {
    id: "c-3",
    date: addDays(new Date(), -3).toISOString().slice(0, 10),
    status: "yes",
    reflection: "Deep work session, phone in another room.",
    feedback: "That environment is working for you — repeat it tomorrow.",
  },
];

export const initialInsights: Insight[] = [
  {
    id: "i-1",
    content:
      "You are most consistent when the first task is specific and short. Start tomorrow with one clear 30-minute action before opening messages.",
    created_at: "Today",
    category: "coaching",
  },
  {
    id: "i-2",
    content:
      "Evening tasks get postponed 3x more often than morning tasks. Move high-priority work earlier in the day.",
    created_at: "Yesterday",
    category: "consistency",
  },
  {
    id: "i-3",
    content:
      "You have 2 tasks due this week for 'Launch my startup'. Completing them keeps the plan on schedule.",
    created_at: "2 days ago",
    category: "warning",
  },
  {
    id: "i-4",
    content:
      "Your consistency jumped from 71% to 86% after you started checking in before bed instead of after work.",
    created_at: "3 days ago",
    category: "coaching",
  },
  {
    id: "i-5",
    content:
      "'Learn React deeply' is 2 weeks from its deadline with one milestone left. A 25-minute daily block keeps it on track.",
    created_at: "4 days ago",
    category: "warning",
  },
];

export const initialWeekly: WeeklyPoint[] = [
  { day: "Mon", completed: 4, total: 5 },
  { day: "Tue", completed: 3, total: 4 },
  { day: "Wed", completed: 5, total: 5 },
  { day: "Thu", completed: 2, total: 4 },
  { day: "Fri", completed: 6, total: 7 },
  { day: "Sat", completed: 4, total: 5 },
  { day: "Sun", completed: 3, total: 4 },
];

export const initialStreak = 5;
