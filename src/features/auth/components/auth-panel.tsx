"use client";

import Link from "next/link";
import { ArrowRight, Chrome, Info } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { config } from "@/lib/config";

type AuthPanelProps = {
  mode: "login" | "signup";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const isSignup = mode === "signup";

  function continueWithGoogle() {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      window.localStorage.setItem(
        "commit.session",
        JSON.stringify({ accessToken: "demo-session-token" }),
      );
      window.location.href = "/dashboard";
      return;
    }

    const redirectTo = `${window.location.origin}/callback`;
    const url = new URL(`${config.supabaseUrl}/auth/v1/authorize`);
    url.searchParams.set("provider", "google");
    url.searchParams.set("redirect_to", redirectTo);
    url.searchParams.set("apikey", config.supabaseAnonKey);
    window.location.href = url.toString();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section>
          <BrandLogo />
          <h1 className="mt-10 font-display text-[clamp(3rem,8vw,5.4rem)] font-extrabold leading-none tracking-display">
            {isSignup ? "Start your next" : "Return to your"}{" "}
            <span className="highlight">commitment</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8">
            Use Google OAuth through Supabase. The frontend sends your access
            token to n8n, and n8n verifies it before touching your goals,
            check-ins, tasks, or dashboard.
          </p>
        </section>

        <section className="auth-card">
          <p className="label">{isSignup ? "Create account" : "Welcome back"}</p>
          <h2 className="mt-3 text-3xl font-bold">
            {isSignup ? "Connect with Supabase Auth" : "Open your execution board"}
          </h2>
          <button className="btn-primary mt-7 h-14 w-full justify-center" onClick={continueWithGoogle}>
            <Chrome size={18} /> Continue with Google
          </button>
          <div className="mt-5 rounded-cards border border-forest-ink/20 bg-highlighter-yellow p-4 text-sm leading-6">
            <Info className="mb-2" size={18} />
            If env vars are missing, this opens a demo dashboard so you can test
            the UI before connecting Supabase and n8n.
          </div>
          <p className="mt-6 text-sm">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <Link className="font-semibold underline" href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
          <Link className="mt-8 inline-flex items-center gap-2 text-sm font-semibold" href="/">
            <ArrowRight size={15} /> Back to site
          </Link>
        </section>
      </div>
    </div>
  );
}
