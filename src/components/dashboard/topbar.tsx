"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDashboard } from "@/lib/dashboard-store";
import { useUser } from "@/lib/user-store";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import { isLiveMode } from "@/lib/n8n-client";
import { isRealSession, signOut } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const user = useUser((state) => state.user);
  const tasks = useDashboard((state) => state.tasks);
  const goals = useDashboard((state) => state.goals);
  const insights = useDashboard((state) => state.insights);
  const live = isLiveMode();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { tasks: [], goals: [] };
    return {
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q) || t.goalTitle.toLowerCase().includes(q)).slice(0, 5),
      goals: goals.filter((g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query, tasks, goals]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-graphite/70 bg-void/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-mist lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>

      <div className="min-w-0 flex-1 lg:hidden" />

      <div className="relative ml-auto w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fog" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(event.target.value.length > 0);
          }}
          onFocus={() => setOpen(query.length > 0)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder="Search goals, tasks…"
          className="h-9 w-full rounded-md border border-input bg-white/[0.02] pl-9 pr-3 text-[13px] text-mist placeholder:text-fog/60 focus:border-mist/70 focus:outline-none"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-graphite bg-obsidian px-1.5 py-0.5 font-mono text-[10px] text-fog sm:flex">
          ⌘K
        </kbd>

        {open && (
          <div className="absolute inset-x-0 top-11 z-50 overflow-hidden rounded-lg border border-graphite bg-obsidian shadow-xl">
            {results.tasks.length === 0 && results.goals.length === 0 ? (
              <p className="px-4 py-6 text-center text-[13px] text-fog">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto p-1.5">
                {results.goals.length > 0 && (
                  <p className="px-2 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                    Goals
                  </p>
                )}
                {results.goals.map((goal) => (
                  <button
                    key={goal.id}
                    onMouseDown={() => {
                      setOpen(false);
                      setQuery("");
                      router.push("/dashboard/goals");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-mist transition-colors hover:bg-white/[0.05] hover:text-paper"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded border border-graphite bg-void font-mono text-[10px] text-fog">
                      {goal.category.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="flex-1 truncate">{goal.title}</span>
                  </button>
                ))}
                {results.tasks.length > 0 && (
                  <p className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
                    Tasks
                  </p>
                )}
                {results.tasks.map((task) => (
                  <button
                    key={task.id}
                    onMouseDown={() => {
                      setOpen(false);
                      setQuery("");
                      router.push("/dashboard/tasks");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-mist transition-colors hover:bg-white/[0.05] hover:text-paper"
                  >
                    <span className="size-2 shrink-0 rounded-full bg-fog/40" />
                    <span className="flex-1 truncate">{task.title}</span>
                    <span className="font-mono text-[10px] text-fog">{task.goalTitle}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <span className="hidden items-center gap-1.5 rounded-full border border-graphite bg-carbon px-2.5 py-1 md:flex">
        <span
          className={cn(
            "size-1.5 rounded-full",
            live ? "bg-pulse-green" : isRealSession() ? "bg-amber-400" : "bg-fog",
          )}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
          {live ? "Live" : isRealSession() ? "Demo data" : "Demo"}
        </span>
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-9 text-mist" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 border-graphite bg-obsidian p-1.5 text-mist">
          <DropdownMenuLabel className="flex items-center gap-2 px-2 py-2 text-[12px] text-fog">
            <Sparkles className="size-3.5 text-acid-lime" />
            Latest coaching
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-graphite" />
          {insights.slice(0, 3).map((insight) => (
            <DropdownMenuItem
              key={insight.id}
              className="cursor-pointer items-start gap-2 px-2 py-2.5 text-[12px] leading-relaxed focus:bg-white/[0.05]"
            >
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-acid-lime" />
              <span>
                {insight.content}
                <span className="mt-1 block font-mono text-[10px] text-fog">
                  {insight.created_at}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 gap-2 rounded-md px-1.5 text-mist hover:bg-white/[0.03]">
            <UserAvatar user={user} />
            <span className="hidden max-w-[120px] truncate text-[13px] text-mist sm:inline">
              {user?.name?.split(" ")[0] ?? "Komitt user"}
            </span>
            <ChevronDown className="hidden size-3.5 text-fog sm:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-graphite bg-obsidian p-1.5 text-mist">
          <DropdownMenuLabel className="px-2 py-2">
            <p className="truncate text-[13px] font-[510] text-paper">{user?.name ?? "Komitt user"}</p>
            <p className="truncate text-[12px] font-normal text-fog">{user?.email ?? "Signed in with Google"}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-graphite" />
          <DropdownMenuItem className="cursor-pointer text-[13px] focus:bg-white/[0.05]" onSelect={() => router.push("/dashboard/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-[13px] focus:bg-white/[0.05]" onSelect={() => router.push("/")}>
            Back to site
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-graphite" />
          <DropdownMenuItem
            className="cursor-pointer text-[13px] text-coral-red focus:bg-coral-red/10 focus:text-coral-red"
            onSelect={signOut}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
