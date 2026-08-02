"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Flame,
  Goal,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  WandSparkles,
  X,
  type LucideIcon,
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
        "You are most consistent when the first task is specific and short. Start tomorrow with one clear 30-minute action before opening messages.",
      created_at: "Today",
    },
  ],
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Goals", icon: Target },
  { label: "Tasks", icon: CheckCircle2 },
  { label: "Calendar", icon: CalendarDays },
  { label: "Insights", icon: Sparkles },
];

const todayTasks = [
  { title: "Draft landing page hero", goal: "Launch Startup", time: "35 min", status: "In progress" },
  { title: "React state practice", goal: "Learn React", time: "45 min", status: "Queued" },
  { title: "Evening workout", goal: "Lose 10kg", time: "30 min", status: "Queued" },
];

export function DashboardShell() {
  const [stats, setStats] = useState<DashboardStats>(demoStats);
  const [status, setStatus] = useState<"idle" | "loading" | "saving">("idle");
  const [notice, setNotice] = useState("");
  const [token, setToken] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState("This week");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    setToken(session?.accessToken);

    if (!session?.accessToken || !isConfigured()) return;

    setStatus("loading");
    getDashboard(session.accessToken)
      .then((data) => setStats({ ...demoStats, ...data }))
      .catch(() => setNotice("We could not refresh live data. Showing your latest available dashboard."))
      .finally(() => setStatus("idle"));
  }, []);

  const chartData = useMemo(() => stats.weeklyTasks ?? demoStats.weeklyTasks ?? [], [stats]);
  const filteredTasks = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return todayTasks;
    return todayTasks.filter((task) =>
      `${task.title} ${task.goal} ${task.status}`.toLowerCase().includes(normalized),
    );
  }, [searchQuery]);

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
      setNotice("Goal created. Your plan is being prepared.");
      event.currentTarget.reset();
    } catch {
      setNotice("Goal drafted locally. Connect your live workspace to save it.");
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
      setNotice(response.feedback ?? "Check-in submitted. Your coach will adapt the next step.");
      event.currentTarget.reset();
    } catch {
      setNotice("Check-in saved for this session. Connect your live workspace to sync it.");
    } finally {
      setStatus("idle");
    }
  }

  function signOut() {
    clearSession();
    window.location.href = "/";
  }

  return (
    <main className="komitt-app-shell">
      <aside className="komitt-sidebar">
        <div className="sidebar-top">
          <BrandLogo />
          <button className="icon-button h-9 w-9" title="Collapse navigation">
            <Menu size={16} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <button className={index === 0 ? "active" : ""} key={item.label}>
              <item.icon size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-coach">
          <p className="label">Coach</p>
          <strong>5 day streak</strong>
          <span>Keep today&apos;s first task under 45 minutes.</span>
        </div>
        <div className="sidebar-footer">
          <button title="Settings">
            <Settings size={17} /> <span>Settings</span>
          </button>
          <button onClick={signOut} title="Sign out">
            <LogOut size={17} /> <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="komitt-main">
        <header className="dashboard-topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)} title="Open menu">
            <Menu size={20} />
          </button>
          <div className="dashboard-search">
            <Search size={17} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search goals, tasks, or check-ins"
            />
          </div>
          <div className="topbar-actions">
            <label className="select-shell">
              <span>{range}</span>
              <select value={range} onChange={(event) => setRange(event.target.value)} title="Select dashboard range">
                <option>This week</option>
                <option>This month</option>
                <option>Last 30 days</option>
              </select>
              <ChevronDown size={15} />
            </label>
            <button className="icon-button" title="Notifications">
              <Bell size={17} />
            </button>
            <Link className="btn-outline h-10 px-4 text-sm" href="/">
              <Home size={16} /> Site
            </Link>
          </div>
        </header>

        {mobileMenuOpen ? (
          <div className="mobile-overlay">
            <div className="mobile-panel">
              <div className="sidebar-top">
                <BrandLogo />
                <button className="icon-button h-9 w-9" onClick={() => setMobileMenuOpen(false)} title="Close menu">
                  <X size={16} />
                </button>
              </div>
              <nav className="sidebar-nav">
                {navItems.map((item, index) => (
                  <button className={index === 0 ? "active" : ""} key={item.label} onClick={() => setMobileMenuOpen(false)}>
                    <item.icon size={17} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        ) : null}

        <section className="dashboard-content">
          <div className="dashboard-heading">
            <div>
              <p className="label">Overview</p>
              <h1>Execution dashboard</h1>
              <span>Track your goals, today&apos;s tasks, consistency, and coaching loop.</span>
            </div>
            <button className="btn-primary h-11 px-5" onClick={() => document.getElementById("new-goal")?.scrollIntoView({ behavior: "smooth" })}>
              <Plus size={17} /> New goal
            </button>
          </div>

          {notice ? <div className="notice">{notice}</div> : null}

          <div className="dashboard-stat-grid">
            <Metric icon={Goal} label="Goals completed" value={stats.goalsCompleted} />
            <Metric icon={CheckCircle2} label="Tasks completed" value={stats.tasksCompleted} />
            <Metric icon={BarChart3} label="Weekly consistency" value={`${stats.weeklyConsistency}%`} />
            <Metric icon={Flame} label="Current streak" value={`${stats.currentStreak}d`} />
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-card chart-card">
              <div className="card-header">
                <div>
                  <p className="label">Analytics</p>
                  <h2>Completion trend</h2>
                </div>
                <span className="status-pill">{status === "loading" ? "Syncing" : "Updated"}</span>
              </div>
              <div className="dashboard-chart">
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

            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="label">Today</p>
                  <h2>Task queue</h2>
                </div>
                <span className="status-pill">{filteredTasks.length} tasks</span>
              </div>
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <article className="task-row" key={task.title}>
                    <span className="task-check" />
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.goal} · {task.time}</p>
                    </div>
                    <em>{task.status}</em>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="dashboard-grid lower">
            <section className="dashboard-card" id="new-goal">
              <div className="card-header">
                <div>
                  <p className="label">Plan</p>
                  <h2>Create goal</h2>
                </div>
                <WandSparkles size={20} />
              </div>
              <form className="dashboard-form" onSubmit={handleGoalSubmit}>
                <input className="form-input" name="title" placeholder="Launch my startup" required />
                <textarea
                  className="form-input min-h-24 resize-none"
                  name="description"
                  placeholder="Describe the outcome, deadline, and constraints."
                  required
                />
                <button className="btn-primary h-11 justify-center px-5" disabled={status === "saving"}>
                  Create plan
                </button>
              </form>
            </section>

            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="label">Reflect</p>
                  <h2>Daily check-in</h2>
                </div>
                <CheckCircle2 size={20} />
              </div>
              <form className="dashboard-form" onSubmit={handleCheckinSubmit}>
                <div className="check-grid">
                  {["yes", "partially", "no"].map((value) => (
                    <label className="check-option" key={value}>
                      <input name="completion_status" type="radio" value={value} defaultChecked={value === "partially"} />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
                <textarea
                  className="form-input min-h-24 resize-none"
                  name="reflection"
                  placeholder="What helped or blocked you today?"
                />
                <button className="btn-secondary h-11 justify-center px-5" disabled={status === "saving"}>
                  Submit check-in
                </button>
              </form>
            </section>

            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="label">Coach</p>
                  <h2>Latest insight</h2>
                </div>
                <Sparkles size={20} />
              </div>
              <p className="insight-copy">
                {stats.insights?.[0]?.content ?? demoStats.insights?.[0]?.content}
              </p>
            </section>

            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="label">Deadlines</p>
                  <h2>Upcoming</h2>
                </div>
                <CalendarDays size={20} />
              </div>
              <div className="deadline-list">
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
          </div>
        </section>
      </div>

      <button className="floating-create" onClick={() => document.getElementById("new-goal")?.scrollIntoView({ behavior: "smooth" })} title="Create goal">
        <Plus size={24} />
      </button>

      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 4).map((item, index) => (
          <button className={index === 0 ? "active" : ""} key={item.label} title={item.label}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="metric-card">
      <Icon size={19} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
