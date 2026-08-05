import { CheckCircle2 } from "lucide-react";

const steps = [
  { title: "Research target market", status: "Done" },
  { title: "Draft landing page brief", status: "Done" },
  { title: "Build waitlist signup", status: "Today" },
  { title: "Launch private beta", status: "Upcoming" },
];

export function PlanMock() {
  return (
    <div className="hairline overflow-hidden rounded-xl bg-carbon">
      <div className="flex items-center justify-between gap-4 border-b border-graphite/60 px-5 py-3">
        <div>
          <p className="text-[11px] font-[510] uppercase tracking-[0.08em] text-fog">
            Plan
          </p>
          <h4 className="mt-1 text-[15px] font-[510] tracking-[-0.011em] text-paper">
            Launch my startup
          </h4>
        </div>
        <span className="rounded-md bg-iris-violet/15 px-2 py-1 text-[11px] font-[510] text-lavender">
          2 milestones
        </span>
      </div>
      <div className="space-y-2 p-5">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex items-center gap-3 rounded-lg border border-graphite/70 bg-obsidian/40 px-3 py-2.5"
          >
            {step.status === "Done" ? (
              <span className="flex size-4 items-center justify-center rounded-full bg-acid-lime">
                <CheckCircle2 className="size-3 text-void" />
              </span>
            ) : (
              <span className="size-4 rounded-full border border-fog/40" />
            )}
            <span
              className={`flex-1 text-[13px] ${
                step.status === "Done" ? "text-fog line-through" : "text-mist"
              }`}
            >
              {step.title}
            </span>
            <span
              className={`font-mono text-[10px] ${
                step.status === "Today" ? "text-acid-lime" : "text-fog"
              }`}
            >
              {step.status}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-graphite/60 px-5 py-3">
        <span className="text-[12px] text-fog">Estimated time</span>
        <span className="font-mono text-[12px] text-mist">2h 40m</span>
      </div>
    </div>
  );
}
