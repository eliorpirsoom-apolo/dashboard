"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { trafficSources } from "@/lib/mock-data";

const COLORS = ["#4f46e5", "#7c3aed", "#db2777", "#0ea5e9"];

export function TrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={trafficSources}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
        >
          {trafficSources.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => Number(v).toLocaleString("he-IL")}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            direction: "rtl",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
