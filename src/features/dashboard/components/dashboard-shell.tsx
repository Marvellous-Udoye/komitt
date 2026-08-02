"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  type LucideIcon,
  LogOut,
  Plus,
  Target,
  WandSparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { clearSession, getStoredSession } from "@/lib/auth-session";
import {
  createGoal,
  DashboardStats,
  getDashboard,
  submitCheckin,
} from "@/lib/n8n-client";
import { isConfigured } from "@/lib/config";

const demoStats: DashboardStats = {
  goalsCompleted: 3,
  tasksCompleted: 31,
  weeklyConsistency: 86,
  currentStreak: 5,
  upcomingDeadlines: [
    { id: "1", title: "Outline React project", due_date: "2026-08-03", priority: "high" },
    { id: "2", title: "Send startup landing page brief", due_date: "2026-08-04", priority: "medium" },
    { id: "3", title: "30 minute workout", due_date: "2026-08-05", priority: "low" },
  ],
  weeklyTasks: [
    { day: "Mon", completed: 4, total: 5 },
    { day: "Tue", completed: 3, total: 4 },
    { day: "Wed", completed: 5, total: 5 },
    { day: "Thu", completed: 2, total: 4 },
    { day: "Fri", completed: 6, total: 7 },
    { day: "Sat", completed: 4, total: 5 },
    { day: "Sun", completed: 3, total: 4 },
  ],
  insights: [
    {
      id: "demo",
      content:
        "You are most consistent on days where tasks are under 45 minutes. Keep tomorrow's first task small and schedule it before noon.",
      created_at: "Today",
    },
  ],
};

export function DashboardShell() {
  const [stats, setStats] = useState<DashboardStats>(demoStats);
  const [status, setStatus] = useState<"idle" | "loading" | "saving">("idle");
  const [notice, setNotice] = useState("");
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const session = getStoredSession();
    setToken(session?.accessToken);

    if (!session?.accessToken || !isConfigured()) return;

    setStatus("loading");
    getDashboard(session.accessToken)
      .then((data) => setStats({ ...demoStats, ...data }))
      .catch(() => setNotice("Dashboard is showing demo data until n8n responds."))
      .finally(() => setStatus("idle"));
  }, []);

  const chartData = useMemo(() => stats.weeklyTasks ?? demoStats.weeklyTasks ?? [], [stats]);

  async function handleGoalSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("saving");
    setNotice("");

    try {
      await createGoal(token, {
        title: String(data.get("title") ?? ""),
        description: String(data.get("description") ?? ""),
      });
      setNotice("Goal sent to n8n. AI breakdown should appear after the workflow saves it.");
      event.currentTarget.reset();
    } catch {
      setNotice("Goal saved in demo mode. Configure n8n env vars to send it live.");
    } finally {
      setStatus("idle");
    }
  }

  async function handleCheckinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("saving");
    setNotice("");

    try {
      const response = await submitCheckin(token, {
        completion_status: String(data.get("completion_status") ?? "partially") as "yes" | "partially" | "no",
        reflection: String(data.get("reflection") ?? ""),
      });
      setNotice(response.feedback ?? "Check-in sent. Your coaching email is on the way.");
      event.currentTarget.reset();
    } catch {
      setNotice("Check-in captured in demo mode. Connect n8n to trigger AI feedback.");
    } finally {
      setStatus("idle");
    }
  }

  function signOut() {
    clearSession();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-cream-paper text-forest-ink">
      <header className="border-b border-pencil-gray/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Link className="btn-outline h-10 px-4 text-sm" href="/">
              Site
            </Link>
            <button className="icon-button" onClick={signOut} title="Log out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[0.76fr_1.24fr]">
        <aside className="space-y-6">
          <section className="dashboard-panel bg-highlighter-yellow">
            <p className="label">Commit today</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">
              One plan. One check-in. No loose ends.
            </h1>
            <p className="mt-4 text-base leading-7">
              Create a goal, let n8n break it into milestones, and keep the
              loop moving with daily reflection.
            </p>
          </section>

          <form className="dashboard-panel" onSubmit={handleGoalSubmit}>
            <div className="flex items-center gap-2">
              <Plus size={20} />
              <h2 className="text-xl font-bold">Create goal</h2>
            </div>
            <input className="form-input mt-5" name="title" placeholder="Launch my startup" required />
            <textarea
              className="form-input mt-3 min-h-28 resize-none"
              name="description"
              placeholder="Describe the outcome, deadline, and constraints."
              required
            />
            <button className="btn-primary mt-4 h-12 w-full justify-center" disabled={status === "saving"}>
              <WandSparkles size={17} /> Send to AI breakdown
            </button>
          </form>

          <form className="dashboard-panel" onSubmit={handleCheckinSubmit}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} />
              <h2 className="text-xl font-bold">Daily check-in</h2>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {["yes", "partially", "no"].map((value) => (
                <label className="check-option" key={value}>
                  <input name="completion_status" type="radio" value={value} defaultChecked={value === "partially"} />
                  <span>{value}</span>
                </label>
              ))}
            </div>
            <textarea
              className="form-input mt-3 min-h-24 resize-none"
              name="reflection"
              placeholder="What helped or blocked you today?"
            />
            <button className="btn-pastel mt-4 h-12 w-full justify-center" disabled={status === "saving"}>
              <ArrowRight size={17} /> Submit check-in
            </button>
          </form>
        </aside>

        <section className="space-y-6">
          {notice ? <div className="notice">{notice}</div> : null}
          <div className="grid gap-4 md:grid-cols-4">
            <Metric icon={Target} label="Goals completed" value={stats.goalsCompleted} tone="mint" />
            <Metric icon={CheckCircle2} label="Tasks completed" value={stats.tasksCompleted} tone="teal" />
            <Metric icon={CalendarDays} label="Weekly consistency" value={`${stats.weeklyConsistency}%`} tone="blush" />
            <Metric icon={Flame} label="Current streak" value={`${stats.currentStreak}d`} tone="yellow" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="dashboard-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="label">Analytics</p>
                  <h2 className="mt-2 text-2xl font-bold">Weekly completion</h2>
                </div>
                <span className="rounded-full border border-forest-ink px-3 py-1 font-mono text-xs">
                  {status === "loading" ? "syncing" : "live"}
                </span>
              </div>
              <div className="dashboard-chart mt-8">
                {chartData.map((item) => {
                  const height = Math.round((item.completed / Math.max(item.total, 1)) * 100);
                  return (
                    <div className="dashboard-bar" key={item.day}>
                      <span style={{ height: `${height}%` }} />
                      <small>{item.day}</small>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="dashboard-panel bg-sticky-note-mint">
              <p className="label">AI insight</p>
              <h2 className="mt-2 text-2xl font-bold">Latest coach feedback</h2>
              <p className="mt-5 text-base leading-7">
                {stats.insights?.[0]?.content ?? demoStats.insights?.[0]?.content}
              </p>
            </section>
          </div>

          <section className="dashboard-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="label">Next up</p>
                <h2 className="mt-2 text-2xl font-bold">Upcoming deadlines</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {stats.upcomingDeadlines.map((task) => (
                <div className="deadline-row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.due_date}</p>
                  </div>
                  <span>{task.priority}</span>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone: "mint" | "teal" | "blush" | "yellow";
}) {
  return (
    <div className={`metric-card tone-${tone}`}>
      <Icon size={20} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
