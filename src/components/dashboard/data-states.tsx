import { AlertTriangle, RefreshCcw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("animate-pulse rounded-md bg-white/[0.05]", className)} style={style} aria-hidden="true" />;
}

export function CardFrame({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("hairline rounded-xl bg-carbon p-5", className)}>
      {children}
    </div>
  );
}

export function CardHeaderSkeleton({ trailing = true }: { trailing?: boolean }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="space-y-1.5">
        <Pulse className="h-3.5 w-28" />
        <Pulse className="h-2.5 w-40" />
      </div>
      {trailing && <Pulse className="size-7 rounded-md" />}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="hairline relative overflow-hidden rounded-xl bg-carbon p-5">
      <div className="flex items-start justify-between">
        <Pulse className="size-8 rounded-md" />
        <Pulse className="h-2.5 w-16" />
      </div>
      <Pulse className="mt-5 h-7 w-20" />
      <Pulse className="mt-2 h-2.5 w-24" />
    </div>
  );
}

export function StatGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <CardFrame>
      <CardHeaderSkeleton />
      <div className="flex h-[240px] items-end gap-3 pt-2">
        {[45, 70, 55, 85, 40, 62, 78, 50, 66, 58, 72, 35, 80, 55].map((h, i) => (
          <Pulse key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
    </CardFrame>
  );
}

export function QueueRowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <CardFrame>
      <CardHeaderSkeleton />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex w-full items-center gap-3 rounded-lg border border-graphite/70 bg-obsidian/40 px-3 py-2.5"
          >
            <Pulse className="size-4 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Pulse className="h-3 w-2/3" />
              <Pulse className="h-2.5 w-1/3" />
            </div>
            <Pulse className="h-4 w-14" />
          </div>
        ))}
      </div>
    </CardFrame>
  );
}

export function TableRowsSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <CardFrame className="p-0">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="space-y-1.5">
          <Pulse className="h-3.5 w-36" />
          <Pulse className="h-2.5 w-48" />
        </div>
        <Pulse className="size-7 rounded-md" />
      </div>
      <div className="border-t border-graphite/70 px-5 py-2.5">
        <div className="flex gap-6">
          {Array.from({ length: cols }).map((_, i) => (
            <Pulse key={i} className="h-2.5 w-16" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 border-t border-graphite/50 px-5 py-3.5"
        >
          <div className="flex-1 space-y-1.5">
            <Pulse className="h-3 w-3/4" />
            <Pulse className="h-2.5 w-1/2" />
          </div>
          <div className="flex flex-1 gap-6">
            <Pulse className="h-2.5 w-20" />
            <Pulse className="h-2.5 w-16" />
            <Pulse className="h-4 w-14" />
          </div>
        </div>
      ))}
    </CardFrame>
  );
}

export function CoachSkeleton() {
  return (
    <CardFrame>
      <CardHeaderSkeleton />
      <div className="space-y-2">
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-11/12" />
        <Pulse className="h-3 w-4/5" />
      </div>
      <div className="mt-6 flex gap-2">
        <Pulse className="h-9 w-28 rounded-md" />
        <Pulse className="h-9 w-20 rounded-md" />
      </div>
    </CardFrame>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {[2, 5, 4, 3].map((w, i) => (
        <Pulse key={i} className="h-7 rounded-md" style={{ width: `${w * 6}px` }} />
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-graphite bg-transparent px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-md bg-obsidian">
        <Icon className="size-4 text-fog" />
      </span>
      <div className="space-y-1">
        <p className="text-[14px] font-[510] tracking-[-0.011em] text-mist">{title}</p>
        {description && <p className="mx-auto max-w-sm text-[12px] leading-relaxed text-fog">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyRow({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-graphite bg-obsidian/20 px-6 py-8 text-center">
      <Icon className="size-4 text-fog" />
      <p className="text-[13px] font-[510] text-mist">{title}</p>
      {description && <p className="max-w-xs text-[12px] leading-relaxed text-fog">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="hairline rounded-xl border-coral-red/30 bg-coral-red/[0.04] p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-coral-red/10">
          <AlertTriangle className="size-4 text-coral-red" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-[510] tracking-[-0.011em] text-paper">Couldn&apos;t load your data</p>
          <p className="mt-1 text-[12px] leading-relaxed text-fog">
            {message ?? "The dashboard webhook didn't respond. Check that n8n and Supabase are reachable, then retry."}
          </p>
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="h-8 shrink-0 rounded-md border border-graphite bg-obsidian px-3 text-[12px] font-normal text-mist shadow-none hover:bg-white/[0.05]"
          >
            <RefreshCcw className="size-3.5" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

export function PageStatus({
  status,
  error,
  onRetry,
  loading,
  empty,
}: {
  status: "loading" | "ready" | "error";
  error?: string | null;
  onRetry?: () => void;
  loading: React.ReactNode;
  empty: React.ReactNode;
}) {
  if (status === "loading") return <>{loading}</>;
  if (status === "error") return <ErrorState message={error ?? undefined} onRetry={onRetry} />;
  return <>{empty}</>;
}