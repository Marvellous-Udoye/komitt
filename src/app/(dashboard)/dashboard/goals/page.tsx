"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { PageHeader, Card } from "@/components/dashboard/page-header";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, goalStatusTone } from "@/components/dashboard/status-badge";
import { NewGoalDialog } from "@/components/dashboard/dialogs/new-goal-dialog";
import { useDashboard } from "@/lib/dashboard-store";
import { formatDate, type GoalStatus } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const statuses: Array<{ value: "all" | GoalStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

export default function GoalsPage() {
  const goals = useDashboard((state) => state.goals);
  const setGoalStatus = useDashboard((state) => state.setGoalStatus);
  const [filter, setFilter] = useState<"all" | GoalStatus>("all");

  const filtered = filter === "all" ? goals : goals.filter((goal) => goal.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="High-level outcomes you're executing on. Each one becomes a plan of milestones and tasks."
        actions={<NewGoalDialog />}
      />

      <div className="flex flex-wrap items-center gap-1.5">
        {statuses.map((tab) => {
          const count =
            tab.value === "all"
              ? goals.length
              : goals.filter((goal) => goal.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[12px] transition-colors",
                filter === tab.value
                  ? "border-acid-lime/50 bg-acid-lime/10 text-acid-lime"
                  : "border-graphite bg-obsidian/40 text-fog hover:border-smoke hover:text-mist",
              )}
            >
              {tab.label}
              <span className="ml-1.5 font-mono text-[10px] text-ash">{count}</span>
            </button>
          );
        })}
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-graphite/70 hover:bg-transparent">
              <TableHead className="pl-6 text-[11px] font-normal uppercase tracking-[0.08em] text-fog">
                Goal
              </TableHead>
              <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog md:table-cell">
                Category
              </TableHead>
              <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog lg:table-cell">
                Progress
              </TableHead>
              <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog md:table-cell">
                Due
              </TableHead>
              <TableHead className="text-right pr-6 text-[11px] font-normal uppercase tracking-[0.08em] text-fog">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((goal) => {
              const pct =
                goal.milestones > 0
                  ? Math.round((goal.milestonesDone / goal.milestones) * 100)
                  : 0;
              return (
                <TableRow key={goal.id} className="border-graphite/50 hover:bg-white/[0.02]">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-graphite bg-obsidian">
                        <Target className="size-4 text-fog" />
                      </span>
                      <div>
                        <p className="text-[14px] font-[510] tracking-[-0.011em] text-mist">
                          {goal.title}
                        </p>
                        <p className="mt-0.5 max-w-xs truncate text-[12px] text-fog">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden py-4 md:table-cell">
                    <StatusBadge tone="violet">{goal.category}</StatusBadge>
                  </TableCell>
                  <TableCell className="hidden py-4 lg:table-cell">
                    <div className="flex max-w-[160px] items-center gap-2.5">
                      <Progress value={pct} className="h-1 bg-obsidian" indicatorClassName="bg-acid-lime" />
                      <span className="font-mono text-[10px] text-fog">
                        {goal.milestonesDone}/{goal.milestones}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden py-4 md:table-cell">
                    <span className="font-mono text-[11px] text-fog">{formatDate(goal.dueDate)}</span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <StatusBadge tone={goalStatusTone(goal.status)} dot>
                        {goal.status}
                      </StatusBadge>
                      <Select
                        value={goal.status}
                        onValueChange={(value) => setGoalStatus(goal.id, value as GoalStatus)}
                      >
                        <SelectTrigger className="h-7 w-[104px] rounded-md border-graphite bg-obsidian/40 text-[12px] text-fog">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-graphite bg-obsidian text-mist">
                          <SelectItem value="active" className="text-[12px]">Active</SelectItem>
                          <SelectItem value="paused" className="text-[12px]">Paused</SelectItem>
                          <SelectItem value="completed" className="text-[12px]">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-12 text-center text-[13px] text-fog">
                  No {filter === "all" ? "goals" : `${filter} goals`} here. Create your first
                  one to start the loop.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
