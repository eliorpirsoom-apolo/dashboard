// נתוני דמו לדשבורד. בשלב הבא יוחלפו בנתונים אמיתיים
// ממקורות כמו Monday.com, Windsor.ai (אנליטיקס) ובסיס נתונים.

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

// הסטטוסים והחשיבות תואמים ללוח Monday "ניהול תיקי לקוחות".
export type Task = {
  id: string;
  title: string;
  owner: string;
  due: string | null;
  importance: string | null;
  status: string;
};

export const tasks: Task[] = [
  { id: "T-1", title: "אפיון מסך הזמנות", owner: "דנה לוי", due: "2026-06-03", importance: "בינוני", status: "בעבודה" },
  { id: "T-2", title: "חיבור Google Analytics", owner: "יוסי כהן", due: "2026-06-05", importance: "חשוב מאוד", status: "לא התחיל" },
  { id: "T-3", title: "עיצוב לוגו חדש", owner: "מאיה בר", due: "2026-05-30", importance: "קל", status: "הושלם" },
  { id: "T-4", title: "בדיקות QA לגרסה 2.1", owner: "אבי נחום", due: "2026-06-08", importance: "בינוני", status: "מחכה לאישור" },
  { id: "T-5", title: "כתיבת תיעוד API", owner: "דנה לוי", due: "2026-06-02", importance: null, status: "בעבודה" },
  { id: "T-6", title: "פגישת אפיון עם הלקוח", owner: "יוסי כהן", due: "2026-05-29", importance: "קל", status: "בהמתנה" },
];

// סדר וצבעים תואמים לתוויות הסטטוס ב-Monday
export const taskColumns: { status: string; color: string }[] = [
  { status: "לא התחיל", color: "#e2445c" },
  { status: "בעבודה", color: "#a25ddc" },
  { status: "מחכה לאישור", color: "#579bfc" },
  { status: "בהמתנה", color: "#fdab3d" },
  { status: "הושלם", color: "#00c875" },
];

// צבעי תווית החשיבות (status4) ב-Monday
export const importanceColors: Record<string, string> = {
  קל: "#00c875",
  בינוני: "#fdab3d",
  "חשוב מאוד": "#e2445c",
};

// ===== נתוני דמו לעמוד הסקירה (לידים + תקציב מדיה) =====

export const demoLeadStats = {
  leadsToday: 4,
  leadsThisMonth: 37,
  closuresThisMonth: 11,
  funnel: [
    { status: "הצעת מחיר נשלחה", count: 18 },
    { status: "נשלח ללקוח תוכנית", count: 6 },
    { status: "הצעה חזרה חתומה", count: 9 },
    { status: "נכנס לעבודה", count: 12 },
    { status: "העבודה בוטלה", count: 3 },
  ],
};

export const demoMediaSpend = {
  monthTotal: 1984,
  today: 84,
  bySource: [{ source: "פייסבוק (Meta)", spend: 1984 }],
  daily: [
    { date: "2026-05-01", spend: 30 },
    { date: "2026-05-05", spend: 36 },
    { date: "2026-05-10", spend: 51 },
    { date: "2026-05-15", spend: 53 },
    { date: "2026-05-20", spend: 94 },
    { date: "2026-05-25", spend: 104 },
    { date: "2026-05-31", spend: 84 },
  ],
};
