// קליינט צד-שרת ל-Monday.com GraphQL API.
// משמש את האפליקציה הפרוסה (להבדיל מכלי ה-MCP שמשמשים בפיתוח).
// דורש את משתני הסביבה: MONDAY_API_TOKEN, MONDAY_BOARD_ID.

import type { Task } from "@/lib/mock-data";

const MONDAY_API_URL = "https://api.monday.com/v2";

// מיפוי מזהי העמודות בלוח "ניהול תיקי לקוחות" (board 2072697123).
// אם מחברים לוח אחר — יש להתאים את המזהים כאן.
const COLUMN_IDS = {
  status: "status", // סטטוס
  importance: "status4", // חשיבות
  owner: "person", // נותן המשימה
  due: "date", // דד ליין
} as const;

// לוח הלידים "כניסת לקוחות חדשים" (ברירת מחדל). ניתן לעקוף ב-MONDAY_LEADS_BOARD_ID.
const LEADS_BOARD_ID = "6623135619";
const LEAD_STATUS_COLUMN = "status";
// סטטוסים שנחשבים "סגירה" (לפי בחירת הלקוח)
const CLOSURE_STATUSES = ["נכנס לעבודה", "הצעה חזרה חתומה"];
// סדר ה-funnel להצגה
const LEAD_FUNNEL_ORDER = [
  "הצעת מחיר בהכנה",
  "הצעת מחיר נשלחה",
  "נשלח ללקוח תוכנית",
  "הצעה חזרה חתומה",
  "נכנס לעבודה",
  "העבודה בוטלה",
];

export type MondayColumnValue = {
  id: string;
  text: string | null;
  type: string;
  value: string | null;
};

export type MondayItem = {
  id: string;
  name: string;
  created_at?: string;
  column_values: MondayColumnValue[];
};

type MondayItemsResponse = {
  data?: {
    boards?: {
      items_page?: {
        items?: MondayItem[];
      };
    }[];
  };
  errors?: { message: string }[];
};

export function isMondayConfigured(): boolean {
  return !!(process.env.MONDAY_API_TOKEN && process.env.MONDAY_BOARD_ID);
}

// לוח הלידים דורש רק טוקן (מזהה הלוח עם ברירת מחדל)
export function isLeadsConfigured(): boolean {
  return !!process.env.MONDAY_API_TOKEN;
}

async function mondayQuery<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.MONDAY_API_TOKEN ?? "",
      "API-Version": "2024-10",
    },
    body: JSON.stringify({ query, variables }),
    // נתוני משימות משתנים — מרעננים כל 60 שניות
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Monday API HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/** מושך items מלוח נתון (ברירת מחדל: MONDAY_BOARD_ID). */
export async function fetchBoardItems(
  boardId = process.env.MONDAY_BOARD_ID,
  limit = 100,
): Promise<MondayItem[]> {
  const query = `
    query ($boardId: [ID!], $limit: Int!) {
      boards(ids: $boardId) {
        items_page(limit: $limit) {
          items {
            id
            name
            created_at
            column_values {
              id
              text
              type
              value
            }
          }
        }
      }
    }
  `;

  const data = await mondayQuery<MondayItemsResponse>(query, {
    boardId: [boardId],
    limit,
  });

  if (data.errors?.length) {
    throw new Error(`Monday API: ${data.errors.map((e) => e.message).join("; ")}`);
  }

  return data.data?.boards?.[0]?.items_page?.items ?? [];
}

function columnText(item: MondayItem, columnId: string): string | null {
  const text = item.column_values.find((c) => c.id === columnId)?.text;
  return text && text.trim().length > 0 ? text : null;
}

/** ממיר item של Monday למבנה ה-Task של הדשבורד. */
export function mapItemToTask(item: MondayItem): Task {
  return {
    id: item.id,
    title: item.name,
    owner: columnText(item, COLUMN_IDS.owner) ?? "—",
    status: columnText(item, COLUMN_IDS.status) ?? "לא התחיל",
    importance: columnText(item, COLUMN_IDS.importance),
    due: columnText(item, COLUMN_IDS.due),
  };
}

/**
 * מושך את משימות הלוח וממפה אותן למבנה הדשבורד.
 * מסנן items ללא סטטוס (שורות ריקות בלוח) ומחזיר את העדכניות ביותר.
 */
export async function fetchTasks(limit = 60): Promise<Task[]> {
  const items = await fetchBoardItems(process.env.MONDAY_BOARD_ID, 200);
  const withStatus = items.filter((it) => columnText(it, COLUMN_IDS.status));
  return withStatus.slice(0, limit).map(mapItemToTask);
}

// ===== לידים (לוח "כניסת לקוחות חדשים") =====

export type LeadStats = {
  leadsToday: number;
  leadsThisMonth: number;
  closuresThisMonth: number;
  funnel: { status: string; count: number }[];
};

// מחזיר YYYY-MM-DD לפי אזור הזמן של ישראל
function ymd(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * מחשב סטטיסטיקת לידים מלוח הלידים.
 * הספירה לפי created_at (תאריך היצירה ב-Monday), מאחר שעמודת התאריך אינה מאוכלסת.
 */
export async function fetchLeadStats(): Promise<LeadStats> {
  const boardId = process.env.MONDAY_LEADS_BOARD_ID || LEADS_BOARD_ID;
  const items = await fetchBoardItems(boardId, 500);

  const todayStr = ymd(new Date());
  const monthStr = todayStr.slice(0, 7); // YYYY-MM

  let leadsToday = 0;
  let leadsThisMonth = 0;
  let closuresThisMonth = 0;
  const funnelCounts: Record<string, number> = {};

  for (const item of items) {
    const status = columnText(item, LEAD_STATUS_COLUMN);
    if (status) funnelCounts[status] = (funnelCounts[status] ?? 0) + 1;

    if (!item.created_at) continue;
    const created = ymd(new Date(item.created_at));
    if (created === todayStr) leadsToday++;
    if (created.startsWith(monthStr)) {
      leadsThisMonth++;
      if (status && CLOSURE_STATUSES.includes(status)) closuresThisMonth++;
    }
  }

  const funnel = LEAD_FUNNEL_ORDER.filter((s) => funnelCounts[s]).map((status) => ({
    status,
    count: funnelCounts[status],
  }));

  return { leadsToday, leadsThisMonth, closuresThisMonth, funnel };
}
