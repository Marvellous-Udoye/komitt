"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, History, Mic, Send, Sparkles } from "lucide-react";
import { PageHeader, Card, CardHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/dashboard/data-states";
import { StatusBadge, milestoneStatusLabel, milestoneStatusTone } from "@/components/dashboard/status-badge";
import { useDashboard } from "@/lib/dashboard-store";
import { formatDate, type Checkin } from "@/lib/demo-data";

export default function CheckInPage() {
  const goals = useDashboard((state) => state.goals);
  const milestones = useDashboard((state) => state.milestones);
  const submitCheckin = useDashboard((state) => state.submitCheckin);
  const loadCheckinHistory = useDashboard((state) => state.loadCheckinHistory);
  const transcribeAudio = useDashboard((state) => state.transcribeAudio);
  const [goalId, setGoalId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [context, setContext] = useState("");
  const [marksComplete, setMarksComplete] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState<Checkin[]>([]);
  const [pending, setPending] = useState(false);
  const [recording, setRecording] = useState(false);

  const goalMilestones = useMemo(
    () => milestones.filter((milestone) => milestone.goalId === goalId),
    [goalId, milestones],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!goalId || !milestoneId || !context.trim()) return;
    setPending(true);
    try {
      const result = await submitCheckin({
        goalId,
        milestoneId,
        context: context.trim(),
        marksMilestoneComplete: marksComplete,
      });
      setFeedback(result);
      setContext("");
      setMarksComplete(false);
      setHistory(await loadCheckinHistory(goalId, milestoneId));
    } catch (error) {
      toast.error("Check-in failed", {
        description: error instanceof Error ? error.message : "Could not save this check-in.",
      });
    } finally {
      setPending(false);
    }
  }

  async function selectMilestone(nextMilestoneId: string) {
    setMilestoneId(nextMilestoneId);
    if (goalId) {
      setHistory(await loadCheckinHistory(goalId, nextMilestoneId));
    }
  }

  async function recordContext() {
    if (recording) return;
    if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") {
      toast.error("Voice input is not available in this browser.");
      return;
    }
    setRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.start();
      await new Promise((resolve) => setTimeout(resolve, 4500));
      recorder.stop();
      await new Promise((resolve) => {
        recorder.onstop = resolve;
      });
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      const text = await transcribeAudio(await blobToBase64(blob), blob.type);
      if (text) setContext((current) => `${current}${current ? "\n" : ""}${text}`);
    } catch (error) {
      toast.error("Transcription failed", {
        description: error instanceof Error ? error.message : "Could not transcribe audio.",
      });
    } finally {
      setRecording(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Check-in"
        description="Check in against a specific goal and milestone. You can log multiple updates in a day."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader title="New check-in" description="Tell Komitt what happened and get coaching feedback immediately." />
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Select value={goalId} onValueChange={(value) => { setGoalId(value); setMilestoneId(""); setHistory([]); }}>
              <SelectTrigger className="h-10 rounded-md border-graphite bg-obsidian/40 text-[13px] text-mist">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent className="border-graphite bg-obsidian text-mist">
                {goals.map((goal) => <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={milestoneId} onValueChange={selectMilestone} disabled={!goalId}>
              <SelectTrigger className="h-10 rounded-md border-graphite bg-obsidian/40 text-[13px] text-mist">
                <SelectValue placeholder="Select milestone" />
              </SelectTrigger>
              <SelectContent className="border-graphite bg-obsidian text-mist">
                {goalMilestones.map((milestone) => (
                  <SelectItem key={milestone.id} value={milestone.id}>{milestone.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Textarea
                value={context}
                onChange={(event) => setContext(event.target.value)}
                rows={7}
                placeholder="What did you do, learn, avoid, struggle with, or prove since the last check-in?"
                className="pr-12"
              />
              <button
                type="button"
                onClick={recordContext}
                className={`absolute right-2 top-2 flex size-8 items-center justify-center rounded-md border border-graphite text-fog hover:text-paper ${recording ? "border-acid-lime text-acid-lime" : ""}`}
                title="Record check-in context"
              >
                <Mic className="size-4" />
              </button>
            </div>

            <label className="flex items-center gap-3 rounded-md border border-graphite bg-obsidian/40 p-3 text-[13px] text-mist">
              <input
                type="checkbox"
                checked={marksComplete}
                onChange={(event) => setMarksComplete(event.target.checked)}
                className="size-4 accent-acid-lime"
              />
              Mark this milestone complete
            </label>

            <Button type="submit" disabled={pending || !goalId || !milestoneId || !context.trim()} className="w-full bg-acid-lime text-void">
              <Send className="size-4" /> {pending ? "Checking in..." : "Submit check-in"}
            </Button>
          </form>

          {feedback && (
            <div className="mt-5 rounded-lg border border-acid-lime/30 bg-acid-lime/10 p-4">
              <div className="flex items-center gap-2 text-[13px] font-[510] text-acid-lime">
                <Sparkles className="size-4" /> AI Coach
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-mist">{feedback}</p>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="History" description="Pick a goal and milestone to browse previous check-ins." trailing={<History className="size-4 text-fog" />} />
          {!milestoneId ? (
            <EmptyState icon={History} title="Select a milestone" description="History is grouped by goal and milestone so each accountability thread stays focused." />
          ) : history.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="No check-ins yet" description="Submit the first check-in for this milestone." />
          ) : (
            <div className="mt-5 space-y-4">
              {history.map((entry) => (
                <article key={entry.id} className="relative border-l border-graphite pl-4">
                  <span className="absolute -left-1.5 top-1 size-3 rounded-full bg-acid-lime" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[11px] text-fog">{formatDate(entry.createdAt)}</p>
                    {entry.marksMilestoneComplete && <StatusBadge tone="green">Marked complete</StatusBadge>}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-mist">{entry.context}</p>
                  {entry.feedback && (
                    <p className="mt-2 rounded-md bg-white/[0.03] p-3 text-[13px] leading-relaxed text-fog">{entry.feedback}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader title="Goal browser" description="Tap a goal, then choose a milestone to inspect its accountability thread." />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {goals.map((goal) => (
            <div key={goal.id} className="rounded-lg border border-graphite bg-obsidian/40 p-4">
              <p className="text-[14px] font-[510] text-mist">{goal.title}</p>
              <div className="mt-3 space-y-2">
                {milestones.filter((milestone) => milestone.goalId === goal.id).map((milestone) => (
                  <button
                    key={milestone.id}
                    onClick={() => { setGoalId(goal.id); void selectMilestone(milestone.id); }}
                    className="flex w-full items-center justify-between gap-3 rounded-md border border-graphite bg-carbon px-3 py-2 text-left text-[12px] text-fog hover:text-mist"
                  >
                    <span>{milestone.title}</span>
                    <StatusBadge tone={milestoneStatusTone(milestone.status)}>{milestoneStatusLabel(milestone.status)}</StatusBadge>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

async function blobToBase64(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}
