import { UserPlus, Users, CircleCheck, Megaphone } from "lucide-react";
import { isLeadsConfigured, fetchLeadStats, type LeadStats } from "@/lib/monday";
import { isWindsorConfigured, fetchMediaSpend, type MediaSpend } from "@/lib/windsor";
import { demoLeadStats, demoMediaSpend } from "@/lib/mock-data";
import { SpendChart } from "@/components/charts/spend-chart";
import { LeadsFunnel } from "@/components/leads-funnel";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // --- לידים (Monday) ---
  let leads: LeadStats = demoLeadStats;
  let leadsLive = false;
  if (isLeadsConfigured()) {
    try {
      leads = await fetchLeadStats();
      leadsLive = true;
    } catch {
      /* נופל לדמו */
    }
  }

  // --- תקציב מדיה (Windsor.ai) ---
  let spend: MediaSpend = demoMediaSpend;
  let spendLive = false;
  if (isWindsorConfigured()) {
    try {
      spend = await fetchMediaSpend();
      spendLive = true;
    } catch {
      /* נופל לדמו */
    }
  }

  const ils = (n: number) => `₪${n.toLocaleString("he-IL")}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">סקירה ואנליטיקס</h1>
          <p className="text-muted">לידים, סגירות ותקציב מדיה — מבט על החודש</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <SourceBadge label="לידים" live={leadsLive} liveText="Monday" />
          <SourceBadge label="מדיה" live={spendLive} liveText="Windsor" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<UserPlus className="h-5 w-5" />}
          label="לידים חדשים היום"
          value={leads.leadsToday.toLocaleString("he-IL")}
          accent="#1877f2"
        />
        <MetricCard
          icon={<Users className="h-5 w-5" />}
          label="לידים החודש"
          value={leads.leadsThisMonth.toLocaleString("he-IL")}
          accent="#784bd1"
        />
        <MetricCard
          icon={<CircleCheck className="h-5 w-5" />}
          label="סגירות החודש"
          value={leads.closuresThisMonth.toLocaleString("he-IL")}
          accent="#00c875"
        />
        <MetricCard
          icon={<Megaphone className="h-5 w-5" />}
          label="תקציב מדיה שיצא (החודש)"
          value={ils(spend.monthTotal)}
          sub={`היום: ${ils(spend.today)}`}
          accent="#fdab3d"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-surface p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">הוצאת מדיה יומית (החודש)</h2>
            <div className="flex gap-3 text-xs text-muted">
              {spend.bySource.map((s) => (
                <span key={s.source}>
                  {s.source}: <b className="text-foreground">{ils(s.spend)}</b>
                </span>
              ))}
            </div>
          </div>
          <SpendChart data={spend.daily} />
        </div>
        <div className="rounded-xl border bg-surface p-5">
          <h2 className="mb-4 font-semibold">משפך הלידים</h2>
          <LeadsFunnel funnel={leads.funnel} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border bg-surface p-5">
      <div className="flex items-center gap-2 text-muted">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function SourceBadge({
  label,
  live,
  liveText,
}: {
  label: string;
  live: boolean;
  liveText: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium " +
        (live ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600")
      }
    >
      <span
        className={"h-2 w-2 rounded-full " + (live ? "bg-green-500" : "bg-slate-400")}
      />
      {label}: {live ? liveText : "דמו"}
    </span>
  );
}
