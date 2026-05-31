import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Kpi } from "@/lib/mock-data";

export function StatCard({ kpi }: { kpi: Kpi }) {
  const positive = kpi.change >= 0;
  return (
    <div className="rounded-xl border bg-surface p-5">
      <p className="text-sm text-muted">{kpi.label}</p>
      <p className="mt-2 text-2xl font-bold">{kpi.value}</p>
      <div
        className={clsx(
          "mt-2 flex items-center gap-1 text-sm font-medium",
          positive ? "text-success" : "text-danger",
        )}
      >
        {positive ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
        {Math.abs(kpi.change)}%
        <span className="text-muted font-normal">מול חודש קודם</span>
      </div>
    </div>
  );
}
