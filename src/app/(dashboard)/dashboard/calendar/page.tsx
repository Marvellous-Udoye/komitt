"use client";

import { CalendarDays } from "lucide-react";
import { PageHeader, Card, CardHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, ChartSkeleton } from "@/components/dashboard/data-states";
import { StatusBadge, milestoneStatusLabel, milestoneStatusTone } from "@/components/dashboard/status-badge";
import { useDashboard } from "@/lib/dashboard-store";
import { addDays, formatDate, toISODate } from "@/lib/demo-data";

const days = Array.from({ length: 7 }, (_, index) => {
  const date = addDays(new Date(), index);
  return {
    iso: toISODate(date),
    label: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
});

export default function CalendarPage() {
  const status = useDashboard((state) => state.status);
  const error = useDashboard((state) => state.error);
  const syncFromN8n = useDashboard((state) => state.syncFromN8n);
  const milestones = useDashboard((state) => state.milestones);
  const weekMilestones = milestones.filter((milestone) =>
    days.some((day) => milestone.endDate === day.iso || milestone.startDate === day.iso),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Your next seven days of milestone accountability." />

      {status === "loading" ? (
        <ChartSkeleton />
      ) : status === "error" ? (
        <ErrorState message={error ?? undefined} onRetry={syncFromN8n} />
      ) : weekMilestones.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No milestones this week" description="Milestones with start or end dates in the next seven days will appear here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-7">
          {days.map((day) => {
            const dayMilestones = milestones.filter(
              (milestone) => milestone.endDate === day.iso || milestone.startDate === day.iso,
            );
            return (
              <Card key={day.iso} className="min-h-[220px]">
                <CardHeader title={day.label} description={formatDate(day.iso)} />
                <div className="mt-4 space-y-2">
                  {dayMilestones.length === 0 ? (
                    <p className="text-[12px] text-fog">No milestones.</p>
                  ) : (
                    dayMilestones.map((milestone) => (
                      <div key={milestone.id} className="rounded-md border border-graphite bg-obsidian/40 p-3">
                        <p className="text-[13px] font-[510] text-mist">{milestone.title}</p>
                        <p className="mt-1 font-mono text-[10px] text-fog">{milestone.goalTitle}</p>
                        <div className="mt-2">
                          <StatusBadge tone={milestoneStatusTone(milestone.status)}>
                            {milestoneStatusLabel(milestone.status)}
                          </StatusBadge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
