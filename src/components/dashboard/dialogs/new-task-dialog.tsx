"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from "@/lib/dashboard-store";
import { toISODate } from "@/lib/demo-data";

export function NewTaskDialog({ trigger }: { trigger?: React.ReactNode }) {
  const addTask = useDashboard((state) => state.addTask);
  const goals = useDashboard((state) => state.goals);
  const activeGoals = goals.filter((goal) => goal.status === "active");

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [estimate, setEstimate] = useState("30 min");
  const [dueDate, setDueDate] = useState(toISODate(new Date()));

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    const goal = activeGoals.find((item) => item.id === goalId) ?? activeGoals[0];
    addTask({
      title: title.trim(),
      goalId: goal?.id ?? "",
      goalTitle: goal?.title ?? "Personal",
      priority,
      estimate: estimate || "30 min",
      dueDate: dueDate || toISODate(new Date()),
    });
    setOpen(false);
    setTitle("");
    toast.success("Task created", { description: "Added to your task queue." });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90">
            <CheckCircle2 className="size-4" />
            New task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-graphite bg-carbon sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-[510] tracking-[-0.011em] text-paper">
            Create a task
          </DialogTitle>
          <DialogDescription className="text-[13px] text-fog">
            Add a single action to keep your plan moving.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-[12px] text-fog">
              Task title
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Draft landing page hero copy"
              required
              className="h-10 rounded-md bg-obsidian/40 px-3 text-[14px] text-mist placeholder:text-fog/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-fog">Goal</Label>
              <Select value={goalId || (activeGoals[0]?.id ?? "")} onValueChange={setGoalId}>
                <SelectTrigger className="h-10 rounded-md bg-obsidian/40 text-[13px] text-mist">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-graphite bg-obsidian text-mist">
                  {activeGoals.length === 0 ? (
                    <SelectItem value="personal" className="text-[13px]">
                      Personal
                    </SelectItem>
                  ) : (
                    activeGoals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id} className="text-[13px]">
                        {goal.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-fog">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
                <SelectTrigger className="h-10 rounded-md bg-obsidian/40 text-[13px] text-mist">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-graphite bg-obsidian text-mist">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-estimate" className="text-[12px] text-fog">
                Estimate
              </Label>
              <Input
                id="task-estimate"
                value={estimate}
                onChange={(event) => setEstimate(event.target.value)}
                placeholder="30 min"
                className="h-10 rounded-md bg-obsidian/40 px-3 text-[13px] text-mist placeholder:text-fog/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due" className="text-[12px] text-fog">
                Due date
              </Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="h-10 rounded-md bg-obsidian/40 px-3 text-[13px] text-mist"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-9 rounded-md text-[13px] text-mist hover:bg-white/[0.05]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90"
            >
              Create task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
