"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CalendarClock, CheckCircle2, Flame, Goal, ListChecks, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CompletionChart } from "@/components/dashboard/completion-chart";
import { StatusBadge, milestoneStatusLabel, milestoneStatusTone } from "@/components/dashboard/status-badge";
import { NewGoalDialog } from "@/components/dashboard/dialogs/new-goal-dialog";
import { EmptyState, ErrorState, StatGridSkeleton, ChartSkeleton, QueueRowsSkeleton, TableRowsSkeleton, CoachSkeleton } from "@/components/dashboard/data-states";
import { useDashboard } from "@/lib/dashboard-store";
import { useUser } from "@/lib/user-store";
import { formatDate, TODAY } from "@/lib/demo-data";

export default function OverviewPage() {
  const status = useDashboard((state) => state.status);
  const error = useDashboard((state) => state.error);
  const syncFromN8n = useDashboard((state) => state.syncFromN8n);
  const milestones = useDashboard((state) => state.milestones);
  const streak = useDashboard((state) => state.streak);
  const weekly = useDashboard((state) => state.weekly);
  const insights = useDashboard((state) => state.insights);
  const liveGoalsCompleted = useDashboard((state) => state.liveGoalsCompleted);
  const liveMilestonesCompleted = useDashboard((state) => state.liveMilestonesCompleted);
  const liveWeeklyConsistency = useDashboard((state) => state.liveWeeklyConsistency);
  const liveStreak = useDashboard((state) => state.liveStreak);
  const setMilestoneStatus = useDashboard((state) => state.setMilestoneStatus);
  const user = useUser((state) => state.user);

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 5 || hour >= 17 ? "Good evening" : hour < 12 ? "Good morning" : "Good afternoon";

  const goalsCompleted = liveGoalsCompleted ?? 0;
  const milestonesDone = liveMilestonesCompleted ?? milestones.filter((item) => item.status === "completed").length;
  const todayMilestones = milestones.filter((milestone) => milestone.endDate === TODAY);
  const todayDone = todayMilestones.filter((milestone) => milestone.status === "completed").length;
  const consistency = liveWeeklyConsistency ?? "0%";
  const streakValue = liveStreak ?? streak;
  const deadlines = milestones
    .filter((milestone) => milestone.status !== "completed" && milestone.endDate >= TODAY)
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${firstName}`}
        description="Here's how your skill-accountability loop is holding up today."
        actions={<NewGoalDialog />}
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
            <StatCard icon={CheckCircle2} label="Milestones completed" value={milestonesDone} hint={`${todayDone}/${todayMilestones.length} due today`} />
            <StatCard icon={BarChart3} label="Weekly consistency" value={consistency} />
            <StatCard icon={Flame} label="Current streak" value={`${streakValue}d`} accent />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader title="Weekly completion" description="Milestones completed vs. due per day" />
              {weekly.length > 0 ? (
                <CompletionChart />
              ) : (
                <EmptyState icon={BarChart3} title="No weekly data yet" description="Complete milestones and check in to start building your consistency chart." />
              )}
            </Card>

            <Card>
              <CardHeader
                title="Today's milestones"
                description={`${todayMilestones.length} milestones due`}
                trailing={
                  <Link href="/dashboard/check-in" className="inline-flex items-center gap-1 text-[12px] text-fog transition-colors hover:text-mist">
                    Check in <ArrowRight className="size-3" />
                  </Link>
                }
              />
              {todayMilestones.length === 0 ? (
                <EmptyState icon={ListChecks} title="Nothing due today" description="Milestones with today's end date will appear here." />
              ) : (
                <div className="space-y-2">
                  {todayMilestones.map((milestone) => (
                    <button
                      key={milestone.id}
                      onClick={() => setMilestoneStatus(milestone.id, milestone.status === "completed" ? "in_progress" : "completed")}
                      className="flex w-full items-center gap-3 rounded-lg border border-graphite/70 bg-obsidian/40 px-3 py-2.5 text-left transition-colors hover:border-smoke"
                    >
                      <span className="flex-1">
                        <span className="block text-[13px] text-mist">{milestone.title}</span>
                        <span className="mt-0.5 block font-mono text-[10px] text-fog">{milestone.goalTitle}</span>
                      </span>
                      <StatusBadge tone={milestoneStatusTone(milestone.status)}>{milestoneStatusLabel(milestone.status)}</StatusBadge>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader
                title="Upcoming milestone deadlines"
                description="The next accountable units on your plan"
                trailing={
                  <Link href="/dashboard/milestones" className="inline-flex items-center gap-1 text-[12px] text-fog transition-colors hover:text-mist">
                    Milestones <ArrowRight className="size-3" />
                  </Link>
                }
              />
              {deadlines.length === 0 ? (
                <EmptyState icon={CalendarClock} title="No upcoming deadlines" description="Dated milestones will appear here as your learning plan takes shape." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-graphite/70 hover:bg-transparent">
                      <TableHead className="text-[11px] font-normal uppercase tracking-[0.08em] text-fog">Milestone</TableHead>
                      <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog sm:table-cell">Goal</TableHead>
                      <TableHead className="text-[11px] font-normal uppercase tracking-[0.08em] text-fog">Due</TableHead>
                      <TableHead className="text-right text-[11px] font-normal uppercase tracking-[0.08em] text-fog">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deadlines.map((milestone) => (
                      <TableRow key={milestone.id} className="border-graphite/50 hover:bg-white/[0.02]">
                        <TableCell className="py-3 text-[13px] text-mist">{milestone.title}</TableCell>
                        <TableCell className="hidden py-3 text-[12px] text-fog sm:table-cell">{milestone.goalTitle}</TableCell>
                        <TableCell className="py-3"><span className="font-mono text-[11px] text-fog">{formatDate(milestone.endDate)}</span></TableCell>
                        <TableCell className="py-3 text-right">
                          <StatusBadge tone={milestoneStatusTone(milestone.status)}>{milestoneStatusLabel(milestone.status)}</StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Card>
              <CardHeader title="Coach" description="Latest insight for your week" trailing={<Sparkles className="size-4 text-acid-lime" />} />
              {insights[0] ? (
                <p className="text-[14px] leading-relaxed text-mist">{insights[0].content}</p>
              ) : (
                <EmptyState icon={Sparkles} title="No coaching yet" description="Check in against a milestone and Komitt will start surfacing behavioral insight." />
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
                <p className="text-[13px] font-[510] text-mist">Start a new learning loop</p>
                <p className="text-[12px] text-fog">Create a goal and define the milestones you want to be accountable for.</p>
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
