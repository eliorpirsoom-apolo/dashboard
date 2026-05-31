"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SpendPoint = { date: string; spend: number };

export function SpendChart({ data }: { data: SpendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1877f2" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1877f2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          stroke="var(--muted)"
          fontSize={11}
          tickFormatter={(d: string) => d.slice(8)}
        />
        <YAxis
          stroke="var(--muted)"
          fontSize={12}
          tickFormatter={(v) => `₪${v}`}
          width={50}
        />
        <Tooltip
          formatter={(v) => [`₪${Number(v).toLocaleString("he-IL")}`, "הוצאה"]}
          labelFormatter={(d) => `תאריך: ${d}`}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            direction: "rtl",
          }}
        />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#1877f2"
          strokeWidth={2}
          fill="url(#spendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
