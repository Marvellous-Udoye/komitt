"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const links = [
  { label: "Workflow", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-graphite/40 bg-void/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-6 px-6">
        <BrandLogo />
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-[13px] font-normal text-mist transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-[13px] font-normal text-mist transition-colors hover:text-paper"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2",
              "text-[13px] font-[510] leading-none text-void transition-opacity hover:opacity-90",
            )}
          >
            Sign up
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
