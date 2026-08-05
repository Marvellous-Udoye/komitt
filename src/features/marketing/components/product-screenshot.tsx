import { Check, Circle, Flame, LineChart, Sparkles, Target } from "lucide-react";

const bars = [
  { key: "mon", day: "M", value: 68 },
  { key: "tue", day: "T", value: 82 },
  { key: "wed", day: "W", value: 55 },
  { key: "thu", day: "T", value: 92 },
  { key: "fri", day: "F", value: 74 },
  { key: "sat", day: "S", value: 88 },
  { key: "sun", day: "S", value: 60 },
];

const tasks = [
  { title: "Draft landing page hero", time: "35 min", done: true },
  { title: "Ship onboarding copy", time: "20 min", done: false },
  { title: "Evening workout", time: "30 min", done: false },
];

export function ProductScreenshot() {
  return (
    <div className="hairline overflow-hidden rounded-xl bg-carbon">
      <div className="flex items-center justify-between gap-4 border-b border-graphite/60 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-smoke" />
          <span className="size-2.5 rounded-full bg-smoke" />
          <span className="size-2.5 rounded-full bg-smoke" />
        </div>
        <div className="flex items-center gap-1 rounded-md bg-obsidian px-2 py-1">
          <span className="size-1.5 rounded-full bg-acid-lime" />
          <span className="font-mono text-[11px] text-mist">komitt.vercel.app/dashboard</span>
        </div>
        <span className="rounded-md border border-graphite px-2 py-1 font-mono text-[11px] text-fog">
          ⌘K
        </span>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-[1.1fr_1fr] sm:p-8">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-[510] uppercase tracking-[0.08em] text-fog">
                Overview
              </p>
              <h3 className="mt-2 text-[22px] font-[510] leading-tight tracking-[-0.012em] text-paper">
                Execution dashboard
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-graphite px-3 py-1.5 text-[12px] text-mist">
              <Flame className="size-3.5 text-acid-lime" />
              5 day streak
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Target, label: "Goals done", value: "3" },
              { icon: LineChart, label: "Consistency", value: "86%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-graphite/70 bg-obsidian/50 p-4">
                <stat.icon className="size-4 text-fog" />
                <p className="mt-4 text-[26px] font-[510] leading-none tracking-[-0.022em] text-paper">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[12px] text-fog">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.title}
                className="flex items-center gap-3 rounded-lg border border-graphite/70 bg-obsidian/40 px-3 py-2.5"
              >
                {task.done ? (
                  <span className="flex size-4 items-center justify-center rounded-full bg-acid-lime">
                    <Check className="size-3 text-void" />
                  </span>
                ) : (
                  <Circle className="size-4 text-fog/50" />
                )}
                <span
                  className={`flex-1 text-[13px] ${task.done ? "text-fog line-through" : "text-mist"}`}
                >
                  {task.title}
                </span>
                <span className="font-mono text-[11px] text-fog">{task.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-graphite/70 bg-obsidian/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-[510] text-mist">Weekly completion</p>
            <span className="font-mono text-[11px] text-fog">31 / 34</span>
          </div>
          <div className="mt-6 flex flex-1 items-end gap-2">
            {bars.map((bar) => (
              <div key={bar.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end" style={{ height: "112px" }}>
                  <div
                    className="w-full rounded-[3px] bg-fog/20"
                    style={{ height: `${bar.value}%` }}
                  >
                    <div
                      className="w-full rounded-[3px] bg-fog"
                      style={{ height: `${bar.value}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-fog">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 border-t border-graphite/60 px-6 py-4">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-acid-lime/10">
          <Sparkles className="size-3.5 text-acid-lime" />
        </span>
        <p className="text-[13px] leading-relaxed text-fog">
          <span className="font-[510] text-mist">Coach:</span> You complete more work before
          noon. Move the pitch deck task earlier tomorrow to protect your streak.
        </p>
      </div>
    </div>
  );
}
