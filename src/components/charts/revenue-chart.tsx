"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueByMonth } from "@/lib/mock-data";

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} />
        <YAxis
          stroke="var(--muted)"
          fontSize={12}
          tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`}
          width={50}
        />
        <Tooltip
          formatter={(v) => `₪${Number(v).toLocaleString("he-IL")}`}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            direction: "rtl",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="revenue"
          name="הכנסות בפועל"
          stroke="#4f46e5"
          strokeWidth={2}
          fill="url(#revFill)"
        />
        <Line
          type="monotone"
          dataKey="target"
          name="יעד"
          stroke="var(--muted)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
