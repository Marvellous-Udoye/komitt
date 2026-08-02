import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  LineChart,
  Mail,
  Sparkles,
  Target,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { MiniDashboard } from "@/features/marketing/components/mini-dashboard";

const workflows = [
  "Create goal",
  "AI breakdown",
  "Task schedule",
  "Daily reminder",
  "Check-in",
  "Coach feedback",
  "Dashboard update",
];

const features = [
  {
    icon: Target,
    title: "Goal maps that stay usable",
    body: "High-level goals become milestones and tasks that feel realistic, scheduled, and easy to review.",
    tone: "mint",
  },
  {
    icon: CalendarCheck,
    title: "Daily check-ins without drama",
    body: "Users report yes, partial, or no, add a reflection, and trigger AI feedback immediately.",
    tone: "cream",
  },
  {
    icon: Bot,
    title: "Coaching from behavior",
    body: "Komitt can spot postponed tasks, low-consistency windows, and missed deadlines before they become patterns.",
    tone: "cream",
  },
  {
    icon: LineChart,
    title: "Progress users can read fast",
    body: "Goals completed, tasks completed, weekly consistency, current streak, and upcoming deadlines in one dashboard.",
    tone: "blush",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream-paper text-forest-ink">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-nav border border-pencil-gray bg-cream-paper/95 px-3 py-2 shadow-nav backdrop-blur">
          <BrandLogo />
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#workflow">Workflow</a>
            <a href="#features">Features</a>
            <a href="#dashboard">Dashboard</a>
          </div>
          <div className="flex items-center gap-2">
            <Link className="btn-outline hidden sm:inline-flex" href="/login">
              Log in
            </Link>
            <Link className="btn-primary h-10 px-4 text-sm" href="/signup">
              <ArrowRight size={16} /> Start
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-32 text-center">
        <div className="sketch sketch-left" />
        <div className="sketch sketch-right" />
        <div className="tagline animate-float">
          <Sparkles size={14} /> AI execution system
        </div>
        <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.2rem,8vw,5.6rem)] font-extrabold leading-none tracking-display">
          Turn your goals into{" "}
          <span className="highlight">daily proof</span> of progress.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 sm:text-xl">
          Komitt is an accountability platform for people who want their plans
          broken down, scheduled, checked daily, and adjusted by AI before
          momentum slips.
        </p>
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link className="btn-primary h-14 w-full px-9 sm:w-auto" href="/signup">
            <ArrowRight size={18} /> Create my plan
          </Link>
          <Link className="btn-secondary h-14 w-full px-7 sm:w-auto" href="/dashboard">
            View dashboard
          </Link>
        </div>
        <p className="mt-3 text-sm text-forest-ink/55">
          No complicated setup. Just a daily loop that keeps you honest.
        </p>
      </section>

      <section id="workflow" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="label">Execution loop</p>
            <h2 className="section-title">One connected system, split into clean workflows.</h2>
            <p className="mt-5 max-w-xl text-base leading-7">
              Komitt keeps each part of accountability clear: capture the goal,
              create the plan, remind the user, collect the check-in, coach the
              next move, and update progress automatically.
            </p>
          </div>
          <div className="workflow-board">
            {workflows.map((item, index) => (
              <div className="workflow-step" key={item} style={{ animationDelay: `${index * 90}ms` }}>
                <span>{index + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <p className="label text-center">Product surface</p>
        <h2 className="section-title mx-auto max-w-3xl text-center">
          Everything the user needs from goal capture to reflection.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <article className={`sticky-card tone-${feature.tone}`} key={feature.title}>
              <feature.icon size={26} />
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="dashboard" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-7 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="label">Live app preview</p>
            <h2 className="section-title">A dashboard that makes accountability visible.</h2>
            <p className="mt-5 text-base leading-7">
              Charts and counters are built for the real dashboard endpoint:
              completed goals, completed tasks, consistency, streak, deadlines,
              plus a daily check-in composer.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="pill"><Mail size={15} /> Email reminders</span>
              <span className="pill"><Bell size={15} /> Daily nudges</span>
              <span className="pill"><Clock3 size={15} /> Timezone ready</span>
            </div>
          </div>
          <MiniDashboard />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="closing-panel">
          <CheckCircle2 size={30} />
          <h2>Ready to start the next execution cycle?</h2>
          <Link className="btn-primary h-12 px-6" href="/signup">
            <ArrowRight size={17} /> Open Komitt
          </Link>
        </div>
      </section>
    </main>
  );
}
