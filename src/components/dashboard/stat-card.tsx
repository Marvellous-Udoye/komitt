import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="hairline relative overflow-hidden rounded-xl bg-carbon p-5">
      <div className="flex items-start max-sm:gap-4 justify-between">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            accent ? "bg-acid-lime/10" : "bg-white/[0.04]",
          )}
        >
          <Icon className={cn("size-4", accent ? "text-acid-lime" : "text-fog")} />
        </span>
        {hint && (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-pulse-green">
            <TrendingUp className="size-3" />
            {hint}
          </span>
        )}
      </div>
      <p className="mt-5 text-[28px] font-[510] leading-none tracking-[-0.022em] text-paper">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-fog">{label}</p>
    </div>
  );
}
