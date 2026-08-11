import Link from "next/link";
import { ArrowRight, Bell, Clock3, Mail } from "lucide-react";
import { LandingNav } from "@/features/marketing/components/landing-nav";
import { ProductScreenshot } from "@/features/marketing/components/product-screenshot";
import { LogoStrip } from "@/features/marketing/components/logo-strip";
import { PlanMock } from "@/features/marketing/components/plan-mock";
import { CheckinMock } from "@/features/marketing/components/checkin-mock";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Komitt",
    url: "https://komitt.coach",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description:
      "Komitt is an AI accountability coach that turns ambitious goals into clear plans, daily check-ins, personalized coaching, and progress dashboards.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Komitt",
      url: "https://komitt.coach",
      logo: {
        "@type": "ImageObject",
        url: "https://komitt.coach/icon.svg",
      },
    },
  };

  return (
    <main className="min-h-screen bg-void text-mist">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNav />

      <section className="relative pt-32 sm:pt-40">
        <div className="hero-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-start text-left lg:items-center lg:text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-graphite bg-carbon px-3 py-1.5 text-[12px] text-fog">
              <span className="size-1.5 rounded-full bg-acid-lime" />
              AI accountability system
            </span>
            <h1 className="mt-6 text-[clamp(2.75rem,6vw,4rem)] font-[510] leading-[1] tracking-[-0.022em] text-paper">
              Turn your goals into daily proof of progress.
            </h1>
            <p className="mt-6 text-[16px] leading-relaxed text-fog">
              Komitt breaks ambitious goals into plans, checks in with you every day,
              and coaches the next move before momentum slips.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-start gap-3 lg:justify-center">
              <Link
                href="/signup"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-acid-lime px-4 text-[14px] font-[510] tracking-[-0.011em] text-void transition-opacity hover:opacity-90"
              >
                Create my plan
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-graphite px-4 text-[13px] text-mist transition-colors hover:border-smoke hover:text-paper"
              >
                View live dashboard
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-ash">
              No complicated setup. Just a daily loop that keeps you honest.
            </p>
          </div>
        </div>

        <div className="relative mt-16 sm:mt-20">
          <div className="hero-floor pointer-events-none absolute inset-x-0 -bottom-24 top-6 -z-10 opacity-100" />
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <ProductScreenshot />
          </div>
        </div>
      </section>

      <section className="mt-28">
        <LogoStrip />
      </section>

      <section id="workflow" className="mx-auto mt-28 max-w-[1200px] scroll-mt-20 px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-acid-lime">
              01 — Execution loop
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-[510] leading-[1.05] tracking-[-0.022em] text-paper">
              One connected system, split into clean plans.
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-fog">
              High-level goals become milestones and tasks that feel realistic,
              scheduled, and easy to review. The plan is generated for you and stays
              usable every day.
            </p>
          </div>
          <PlanMock />
        </div>
      </section>

      <section id="features" className="mx-auto mt-28 max-w-[1200px] scroll-mt-20 px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <CheckinMock />
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-teal">
              02 — Daily rhythm
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-[510] leading-[1.05] tracking-[-0.022em] text-paper">
              Check-ins that take seconds, feedback that adapts.
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-fog">
              Report yes, partial, or no, add a short reflection, and trigger
              coaching immediately. Komitt spots postponed tasks and low-consistency
              windows before they become patterns.
            </p>
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto mt-28 max-w-[1200px] scroll-mt-20 px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-pulse-green">
              03 — Progress
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-[510] leading-[1.05] tracking-[-0.022em] text-paper">
              A dashboard that makes accountability visible.
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-fog">
              Goals completed, tasks completed, weekly consistency, current streak,
              and upcoming deadlines in one focused workspace. Read progress fast,
              act sooner.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-graphite px-3 py-1.5 text-[12px] text-fog">
                <Mail className="size-3.5" /> Email reminders
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-graphite px-3 py-1.5 text-[12px] text-fog">
                <Bell className="size-3.5" /> Daily nudges
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-graphite px-3 py-1.5 text-[12px] text-fog">
                <Clock3 className="size-3.5" /> Timezone ready
              </span>
            </div>
          </div>
          <div className="hairline rounded-xl bg-carbon p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-[510] uppercase tracking-[0.08em] text-fog">
                  Today
                </p>
                <h3 className="mt-2 text-[20px] font-[510] leading-tight tracking-[-0.012em] text-paper">
                  Launch Startup
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-acid-lime/10 px-3 py-1.5 font-mono text-[11px] text-acid-lime">
                5 day streak
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "active goals", value: "4" },
                { label: "tasks done", value: "31" },
                { label: "consistency", value: "86%" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-lg border border-graphite/70 bg-obsidian/50 p-4">
                  <p className="text-[24px] font-[510] leading-none tracking-[-0.022em] text-paper">
                    {metric.value}
                  </p>
                  <p className="mt-1.5 text-[12px] text-fog">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex h-28 items-end gap-2.5">
              {[42, 68, 55, 82, 74, 91, 64].map((bar, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-[3px] bg-obsidian">
                    <div
                      className="w-full rounded-[3px] bg-fog/70"
                      style={{ height: `${bar * 0.55}px` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-fog">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto mt-28 max-w-[1200px] scroll-mt-20 px-6">
        <div className="hairline overflow-hidden rounded-xl bg-carbon">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-acid-lime">
                04 — Get started
              </span>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-[510] leading-[1.05] tracking-[-0.022em] text-paper">
                Ready to start the next execution cycle?
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-fog">
                Sign in with Google, create your first goal, and let the coach keep
                the loop moving.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-acid-lime px-6 text-[14px] font-[510] tracking-[-0.011em] text-void transition-opacity hover:opacity-90"
              >
                Open Komitt
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-graphite px-6 text-[13px] text-mist transition-colors hover:border-smoke hover:text-paper"
              >
                Explore the dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-28 max-w-[1200px] px-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-graphite/60 pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex size-5 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="size-5">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="#8a8f98" strokeWidth="1.5" />
                <path d="M7 12.5l3.2 3.2L17 8.5" stroke="#e4f222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[15px] font-[510] tracking-[-0.011em] text-mist">Komitt</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[13px] text-fog">
            <a href="#workflow" className="transition-colors hover:text-paper">Workflow</a>
            <a href="#features" className="transition-colors hover:text-paper">Features</a>
            <a href="#dashboard" className="transition-colors hover:text-paper">Dashboard</a>
            <a href="/login" className="transition-colors hover:text-paper">Log in</a>
          </div>
          <p className="font-mono text-[11px] text-ash">© 2026 Komitt</p>
        </div>
      </footer>
    </main>
  );
}
