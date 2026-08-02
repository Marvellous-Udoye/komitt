import { CheckCircle2, Flame, Target } from "lucide-react";

const bars = [42, 68, 55, 82, 74, 91, 64];

export function MiniDashboard() {
  return (
    <div className="preview-shell">
      <div className="flex items-center justify-between">
        <div>
          <p className="label">Today</p>
          <h3 className="text-2xl font-bold">Launch Startup</h3>
        </div>
        <span className="rounded-full bg-highlighter-yellow px-3 py-1 font-mono text-xs">
          5 day streak
        </span>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="metric-note bg-sticky-note-mint">
          <Target size={19} />
          <strong>4</strong>
          <span>active goals</span>
        </div>
        <div className="metric-note bg-sticky-note-teal">
          <CheckCircle2 size={19} />
          <strong>31</strong>
          <span>tasks done</span>
        </div>
        <div className="metric-note bg-sticky-note-blush">
          <Flame size={19} />
          <strong>86%</strong>
          <span>weekly</span>
        </div>
      </div>
      <div className="mt-6 rounded-cards border border-forest-ink/20 bg-cream-paper p-5">
        <div className="chart-bars">
          {bars.map((bar, index) => (
            <span key={index} style={{ height: `${bar}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-cards border border-forest-ink/20 bg-highlighter-yellow p-4 text-left">
        <p className="font-semibold">Coach says:</p>
        <p className="mt-1 text-sm leading-6">
          You complete more work before noon. Move the pitch deck task earlier tomorrow.
        </p>
      </div>
    </div>
  );
}
