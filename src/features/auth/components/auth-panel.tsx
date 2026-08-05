"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";

type AuthPanelProps = {
  mode: "login" | "signup";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  function enterDemoMode() {
    window.localStorage.setItem(
      "komitt.session",
      JSON.stringify({ accessToken: "demo-session-token" }),
    );
    router.push("/dashboard");
  }

  function continueWithGoogle() {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      enterDemoMode();
      return;
    }

    const redirectTo = `${window.location.origin}/callback`;
    const url = new URL(`${config.supabaseUrl}/auth/v1/authorize`);
    url.searchParams.set("provider", "google");
    url.searchParams.set("redirect_to", redirectTo);
    url.searchParams.set("apikey", config.supabaseAnonKey);
    window.location.href = url.toString();
  }

  function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    window.setTimeout(enterDemoMode, 400);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] items-center px-6 py-24">
      <div className="grid w-full gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <section className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-graphite bg-carbon px-3 py-1.5 text-[12px] text-fog">
            <span className="size-1.5 rounded-full bg-acid-lime" />
            {isSignup ? "Create account" : "Welcome back"}
          </span>
          <h1 className="mt-6 text-[clamp(2.5rem,5vw,3.5rem)] font-[510] leading-[1.02] tracking-[-0.022em] text-paper">
            {isSignup ? "Start your next momentum." : "Return to your momentum."}
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-fog">
            Sign in with Google, open your plan, and keep your execution loop moving
            with daily accountability.
          </p>
          <div className="mt-10 space-y-3">
            {[
              { icon: Target, text: "One focused workspace for goals, tasks, and check-ins." },
              { icon: Sparkles, text: "AI coaching that adapts to your behavior, not generic advice." },
              { icon: Chrome, text: "Sign in with Google in seconds. No passwords to remember." },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-graphite bg-carbon">
                  <item.icon className="size-3.5 text-fog" />
                </span>
                <p className="text-[14px] leading-relaxed text-fog">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="hairline rounded-xl bg-carbon p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
              {isSignup ? "Create account" : "Welcome back"}
            </p>
            <h2 className="mt-3 text-[24px] font-[510] leading-tight tracking-[-0.012em] text-paper">
              {isSignup ? "Create your Komitt account" : "Open your execution board"}
            </h2>

            <Button
              onClick={continueWithGoogle}
              className="mt-7 h-11 w-full gap-2 rounded-md border border-graphite bg-obsidian text-[14px] font-normal text-mist shadow-none transition-colors hover:border-smoke hover:bg-graphite/40"
            >
              <Chrome className="size-4" />
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-graphite" />
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ash">
                or continue with email
              </span>
              <div className="h-px flex-1 bg-graphite" />
            </div>

            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="auth-email" className="text-[12px] text-fog">
                  Email
                </Label>
                <Input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-11 rounded-md bg-obsidian/40 px-3.5 text-[14px] text-mist placeholder:text-fog/50"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password" className="text-[12px] text-fog">
                    Password
                  </Label>
                  {!isSignup && (
                    <a
                      href="/login"
                      className="text-[12px] text-fog transition-colors hover:text-mist"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  className="h-11 rounded-md bg-obsidian/40 px-3.5 text-[14px] text-mist placeholder:text-fog/50"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-full rounded-md bg-acid-lime text-[14px] font-[510] tracking-[-0.011em] text-void shadow-none transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isPending
                  ? "Opening dashboard…"
                  : isSignup
                    ? "Create account"
                    : "Log in"}
              </Button>
            </form>

            <p className="mt-6 text-[13px] text-fog">
              {isSignup ? "Already have an account?" : "New here?"}{" "}
              <Link
                className="font-[510] text-mist underline underline-offset-4 transition-colors hover:text-paper"
                href={isSignup ? "/login" : "/signup"}
              >
                {isSignup ? "Log in" : "Sign up"}
              </Link>
            </p>

            <div className="mt-6 rounded-md border border-graphite/70 bg-obsidian/40 p-3.5 text-[12px] leading-relaxed text-fog">
              Your dashboard brings goals, today&apos;s tasks, check-ins, and coaching
              feedback into one focused workspace.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
