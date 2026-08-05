"use client";

import { CalendarDays, CheckCircle2 } from "lucide-react";
import { PageHeader, Card, CardHeader } from "@/components/dashboard/page-header";
import { NewTaskDialog } from "@/components/dashboard/dialogs/new-task-dialog";
import { useDashboard } from "@/lib/dashboard-store";
import { addDays, toISODate, TODAY, formatDate } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

export default function CalendarPage() {
  const tasks = useDashboard((state) => state.tasks);

  const weekStart = startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(weekStart);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description={monthLabel}
        actions={<NewTaskDialog />}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day) => {
          const iso = toISODate(day);
          const isToday = iso === TODAY;
          const dayTasks = tasks.filter((task) => task.dueDate === iso);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={iso}
              className={cn(
                "hairline min-h-[140px] rounded-xl p-3",
                isToday ? "border-acid-lime/40 bg-acid-lime/[0.03]" : "bg-carbon",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-[510] uppercase tracking-[0.06em] text-fog">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full font-mono text-[11px]",
                    isToday
                      ? "bg-acid-lime text-void"
                      : isWeekend
                        ? "text-ash"
                        : "text-fog",
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {dayTasks.length === 0 && (
                  <p className="px-0.5 text-[11px] text-ash/80">—</p>
                )}
                {dayTasks.map((task) => {
                  const done = task.status === "done";
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "rounded-md border px-2 py-1.5",
                        done ? "border-graphite/60 bg-obsidian/40" : "border-graphite bg-obsidian",
                      )}
                    >
                      <p
                        className={cn(
                          "truncate text-[11px] leading-snug",
                          done ? "text-fog line-through" : "text-mist",
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {done ? (
                          <CheckCircle2 className="size-3 text-pulse-green" />
                        ) : (
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              task.status === "in_progress" ? "bg-acid-lime" : "bg-fog/50",
                            )}
                          />
                        )}
                        <span className="font-mono text-[9px] text-fog">{task.estimate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader
          title="Week at a glance"
          description="Tasks scheduled for this week"
          trailing={
            <span className="flex size-7 items-center justify-center rounded-md bg-white/[0.04]">
              <CalendarDays className="size-4 text-fog" />
            </span>
          }
        />
        <div className="space-y-2">
          {days.map((day) => {
            const iso = toISODate(day);
            const dayTasks = tasks.filter((task) => task.dueDate === iso);
            const total = dayTasks.length;
            const done = dayTasks.filter((task) => task.status === "done").length;
            return (
              <div key={iso} className="flex items-center gap-4">
                <span className="w-14 shrink-0 font-mono text-[11px] text-fog">
                  {formatDate(iso)}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-obsidian">
                  <div
                    className="h-full rounded-full bg-acid-lime transition-all"
                    style={{ width: total ? `${(done / total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[10px] text-fog">
                  {done}/{total} done
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
