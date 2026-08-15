"use client";

import { useState } from "react";
import { CalendarDays, ListChecks } from "lucide-react";
import { PageHeader, Card } from "@/components/dashboard/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, milestoneStatusLabel, milestoneStatusTone } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, FilterBarSkeleton, TableRowsSkeleton } from "@/components/dashboard/data-states";
import { useDashboard } from "@/lib/dashboard-store";
import { formatDate, type MilestoneStatus } from "@/lib/demo-data";

const statuses: Array<{ value: "all" | MilestoneStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export default function MilestonesPage() {
  const status = useDashboard((state) => state.status);
  const error = useDashboard((state) => state.error);
  const syncFromN8n = useDashboard((state) => state.syncFromN8n);
  const milestones = useDashboard((state) => state.milestones);
  const setMilestoneStatus = useDashboard((state) => state.setMilestoneStatus);
  const [filter, setFilter] = useState<"all" | MilestoneStatus>("all");

  const filtered = filter === "all" ? milestones : milestones.filter((milestone) => milestone.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Milestones"
        description="Milestones are the smallest accountable unit in Komitt. Toggle progress directly or mark one complete during check-in."
      />

      {status === "loading" ? (
        <>
          <FilterBarSkeleton />
          <TableRowsSkeleton rows={5} cols={5} />
        </>
      ) : status === "error" ? (
        <ErrorState message={error ?? undefined} onRetry={syncFromN8n} />
      ) : milestones.length === 0 ? (
        <EmptyState icon={ListChecks} title="No milestones yet" description="Create a goal and add milestones to start tracking accountable progress." />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            {statuses.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`rounded-md border px-3 py-1.5 text-[12px] transition-colors ${
                  filter === tab.value
                    ? "border-acid-lime/50 bg-acid-lime/10 text-acid-lime"
                    : "border-graphite bg-obsidian/40 text-fog hover:border-smoke hover:text-mist"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-graphite/70 hover:bg-transparent">
                  <TableHead className="pl-6 text-[11px] font-normal uppercase tracking-[0.08em] text-fog">Milestone</TableHead>
                  <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog md:table-cell">Goal</TableHead>
                  <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog lg:table-cell">Window</TableHead>
                  <TableHead className="text-right pr-6 text-[11px] font-normal uppercase tracking-[0.08em] text-fog">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((milestone) => (
                  <TableRow key={milestone.id} className="border-graphite/50 hover:bg-white/[0.02]">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-graphite bg-obsidian">
                          <CalendarDays className="size-4 text-fog" />
                        </span>
                        <div>
                          <p className="text-[14px] font-[510] tracking-[-0.011em] text-mist">{milestone.title}</p>
                          <p className="mt-0.5 text-[12px] text-fog">#{milestone.orderIndex + 1}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden py-4 text-[12px] text-fog md:table-cell">{milestone.goalTitle}</TableCell>
                    <TableCell className="hidden py-4 lg:table-cell">
                      <span className="font-mono text-[11px] text-fog">
                        {formatDate(milestone.startDate)} - {formatDate(milestone.endDate)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <StatusBadge tone={milestoneStatusTone(milestone.status)} dot>
                          {milestoneStatusLabel(milestone.status)}
                        </StatusBadge>
                        <Select value={milestone.status} onValueChange={(value) => setMilestoneStatus(milestone.id, value as MilestoneStatus)}>
                          <SelectTrigger className="h-7 w-[128px] rounded-md border-graphite bg-obsidian/40 text-[12px] text-fog">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-graphite bg-obsidian text-mist">
                            <SelectItem value="pending" className="text-[12px]">Pending</SelectItem>
                            <SelectItem value="in_progress" className="text-[12px]">In progress</SelectItem>
                            <SelectItem value="completed" className="text-[12px]">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}
