// נתוני דמו לדשבורד. בשלב הבא יוחלפו בנתונים אמיתיים
// ממקורות כמו Monday.com, Windsor.ai (אנליטיקס) ובסיס נתונים.

export type Kpi = {
  key: string;
  label: string;
  value: string;
  change: number; // אחוז שינוי מול התקופה הקודמת
};

export const kpis: Kpi[] = [
  { key: "revenue", label: "הכנסות החודש", value: "₪284,500", change: 12.4 },
  { key: "orders", label: "הזמנות פעילות", value: "1,284", change: 8.1 },
  { key: "users", label: "משתמשים פעילים", value: "9,432", change: -2.3 },
  { key: "conversion", label: "אחוז המרה", value: "3.8%", change: 0.6 },
];

export type RevenuePoint = { month: string; revenue: number; target: number };

export const revenueByMonth: RevenuePoint[] = [
  { month: "ינו", revenue: 182000, target: 170000 },
  { month: "פבר", revenue: 198000, target: 185000 },
  { month: "מרץ", revenue: 215000, target: 200000 },
  { month: "אפר", revenue: 234000, target: 220000 },
  { month: "מאי", revenue: 284500, target: 250000 },
];

export type TrafficSource = { name: string; value: number };

export const trafficSources: TrafficSource[] = [
  { name: "חיפוש אורגני", value: 4200 },
  { name: "מודעות ממומנות", value: 2800 },
  { name: "רשתות חברתיות", value: 1500 },
  { name: "ישיר", value: 932 },
];

export type Order = {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "שולם" | "ממתין" | "בוטל";
};

export const orders: Order[] = [
  { id: "INV-2041", customer: "טכנולוגיות אלפא בע״מ", date: "2026-05-28", amount: "₪12,400", status: "שולם" },
  { id: "INV-2040", customer: "מדיה בית", date: "2026-05-27", amount: "₪3,200", status: "ממתין" },
  { id: "INV-2039", customer: "סטארט-אפ נובה", date: "2026-05-25", amount: "₪8,750", status: "שולם" },
  { id: "INV-2038", customer: "קבוצת הראל", date: "2026-05-22", amount: "₪21,000", status: "שולם" },
  { id: "INV-2037", customer: "דיגיטל פלוס", date: "2026-05-20", amount: "₪1,950", status: "בוטל" },
  { id: "INV-2036", customer: "מעבדות גרין", date: "2026-05-18", amount: "₪6,300", status: "ממתין" },
];

export type Task = {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: "לביצוע" | "בתהליך" | "הושלם";
};

export const tasks: Task[] = [
  { id: "T-1", title: "אפיון מסך הזמנות", owner: "דנה לוי", due: "2026-06-03", status: "בתהליך" },
  { id: "T-2", title: "חיבור Google Analytics", owner: "יוסי כהן", due: "2026-06-05", status: "לביצוע" },
  { id: "T-3", title: "עיצוב לוגו חדש", owner: "מאיה בר", due: "2026-05-30", status: "הושלם" },
  { id: "T-4", title: "בדיקות QA לגרסה 2.1", owner: "אבי נחום", due: "2026-06-08", status: "לביצוע" },
  { id: "T-5", title: "כתיבת תיעוד API", owner: "דנה לוי", due: "2026-06-02", status: "בתהליך" },
  { id: "T-6", title: "פגישת אפיון עם הלקוח", owner: "יוסי כהן", due: "2026-05-29", status: "הושלם" },
];

export const taskColumns: { status: Task["status"]; color: string }[] = [
  { status: "לביצוע", color: "var(--muted)" },
  { status: "בתהליך", color: "var(--warning)" },
  { status: "הושלם", color: "var(--success)" },
];
