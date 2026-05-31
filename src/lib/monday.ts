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

export type MondayColumnValue = {
  id: string;
  text: string | null;
  type: string;
  value: string | null;
};

export type MondayItem = {
  id: string;
  name: string;
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

/** מושך את ה-items מהלוח המוגדר ב-MONDAY_BOARD_ID. */
export async function fetchBoardItems(limit = 100): Promise<MondayItem[]> {
  const query = `
    query ($boardId: [ID!], $limit: Int!) {
      boards(ids: $boardId) {
        items_page(limit: $limit) {
          items {
            id
            name
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
    boardId: [process.env.MONDAY_BOARD_ID],
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
  const items = await fetchBoardItems(200);
  const withStatus = items.filter((it) => columnText(it, COLUMN_IDS.status));
  return withStatus.slice(0, limit).map(mapItemToTask);
}
