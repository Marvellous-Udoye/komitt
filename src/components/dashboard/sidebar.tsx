"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, LogOut } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { mainNav, systemNav } from "@/components/dashboard/nav-config";
import { useDashboard } from "@/lib/dashboard-store";
import { useUser } from "@/lib/user-store";
import { backendSignOut } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: typeof mainNav;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="px-3 pb-2 pt-5 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-fog">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex h-9 items-center gap-2.5 rounded-md px-3 text-[13px] transition-colors",
                active
                  ? "bg-white/[0.05] text-paper"
                  : "text-mist hover:bg-white/[0.03] hover:text-paper",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-acid-lime" />
              )}
              <item.icon className={cn("size-4", active ? "text-paper" : "text-fog")} />
              <span className="flex-1">{item.label}</span>
              {active && (
                <span className="size-1.5 rounded-full bg-acid-lime" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const streak = useDashboard((state) => state.liveStreak ?? state.streak);
  const user = useUser((state) => state.user);

  function signOut() {
    backendSignOut();
    toast.success("Signed out", {
      description: "Your session has closed. See you next time.",
    });
    router.replace("/");
  }

  return (
    <div className="flex h-full flex-col border-r border-graphite/70 bg-carbon">
      <div className="flex h-16 items-center px-4">
        <BrandLogo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-none">
        <NavGroup label="Workspace" items={mainNav} pathname={pathname} onNavigate={onNavigate} />
        <NavGroup label="System" items={systemNav} pathname={pathname} onNavigate={onNavigate} />
      </nav>

      <div className="mx-3 mb-3 rounded-lg border border-graphite/70 bg-obsidian/60 p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-acid-lime/10">
            <Flame className="size-4 text-acid-lime" />
          </span>
          <div>
            <p className="text-[13px] font-[510] text-paper">{streak} day streak</p>
            <p className="text-[11px] text-fog">Keep today&apos;s first task short.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-graphite/70 p-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-md px-1 py-2">
          <UserAvatar user={user} className="size-8" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-[510] text-mist">
              {user?.name?.split(" ")[0] ?? "Komitt user"}
            </p>
            <p className="truncate text-[10px] text-fog">{user?.email ?? "Signed in with Google"}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={signOut}
          className="h-9 w-full justify-start gap-2.5 rounded-md px-3 text-[13px] font-normal text-mist hover:bg-white/[0.03] hover:text-coral-red"
        >
          <LogOut className="size-4 text-fog" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
