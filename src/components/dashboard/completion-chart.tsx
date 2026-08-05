"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "@/lib/dashboard-store";

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { day: string; completed: number; total: number } }> }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-graphite bg-obsidian px-3 py-2 shadow-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog">{point.day}</p>
      <p className="mt-1 text-[13px] text-mist">
        <span className="font-[510] text-acid-lime">{point.completed}</span>
        <span className="text-fog"> / {point.total} tasks</span>
      </p>
    </div>
  );
}

export function CompletionChart() {
  const weekly = useDashboard((state) => state.weekly);

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weekly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={3}>
          <CartesianGrid vertical={false} stroke="#23252a" strokeDasharray="0" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8a8f98", fontSize: 11, fontFamily: "inherit" }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#62666d", fontSize: 10 }}
            allowDecimals={false}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="total" radius={[3, 3, 0, 0]} fill="#23252a" />
          <Bar dataKey="completed" radius={[3, 3, 0, 0]} fill="#8a8f98">
            {weekly.map((point) => (
              <Cell
                key={point.day}
                fill={point.completed / Math.max(point.total, 1) >= 0.8 ? "#e4f222" : "#8a8f98"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
