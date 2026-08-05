"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageHeader, Card } from "@/components/dashboard/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, priorityTone } from "@/components/dashboard/status-badge";
import { NewTaskDialog } from "@/components/dashboard/dialogs/new-task-dialog";
import { useDashboard } from "@/lib/dashboard-store";
import { formatDate, TODAY, type TaskStatus } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "todo", label: "To do" },
  { value: "done", label: "Done" },
] as const;

export default function TasksPage() {
  const tasks = useDashboard((state) => state.tasks);
  const goals = useDashboard((state) => state.goals);
  const setTaskStatus = useDashboard((state) => state.setTaskStatus);

  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [goalFilter, setGoalFilter] = useState("all");

  const filtered = tasks.filter((task) => {
    if (filter === "today" && task.dueDate !== TODAY) return false;
    if (filter === "todo" && task.status === "done") return false;
    if (filter === "done" && task.status !== "done") return false;
    if (goalFilter !== "all" && task.goalId !== goalFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="The queue of concrete actions your plans have generated."
        actions={<NewTaskDialog />}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((tab) => {
            const count =
              tab.value === "all"
                ? tasks.length
                : tab.value === "today"
                  ? tasks.filter((t) => t.dueDate === TODAY).length
                  : tab.value === "done"
                    ? tasks.filter((t) => t.status === "done").length
                    : tasks.filter((t) => t.status === "todo").length;
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
        <Select value={goalFilter} onValueChange={setGoalFilter}>
          <SelectTrigger className="h-8 w-[180px] rounded-md border-graphite bg-obsidian/40 text-[12px] text-fog">
            <SelectValue placeholder="Filter by goal" />
          </SelectTrigger>
          <SelectContent className="border-graphite bg-obsidian text-mist">
            <SelectItem value="all" className="text-[12px]">All goals</SelectItem>
            {goals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id} className="text-[12px]">
                {goal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-graphite/70 hover:bg-transparent">
              <TableHead className="w-10 pl-6" />
              <TableHead className="text-[11px] font-normal uppercase tracking-[0.08em] text-fog">
                Task
              </TableHead>
              <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog md:table-cell">
                Goal
              </TableHead>
              <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog sm:table-cell">
                Due
              </TableHead>
              <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog sm:table-cell">
                Est.
              </TableHead>
              <TableHead className="hidden text-[11px] font-normal uppercase tracking-[0.08em] text-fog md:table-cell">
                Priority
              </TableHead>
              <TableHead className="text-right pr-6 text-[11px] font-normal uppercase tracking-[0.08em] text-fog">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((task) => {
              const done = task.status === "done";
              return (
                <TableRow key={task.id} className="border-graphite/50 hover:bg-white/[0.02]">
                  <TableCell className="py-3 pl-6">
                    <button
                      onClick={() => setTaskStatus(task.id, done ? "todo" : "done")}
                      aria-label={done ? "Mark as not done" : "Mark as done"}
                      className={cn(
                        "flex size-[18px] items-center justify-center rounded-full border transition-colors",
                        done
                          ? "border-acid-lime bg-acid-lime"
                          : "border-fog/40 hover:border-fog",
                      )}
                    >
                      {done && <CheckCircle2 className="size-3 text-void" />}
                    </button>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={cn("text-[13px]", done ? "text-fog line-through" : "text-mist")}>
                      {task.title}
                    </span>
                  </TableCell>
                  <TableCell className="hidden py-3 text-[12px] text-fog md:table-cell">
                    {task.goalTitle}
                  </TableCell>
                  <TableCell className="hidden py-3 sm:table-cell">
                    <span className="font-mono text-[11px] text-fog">{formatDate(task.dueDate)}</span>
                  </TableCell>
                  <TableCell className="hidden py-3 font-mono text-[11px] text-fog sm:table-cell">
                    {task.estimate}
                  </TableCell>
                  <TableCell className="hidden py-3 md:table-cell">
                    <StatusBadge tone={priorityTone(task.priority)}>{task.priority}</StatusBadge>
                  </TableCell>
                  <TableCell className="py-3 pr-6">
                    <div className="flex items-center justify-end">
                      <Select
                        value={task.status}
                        onValueChange={(value) => setTaskStatus(task.id, value as TaskStatus)}
                      >
                        <SelectTrigger className="h-7 w-[118px] rounded-md border-graphite bg-obsidian/40 text-[12px] text-fog">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-graphite bg-obsidian text-mist">
                          <SelectItem value="todo" className="text-[12px]">Todo</SelectItem>
                          <SelectItem value="in_progress" className="text-[12px]">In progress</SelectItem>
                          <SelectItem value="done" className="text-[12px]">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-12 text-center text-[13px] text-fog">
                  No tasks match this view.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
