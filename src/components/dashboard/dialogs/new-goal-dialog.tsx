"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Target } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/lib/dashboard-store";
import { isLiveMode, createGoalLive } from "@/lib/n8n-client";

const categories = ["Startup", "Learning", "Health", "Finance", "Creative", "Personal"];

export function NewGoalDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const addGoal = useDashboard((state) => state.addGoal);
  const applyGoalBreakdown = useDashboard((state) => state.applyGoalBreakdown);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    if (isLiveMode()) {
      setPending(true);
      try {
        const result = await createGoalLive(undefined, {
          title: title.trim(),
          description: description.trim(),
        });
        const goal = result.goal;
        if (!goal) throw new Error("The plan service returned no goal.");
        applyGoalBreakdown({
          goalId: goal.id,
          title: goal.title,
          description: goal.description ?? "",
          category,
          dueDate,
          milestones: result.milestones?.length ?? 0,
          tasks: result.tasks ?? [],
        });
        setOpen(false);
        setTitle("");
        setDescription("");
        setCategory("Personal");
        setDueDate("");
        toast.success("Goal created", {
          description: "Your AI plan is ready in the workspace.",
        });
      } catch (error) {
        toast.error("Goal creation failed", {
          description: error instanceof Error ? error.message : "Could not reach the n8n webhook.",
        });
      } finally {
        setPending(false);
      }
      return;
    }

    addGoal({ title: title.trim(), description: description.trim(), category, dueDate });
    setOpen(false);
    setTitle("");
    setDescription("");
    setCategory("Personal");
    setDueDate("");
    toast.success("Goal created", {
      description: "Your AI plan is being prepared.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 rounded-md bg-acid-lime text-[13px] font-[510] tracking-[-0.011em] text-void shadow-none hover:opacity-90">
            <Target className="size-4" />
            New goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-graphite bg-carbon sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-[510] tracking-[-0.011em] text-paper">
            Create a new goal
          </DialogTitle>
          <DialogDescription className="text-[13px] text-fog">
            Komitt will break it down into milestones and scheduled tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="goal-title" className="text-[12px] text-fog">
              Goal title
            </Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Launch my startup"
              required
              className="h-10 rounded-md bg-obsidian/40 px-3 text-[14px] text-mist placeholder:text-fog/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="goal-desc" className="text-[12px] text-fog">
              Outcome
            </Label>
            <Textarea
              id="goal-desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the outcome, deadline, and any constraints."
              rows={3}
              className="rounded-md bg-obsidian/40 text-[14px] text-mist placeholder:text-fog/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] text-fog">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 rounded-md bg-obsidian/40 text-[13px] text-mist">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-graphite bg-obsidian text-mist">
                  {categories.map((item) => (
                    <SelectItem key={item} value={item} className="text-[13px]">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-due" className="text-[12px] text-fog">
                Due date
              </Label>
              <Input
                id="goal-due"
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
              disabled={pending}
              className="h-9 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Creating plan…" : "Create goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
