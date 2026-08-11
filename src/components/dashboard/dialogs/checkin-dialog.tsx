"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bot, Check, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/lib/dashboard-store";
import { isLiveMode, submitCheckinLive } from "@/lib/n8n-client";
import { cn } from "@/lib/utils";
import type { CheckinStatus } from "@/lib/demo-data";

const options: Array<{ value: CheckinStatus; label: string; icon: typeof Check }> = [
  { value: "yes", label: "Yes", icon: Check },
  { value: "partially", label: "Partially", icon: Minus },
  { value: "no", label: "No", icon: X },
];

export function CheckinDialog({
  trigger,
  align = "right",
}: {
  trigger?: React.ReactNode;
  align?: "left" | "right";
}) {
  const submitCheckin = useDashboard((state) => state.submitCheckin);
  const lastCheckinStatus = useDashboard((state) => state.lastCheckinStatus);

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<CheckinStatus | null>(null);
  const [reflection, setReflection] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStatus(null);
    setReflection("");
    setFeedback(null);
    setSubmitting(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!status) return;

    if (isLiveMode()) {
      setSubmitting(true);
      try {
        const result = await submitCheckinLive(undefined, {
          completion_status: status,
          reflection: reflection.trim(),
        });
        setFeedback(result.feedback ?? submitCheckin(status, reflection.trim()));
        toast.success("Check-in submitted", {
          description: "Your coach has reviewed your day.",
        });
      } catch (error) {
        toast.error("Check-in failed", {
          description: error instanceof Error ? error.message : "Could not reach the n8n webhook.",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const nextFeedback = submitCheckin(status, reflection.trim());
    setFeedback(nextFeedback);
    toast.success("Check-in submitted", {
      description: "Your coach has reviewed your day.",
    });
  }

  function handleClose(open: boolean) {
    setOpen(open);
    if (!open) window.setTimeout(reset, 150);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 rounded-md bg-acid-lime text-[13px] font-[510] tracking-[-0.011em] text-void shadow-none hover:opacity-90">
            <Bot className="size-4" />
            Check in
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "border-graphite bg-carbon sm:max-w-[440px]",
          align === "left" && "sm:left-[calc(240px+1.25rem)]",
        )}
      >
        {feedback ? (
          <div className="space-y-5 py-2">
            <DialogHeader>
              <DialogTitle className="text-[17px] font-[510] tracking-[-0.011em] text-paper">
                Coach feedback
              </DialogTitle>
              <DialogDescription className="text-[13px] text-fog">
                Checked in as <span className="font-[510] text-acid-lime capitalize">{status}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg border border-graphite bg-obsidian/50 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-acid-lime/10">
                  <Bot className="size-4 text-acid-lime" />
                </span>
                <p className="text-[14px] leading-relaxed text-mist">{feedback}</p>
              </div>
            </div>
            <Button
              onClick={() => handleClose(false)}
              className="h-9 w-full rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            <DialogHeader>
              <DialogTitle className="text-[17px] font-[510] tracking-[-0.011em] text-paper">
                Daily check-in
              </DialogTitle>
              <DialogDescription className="text-[13px] text-fog">
                Did you follow through on today&apos;s tasks?
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-2">
              {options.map((option) => {
                const selected = status === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    className={cn(
                      "flex h-11 flex-col items-center justify-center gap-1 rounded-md border text-[12px] transition-colors",
                      selected
                        ? "border-acid-lime/60 bg-acid-lime/10 text-acid-lime"
                        : "border-graphite bg-obsidian/40 text-fog hover:border-smoke hover:text-mist",
                    )}
                  >
                    <option.icon className="size-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="checkin-reflection" className="text-[12px] text-fog">
                Reflection <span className="text-ash">(optional)</span>
              </label>
              <Textarea
                id="checkin-reflection"
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="What helped or blocked you today?"
                rows={3}
                className="rounded-md bg-obsidian/40 text-[14px] text-mist placeholder:text-fog/50"
              />
            </div>
            {lastCheckinStatus && (
              <p className="text-[12px] text-fog">
                Already checked in today as{" "}
                <span className="capitalize text-acid-lime">{lastCheckinStatus}</span>. Submit again to
                update.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleClose(false)}
                className="h-9 rounded-md text-[13px] text-mist hover:bg-white/[0.05]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!status || submitting}
                className="h-9 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit check-in"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
