// קליינט צד-שרת ל-Windsor.ai — מושך נתוני הוצאת מדיה ממערכות הפרסום.
// דורש: WINDSOR_API_KEY. אופציונלי: WINDSOR_CONNECTORS (ברירת מחדל "facebook").
// כדי להוסיף גוגל בעתיד: WINDSOR_CONNECTORS="facebook,google_ads".

const WINDSOR_BASE = "https://connectors.windsor.ai";

// שמות תצוגה לחיבורים
const CONNECTOR_LABELS: Record<string, string> = {
  facebook: "פייסבוק (Meta)",
  google_ads: "Google Ads",
};

export type MediaSpend = {
  monthTotal: number;
  today: number;
  daily: { date: string; spend: number }[];
  bySource: { source: string; spend: number }[];
};

export function isWindsorConfigured(): boolean {
  return !!process.env.WINDSOR_API_KEY;
}

function connectors(): string[] {
  return (process.env.WINDSOR_CONNECTORS || "facebook")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

function ymd(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

type WindsorRow = { date?: string; spend?: number | string };

async function fetchConnectorSpend(
  connector: string,
  from: string,
  to: string,
): Promise<{ date: string; spend: number }[]> {
  const url =
    `${WINDSOR_BASE}/${connector}?api_key=${encodeURIComponent(process.env.WINDSOR_API_KEY ?? "")}` +
    `&date_from=${from}&date_to=${to}&fields=date,spend`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Windsor ${connector} HTTP ${res.status}`);

  const json = (await res.json()) as { data?: WindsorRow[]; result?: WindsorRow[] };
  const rows = json.data ?? json.result ?? [];

  return rows
    .filter((r) => r.date)
    .map((r) => ({ date: r.date as string, spend: Number(r.spend) || 0 }));
}

/** מושך ומסכם את הוצאת המדיה מכל החיבורים המוגדרים, לחודש הנוכחי. */
export async function fetchMediaSpend(): Promise<MediaSpend> {
  const today = ymd(new Date());
  const monthStart = `${today.slice(0, 7)}-01`;

  const dailyMap: Record<string, number> = {};
  const bySource: { source: string; spend: number }[] = [];

  for (const connector of connectors()) {
    const rows = await fetchConnectorSpend(connector, monthStart, today);
    let sourceTotal = 0;
    for (const { date, spend } of rows) {
      dailyMap[date] = (dailyMap[date] ?? 0) + spend;
      sourceTotal += spend;
    }
    bySource.push({
      source: CONNECTOR_LABELS[connector] ?? connector,
      spend: Math.round(sourceTotal),
    });
  }

  const daily = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, spend]) => ({ date, spend: Math.round(spend) }));

  const monthTotal = daily.reduce((s, d) => s + d.spend, 0);
  const todaySpend = dailyMap[today] ? Math.round(dailyMap[today]) : 0;

  return { monthTotal, today: todaySpend, daily, bySource };
}
