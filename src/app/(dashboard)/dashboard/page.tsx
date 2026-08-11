"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CalendarClock, CheckCircle2, Flame, Goal, ListTodo, Plus, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompletionChart } from "@/components/dashboard/completion-chart";
import { StatusBadge, priorityTone, taskStatusLabel, taskStatusTone } from "@/components/dashboard/status-badge";
import { NewGoalDialog } from "@/components/dashboard/dialogs/new-goal-dialog";
import { CheckinDialog } from "@/components/dashboard/dialogs/checkin-dialog";
import { EmptyState, ErrorState, StatGridSkeleton, ChartSkeleton, QueueRowsSkeleton, TableRowsSkeleton, CoachSkeleton } from "@/components/dashboard/data-states";
import { useDashboard } from "@/lib/dashboard-store";
import { useUser } from "@/lib/user-store";
import { formatDate, TODAY } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const status = useDashboard((state) => state.status);
  const error = useDashboard((state) => state.error);
  const syncFromN8n = useDashboard((state) => state.syncFromN8n);
  // const goals = useDashboard((state) => state.goals);
  const tasks = useDashboard((state) => state.tasks);
  const streak = useDashboard((state) => state.streak);
  const weekly = useDashboard((state) => state.weekly);
  const insights = useDashboard((state) => state.insights);
  const liveGoalsCompleted = useDashboard((state) => state.liveGoalsCompleted);
  const liveTasksCompleted = useDashboard((state) => state.liveTasksCompleted);
  const liveWeeklyConsistency = useDashboard((state) => state.liveWeeklyConsistency);
  const liveStreak = useDashboard((state) => state.liveStreak);
  const setTaskStatus = useDashboard((state) => state.setTaskStatus);
  const user = useUser((state) => state.user);

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 5 || hour >= 17 ? "Good evening" : hour < 12 ? "Good morning" : "Good afternoon";

  const goalsCompleted = liveGoalsCompleted ?? 0;
  const tasksDone = liveTasksCompleted ?? 0;
  const todayTasks = tasks.filter((task) => task.dueDate === TODAY);
  const todayDone = todayTasks.filter((task) => task.status === "done").length;
  const consistency = liveWeeklyConsistency
    ? (() => {
        const [done, total] = liveWeeklyConsistency.split("/").map(Number);
        return total > 0 ? Math.round((done / total) * 100) : 0;
      })()
    : 0;
  const streakValue = liveStreak ?? streak;
  const deadlines = tasks
    .filter((task) => task.status !== "done" && task.dueDate >= TODAY)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${firstName}`}
        description="Here's how your execution loop is holding up today."
        actions={
          <>
            <CheckinDialog />
            <NewGoalDialog />
          </>
        }
      />

      {status === "loading" ? (
        <>
          <StatGridSkeleton />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <ChartSkeleton />
            <QueueRowsSkeleton />
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <TableRowsSkeleton />
            <CoachSkeleton />
          </div>
        </>
      ) : status === "error" ? (
        <ErrorState message={error ?? undefined} onRetry={syncFromN8n} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Goal} label="Goals completed" value={goalsCompleted} />
            <StatCard icon={CheckCircle2} label="Tasks completed" value={tasksDone} hint={`${todayDone}/${todayTasks.length} today`} />
            <StatCard icon={BarChart3} label="Weekly consistency" value={`${consistency}%`} />
            <StatCard icon={Flame} label="Current streak" value={`${streakValue}d`} accent />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader
                title="Weekly completion"
                description="Tasks completed vs. scheduled per day"
                trailing={
                  <span className="inline-flex items-center gap-3 font-mono text-[10px] text-fog">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-[2px] bg-graphite" /> scheduled
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-[2px] bg-fog" /> completed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-[2px] bg-acid-lime" /> 80%+
                    </span>
                  </span>
                }
              />
              {weekly.length > 0 ? (
                <CompletionChart />
              ) : (
                <EmptyState
                  icon={BarChart3}
                  title="No weekly data yet"
                  description="Complete scheduled tasks and check in to start building your consistency chart."
                />
              )}
            </Card>

            <Card>
              <CardHeader
                title="Today's queue"
                description={`${todayTasks.length} tasks scheduled`}
                trailing={
                  <Link
                    href="/dashboard/tasks"
                    className="inline-flex items-center gap-1 text-[12px] text-fog transition-colors hover:text-mist"
                  >
                    View all <ArrowRight className="size-3" />
                  </Link>
                }
              />
              {todayTasks.length === 0 ? (
                <EmptyState
                  icon={ListTodo}
                  title="Nothing scheduled today"
                  description="Your queue for today is clear. Create a goal and Komitt will generate the tasks."
                />
              ) : (
                <div className="space-y-2">
                  {todayTasks.map((task) => {
                    const done = task.status === "done";
                    return (
                      <button
                        key={task.id}
                        onClick={() => setTaskStatus(task.id, done ? "todo" : "done")}
                        className="flex w-full items-center gap-3 rounded-lg border border-graphite/70 bg-obsidian/40 px-3 py-2.5 text-left transition-colors hover:border-smoke"
                      >
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                            done ? "border-acid-lime bg-acid-lime" : "border-fog/50",
                          )}
                        >
                          {done && <CheckCircle2 className="size-3 text-void" />}
                        </span>
                        <span className="flex-1">
                          <span className={cn("block text-[13px]", done ? "text-fog line-through" : "text-mist")}>
                            {task.title}
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] text-fog">
                            {task.goalTitle} · {task.estimate}
                          </span>
                        </span>
                        <StatusBadge tone={taskStatusTone(task.status)}>{taskStatusLabel(task.status)}</StatusBadge>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader
                title="Upcoming deadlines"
                description="Tasks due in the next few days"
                trailing={
                  <Link
                    href="/dashboard/tasks"
                    className="inline-flex items-center gap-1 text-[12px] text-fog transition-colors hover:text-mist"
                  >
                    Tasks <ArrowRight className="size-3" />
                  </Link>
                }
              />
              {deadlines.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No upcoming deadlines"
                  description="Tasks that have due dates will appear here as your plans generate them."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-graphite/70 hover:bg-transparent">
                      <TableHead className="text-[11px] font-normal uppercase tracking-[0.08em] text-fog">Task</TableHead>
                      <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog sm:table-cell">
                        Goal
                      </TableHead>
                      <TableHead className="text-[11px] font-normal uppercase tracking-[0.08em] text-fog">Due</TableHead>
                      <TableHead className="text-right text-[11px] font-normal uppercase tracking-[0.08em] text-fog">
                        Priority
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deadlines.map((task) => (
                      <TableRow key={task.id} className="border-graphite/50 hover:bg-white/[0.02]">
                        <TableCell className="py-3 text-[13px] text-mist">{task.title}</TableCell>
                        <TableCell className="hidden py-3 text-[12px] text-fog sm:table-cell">
                          {task.goalTitle}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="font-mono text-[11px] text-fog">{formatDate(task.dueDate)}</span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <StatusBadge tone={priorityTone(task.priority)}>{task.priority}</StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Card>
              <CardHeader
                title="Coach"
                description="Latest insight for your week"
                trailing={
                  <span className="flex size-7 items-center justify-center rounded-md bg-acid-lime/10">
                    <Sparkles className="size-4 text-acid-lime" />
                  </span>
                }
              />
              {insights[0] ? (
                <>
                  <p className="text-[14px] leading-relaxed text-mist">
                    {insights[0].content}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Link
                      href="/dashboard/insights"
                      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-graphite px-3 text-[12px] text-mist transition-colors hover:border-smoke hover:text-paper"
                    >
                      All insights <ArrowRight className="size-3" />
                    </Link>
                    <Link
                      href="/dashboard/goals"
                      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-graphite px-3 text-[12px] text-mist transition-colors hover:border-smoke hover:text-paper"
                    >
                      <Target className="size-3.5" /> Goals
                    </Link>
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="No coaching yet"
                  description="Check in daily and Komitt will start surfacing behavioral insight."
                />
              )}
            </Card>
          </div>
        </>
      )}

      <NewGoalDialog
        trigger={
          <div className="hairline flex flex-wrap items-center justify-between gap-3 rounded-xl bg-carbon px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-md bg-acid-lime/10">
                <Plus className="size-4 text-acid-lime" />
              </span>
              <div>
                <p className="text-[13px] font-[510] text-mist">Start a new execution cycle</p>
                <p className="text-[12px] text-fog">New goals are broken down automatically.</p>
              </div>
            </div>
            <Button className="h-9 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90">
              <Plus className="size-4" /> New goal
            </Button>
          </div>
        }
      />
    </div>
  );
}
