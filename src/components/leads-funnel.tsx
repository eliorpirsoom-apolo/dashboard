// צבעי הסטטוסים תואמים ללוח "כניסת לקוחות חדשים" ב-Monday
const STATUS_COLORS: Record<string, string> = {
  "הצעת מחיר בהכנה": "#9cd326",
  "הצעת מחיר נשלחה": "#fdab3d",
  "נשלח ללקוח תוכנית": "#784bd1",
  "הצעה חזרה חתומה": "#037f4c",
  "נכנס לעבודה": "#216edf",
  "העבודה בוטלה": "#bb3354",
};

export function LeadsFunnel({
  funnel,
}: {
  funnel: { status: string; count: number }[];
}) {
  const max = Math.max(1, ...funnel.map((f) => f.count));

  return (
    <div className="space-y-3">
      {funnel.map((row) => (
        <div key={row.status}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>{row.status}</span>
            <span className="font-semibold">{row.count}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-accent">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(row.count / max) * 100}%`,
                background: STATUS_COLORS[row.status] ?? "var(--primary)",
              }}
            />
          </div>
        </div>
      ))}
      {funnel.length === 0 && (
        <p className="py-4 text-center text-sm text-muted">אין נתוני לידים</p>
      )}
    </div>
  );
}
