import { StatCard } from "@/components/stat-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { kpis } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">סקירה ואנליטיקס</h1>
        <p className="text-muted">מבט על הביצועים שלך לחודש האחרון</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-surface p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold">הכנסות מול יעד</h2>
          <RevenueChart />
        </div>
        <div className="rounded-xl border bg-surface p-5">
          <h2 className="mb-4 font-semibold">מקורות תנועה</h2>
          <TrafficChart />
        </div>
      </div>
    </div>
  );
}
