"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GripVertical, Mic, Plus, Sparkles, Target, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/lib/dashboard-store";
import { TODAY } from "@/lib/demo-data";
import type { MilestoneDraft } from "@/lib/n8n-client";
import { cn } from "@/lib/utils";

const tagOptions = ["Backend Engineer", "Freelance work", "Career change", "Just curious"];

type Source = "ai_generated" | "user_provided";

export function NewGoalDialog({ trigger }: { trigger?: React.ReactNode }) {
  const generateMilestones = useDashboard((state) => state.generateMilestones);
  const createGoal = useDashboard((state) => state.createGoal);
  const transcribeAudio = useDashboard((state) => state.transcribeAudio);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>(["Backend Engineer"]);
  const [customTag, setCustomTag] = useState("");
  const [source, setSource] = useState<Source>("ai_generated");
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([
    { title: "", order_index: 0 },
  ]);
  const [startingNow, setStartingNow] = useState(true);
  const [targetStartDate, setTargetStartDate] = useState(TODAY);
  const [targetEndDate, setTargetEndDate] = useState("");
  const [pending, setPending] = useState(false);
  const [recording, setRecording] = useState(false);

  function reset() {
    setStep(1);
    setTitle("");
    setDescription("");
    setTags(["Backend Engineer"]);
    setCustomTag("");
    setSource("ai_generated");
    setMilestones([{ title: "", order_index: 0 }]);
    setStartingNow(true);
    setTargetStartDate(TODAY);
    setTargetEndDate("");
  }

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  function addCustomTag() {
    const trimmed = customTag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((current) => [...current, trimmed]);
    setCustomTag("");
  }

  async function recordIntoDescription() {
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
      const audioBase64 = await blobToBase64(blob);
      const text = await transcribeAudio(audioBase64, blob.type);
      if (text) setDescription((current) => `${current}${current ? "\n" : ""}${text}`);
    } catch (error) {
      toast.error("Transcription failed", {
        description: error instanceof Error ? error.message : "Could not transcribe audio.",
      });
    } finally {
      setRecording(false);
    }
  }

  async function handleStepTwo() {
    if (source === "ai_generated") {
      setPending(true);
      try {
        const result = await generateMilestones({ title, description, applicationTags: tags });
        setMilestones(result.map((item, index) => ({ ...item, order_index: index })));
      } catch (error) {
        toast.error("Milestone generation failed", {
          description: error instanceof Error ? error.message : "Add milestones manually instead.",
        });
      } finally {
        setPending(false);
      }
    }
    setStep(2);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const cleanMilestones = milestones
      .map((milestone, index) => ({ ...milestone, title: milestone.title.trim(), order_index: index }))
      .filter((milestone) => milestone.title);
    if (!title.trim() || !description.trim() || cleanMilestones.length === 0 || !targetEndDate) return;

    setPending(true);
    try {
      await createGoal({
        title: title.trim(),
        description: description.trim(),
        applicationTags: tags,
        milestonesSource: source,
        targetStartDate: startingNow ? targetStartDate : null,
        targetEndDate,
        milestones: cleanMilestones,
      });
      toast.success("Goal saved", {
        description: "Your milestones are ready for accountability.",
      });
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Goal creation failed", {
        description: error instanceof Error ? error.message : "Could not save the goal.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) reset(); }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 rounded-md bg-acid-lime text-[13px] font-[510] tracking-[-0.011em] text-void shadow-none hover:opacity-90">
            <Target className="size-4" />
            New goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[88dvh] overflow-y-auto border-graphite bg-carbon sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-[510] tracking-[-0.011em] text-paper">
            Create a learning goal
          </DialogTitle>
          <DialogDescription className="text-[13px] text-fog">
            Step {step} of 3 - context, milestones, then timing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Goal title">
                <Input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Become job-ready in backend development" />
              </Field>
              <Field label="Description">
                <div className="relative">
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    rows={5}
                    placeholder="Explain what you want to learn, why it matters, your current level, constraints, and what real-world outcome this should support."
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={recordIntoDescription}
                    className={cn(
                      "absolute right-2 top-2 flex size-8 items-center justify-center rounded-md border border-graphite text-fog hover:text-paper",
                      recording && "border-acid-lime text-acid-lime",
                    )}
                    title="Record goal context"
                  >
                    <Mic className="size-4" />
                  </button>
                </div>
                <p className="text-[12px] text-fog">
                  This context is required because it gives the coach enough signal to create useful milestones.
                </p>
              </Field>
              <Field label="Application / use-case">
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[12px]",
                        tags.includes(tag)
                          ? "border-acid-lime/60 bg-acid-lime/10 text-acid-lime"
                          : "border-graphite bg-white/[0.03] text-fog hover:text-mist",
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input value={customTag} onChange={(event) => setCustomTag(event.target.value)} placeholder="Add custom use-case" />
                  <Button type="button" variant="outline" onClick={addCustomTag}>Add</Button>
                </div>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-[12px] text-fog">Do you want AI to suggest milestones, or do you have your own?</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Choice active={source === "ai_generated"} onClick={() => setSource("ai_generated")} icon={<Sparkles className="size-4" />} title="Suggest with AI" />
                  <Choice active={source === "user_provided"} onClick={() => setSource("user_provided")} icon={<Target className="size-4" />} title="I have my own" />
                </div>
              </div>
              <MilestoneEditor milestones={milestones} setMilestones={setMilestones} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Choice active={startingNow} onClick={() => setStartingNow(true)} title="Starting now" />
                <Choice active={!startingNow} onClick={() => setStartingNow(false)} title="Haven't decided yet" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Target start date">
                  <Input type="date" value={targetStartDate} disabled={!startingNow} onChange={(event) => setTargetStartDate(event.target.value)} />
                </Field>
                <Field label="Overall target end date">
                  <Input type="date" value={targetEndDate} onChange={(event) => setTargetEndDate(event.target.value)} required />
                </Field>
              </div>
              <MilestoneEditor milestones={milestones} setMilestones={setMilestones} withDates />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            {step > 1 && <Button type="button" variant="ghost" onClick={() => setStep((current) => current - 1)}>Back</Button>}
            {step === 1 && (
              <Button type="button" disabled={!title.trim() || !description.trim()} onClick={handleStepTwo}>
                Continue
              </Button>
            )}
            {step === 2 && <Button type="button" onClick={() => setStep(3)}>Continue</Button>}
            {step === 3 && <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save goal"}</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] text-fog">{label}</Label>
      {children}
    </div>
  );
}

function Choice({ active, onClick, icon, title }: { active: boolean; onClick: () => void; icon?: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-left text-[13px]",
        active ? "border-acid-lime/70 bg-acid-lime/10 text-acid-lime" : "border-graphite bg-obsidian/50 text-fog",
      )}
    >
      {icon}
      {title}
    </button>
  );
}

function MilestoneEditor({
  milestones,
  setMilestones,
  withDates = false,
}: {
  milestones: MilestoneDraft[];
  setMilestones: React.Dispatch<React.SetStateAction<MilestoneDraft[]>>;
  withDates?: boolean;
}) {
  function update(index: number, patch: Partial<MilestoneDraft>) {
    setMilestones((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-2">
      {milestones.map((milestone, index) => (
        <div key={index} className="rounded-lg border border-graphite bg-obsidian/40 p-3">
          <div className="flex items-center gap-2">
            <GripVertical className="size-4 text-fog" />
            <Input value={milestone.title} onChange={(event) => update(index, { title: event.target.value })} placeholder={`Milestone ${index + 1}`} />
            <button type="button" onClick={() => setMilestones((current) => current.filter((_, i) => i !== index))} className="text-fog hover:text-coral-red" title="Remove milestone">
              <Trash2 className="size-4" />
            </button>
          </div>
          {withDates && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Input type="date" value={milestone.start_date ?? ""} onChange={(event) => update(index, { start_date: event.target.value })} />
              <Input type="date" value={milestone.end_date ?? ""} onChange={(event) => update(index, { end_date: event.target.value })} />
            </div>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => setMilestones((current) => [...current, { title: "", order_index: current.length }])}
        className="w-full"
      >
        <Plus className="size-4" /> Add milestone
      </Button>
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
