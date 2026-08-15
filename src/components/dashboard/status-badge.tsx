import { cn } from "@/lib/utils";

const variants = {
  neutral: "bg-white/[0.05] text-fog",
  lime: "bg-acid-lime/10 text-acid-lime",
  green: "bg-pulse-green/10 text-pulse-green",
  red: "bg-coral-red/10 text-coral-red",
  teal: "bg-signal-teal/10 text-signal-teal",
  violet: "bg-iris-violet/15 text-lavender",
} as const;

export type BadgeTone = keyof typeof variants;

export function StatusBadge({
  tone = "neutral",
  children,
  className,
  dot = false,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] leading-none",
        variants[tone],
        className,
      )}
    >
      {dot && <span className="size-1 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function milestoneStatusTone(status: string): BadgeTone {
  switch (status) {
    case "completed":
      return "green";
    case "in_progress":
      return "lime";
    case "pending":
      return "neutral";
    default:
      return "neutral";
  }
}

export function milestoneStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In progress";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}

export function goalStatusTone(status: string): BadgeTone {
  switch (status) {
    case "active":
      return "lime";
    case "not_started":
      return "neutral";
    case "paused":
      return "neutral";
    case "completed":
      return "green";
    default:
      return "neutral";
  }
}

export function insightTone(category: string): BadgeTone {
  switch (category) {
    case "coaching":
      return "lime";
    case "consistency":
      return "teal";
    case "warning":
      return "red";
    default:
      return "neutral";
  }
}
