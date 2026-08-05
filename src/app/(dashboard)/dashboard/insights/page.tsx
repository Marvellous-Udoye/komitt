"use client";

import { Bot, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge, insightTone } from "@/components/dashboard/status-badge";
import { useDashboard } from "@/lib/dashboard-store";
import { cn } from "@/lib/utils";

const categoryMeta = {
  coaching: { icon: Bot, label: "Coaching" },
  consistency: { icon: TrendingUp, label: "Consistency" },
  warning: { icon: AlertTriangle, label: "Warning" },
} as const;

export default function InsightsPage() {
  const insights = useDashboard((state) => state.insights);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insights"
        description="Behavioral signals your coach has noticed across goals, tasks, and check-ins."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((insight, index) => {
          const meta = categoryMeta[insight.category];
          return (
            <div
              key={insight.id}
              className={cn(
                "hairline rounded-xl bg-carbon p-5 transition-colors hover:border-smoke",
                index === 0 && "md:col-span-2",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md",
                    insight.category === "coaching" && "bg-acid-lime/10",
                    insight.category === "consistency" && "bg-signal-teal/10",
                    insight.category === "warning" && "bg-coral-red/10",
                  )}
                >
                  <meta.icon
                    className={cn(
                      "size-4",
                      insight.category === "coaching" && "text-acid-lime",
                      insight.category === "consistency" && "text-signal-teal",
                      insight.category === "warning" && "text-coral-red",
                    )}
                  />
                </span>
                <StatusBadge tone={insightTone(insight.category)}>
                  {meta.label}
                </StatusBadge>
              </div>
              <p
                className={cn(
                  "mt-4 text-[14px] leading-relaxed text-mist",
                  index === 0 && "text-[16px]",
                )}
              >
                {insight.content}
              </p>
              <p className="mt-4 font-mono text-[10px] text-fog">{insight.created_at}</p>
            </div>
          );
        })}
      </div>

      <div className="hairline flex items-start gap-3 rounded-xl border-acid-lime/20 bg-acid-lime/[0.03] p-5">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-acid-lime/10">
          <Sparkles className="size-4 text-acid-lime" />
        </span>
        <p className="text-[13px] leading-relaxed text-fog">
          Insights are generated from your check-ins, postponed tasks, and completion
          patterns. Complete more check-ins to make the coaching sharper.
        </p>
      </div>
    </div>
  );
}
