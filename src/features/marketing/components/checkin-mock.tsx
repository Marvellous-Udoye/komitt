"use client";

import { Bot, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";

const options = ["Yes", "Partially", "No"];

export function CheckinMock() {
  return (
    <div className="hairline overflow-hidden rounded-xl bg-carbon">
      <div className="flex items-center justify-between gap-4 border-b border-graphite/60 px-5 py-3">
        <div>
          <p className="text-[11px] font-[510] uppercase tracking-[0.08em] text-fog">
            Daily check-in
          </p>
          <h4 className="mt-1 text-[15px] font-[510] tracking-[-0.011em] text-paper">
            Did you follow through today?
          </h4>
        </div>
        <span className="flex size-7 items-center justify-center rounded-md bg-acid-lime/10">
          <Bot className="size-4 text-acid-lime" />
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-2">
          {options.map((option) => (
            <button
              key={option}
              className={cn(
                "rounded-md border px-3 py-2.5 text-[13px] transition-colors",
                option === "Partially"
                  ? "border-acid-lime/60 bg-acid-lime/10 text-acid-lime"
                  : "border-graphite bg-obsidian/40 text-fog hover:border-smoke hover:text-mist",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-graphite bg-obsidian/40 px-3 py-2.5">
          <span className="flex-1 text-[13px] text-fog">
            What helped or blocked you today?
          </span>
          <SendHorizonal className="size-4 text-fog" />
        </div>
      </div>
      <div className="flex items-start gap-3 border-t border-graphite/60 bg-acid-lime/[0.04] px-5 py-4">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-acid-lime/10">
          <Bot className="size-3.5 text-acid-lime" />
        </span>
        <p className="text-[13px] leading-relaxed text-fog">
          Good momentum. Tomorrow, schedule the hardest task before 10am — that is
          when your consistency peaks.
        </p>
      </div>
    </div>
  );
}
