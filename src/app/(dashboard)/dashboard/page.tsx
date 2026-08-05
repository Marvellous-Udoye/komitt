"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Flame, Goal, Plus, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompletionChart } from "@/components/dashboard/completion-chart";
import { StatusBadge, priorityTone, taskStatusLabel, taskStatusTone } from "@/components/dashboard/status-badge";
import { NewGoalDialog } from "@/components/dashboard/dialogs/new-goal-dialog";
import { CheckinDialog } from "@/components/dashboard/dialogs/checkin-dialog";
import { useDashboard } from "@/lib/dashboard-store";
import { formatDate, TODAY } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const goals = useDashboard((state) => state.goals);
  const tasks = useDashboard((state) => state.tasks);
  const streak = useDashboard((state) => state.streak);
  const weekly = useDashboard((state) => state.weekly);
  const insights = useDashboard((state) => state.insights);
  const setTaskStatus = useDashboard((state) => state.setTaskStatus);

  const goalsCompleted = goals.filter((goal) => goal.status === "completed").length;
  const tasksDone = tasks.filter((task) => task.status === "done").length;
  const todayTasks = tasks.filter((task) => task.dueDate === TODAY);
  const todayDone = todayTasks.filter((task) => task.status === "done").length;
  const consistency = weekly.length
    ? Math.round(
        weekly.reduce((sum, point) => sum + point.completed / Math.max(point.total, 1), 0) /
          weekly.length *
          100,
      )
    : 0;
  const deadlines = tasks
    .filter((task) => task.status !== "done" && task.dueDate >= TODAY)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good afternoon, Alex"
        description="Here's how your execution loop is holding up today."
        actions={
          <>
            <CheckinDialog />
            <NewGoalDialog />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Goal} label="Goals completed" value={goalsCompleted} hint="+1 this month" />
        <StatCard icon={CheckCircle2} label="Tasks completed" value={tasksDone} hint={`${todayDone}/${todayTasks.length} today`} />
        <StatCard icon={BarChart3} label="Weekly consistency" value={`${consistency}%`} />
        <StatCard icon={Flame} label="Current streak" value={`${streak}d`} accent />
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
          <CompletionChart />
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
          <div className="space-y-2">
            {todayTasks.length === 0 && (
              <p className="py-8 text-center text-[13px] text-fog">Nothing scheduled today.</p>
            )}
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
              {deadlines.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="py-8 text-center text-[13px] text-fog">
                    No upcoming deadlines.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
          <p className="text-[14px] leading-relaxed text-mist">
            {insights[0]?.content}
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
        </Card>
      </div>

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
        <NewGoalDialog
          trigger={
            <Button className="h-9 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90">
              <Plus className="size-4" /> New goal
            </Button>
          }
        />
      </div>
    </div>
  );
}
