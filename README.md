# דשבורד לקוחות

פורטל לקוחות לחברה — בנוי ב‑**Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** ו‑**Auth.js (NextAuth v5)** עם תמיכה מלאה ב‑RTL ועברית.

## מה כולל הדשבורד

| תחום | נתיב | תיאור |
|------|------|-------|
| סקירה ואנליטיקס | `/dashboard` | מדדי KPI, גרף הכנסות מול יעד, מקורות תנועה |
| הזמנות וחשבון | `/orders` | טבלת חשבוניות והזמנות עם סטטוסים |
| פרויקטים ומשימות | `/projects` | לוח משימות (Kanban) לפי סטטוס |
| הגדרות | `/settings` | פרטי חשבון והעדפות התראות |

> **שלב נוכחי:** כל הנתונים הם נתוני דמו מתוך `src/lib/mock-data.ts`. החיבור למקורות אמיתיים (Monday.com, Windsor.ai לאנליטיקס, בסיס נתונים) הוא השלב הבא.

## הרצה מקומית

```bash
npm install
npm run dev
```

האפליקציה תרוץ ב‑http://localhost:3000. בלי הגדרת SSO היא עולה עם **כניסת דמו** כדי שתוכל לראות הכול מיד.

## הגדרת אימות (SSO)

האימות מוגדר ב‑`src/auth.ts` ונבנה דינמית לפי משתני הסביבה:

1. העתק את `.env.example` ל‑`.env.local`.
2. צור secret: `npx auth secret`.
3. מלא את פרטי **Google** ו/או **Microsoft Entra ID** (ראה הערות בקובץ).

ה‑providers מופיעים אוטומטית במסך הכניסה ברגע שהמשתנים שלהם מוגדרים. כניסת הדמו פעילה רק בפיתוח או כשאין providers אמיתיים.

כתובות ה‑callback להגדרה אצל הספק:
- Google / Microsoft: `https://<DOMAIN>/api/auth/callback/<provider>`

## מבנה הפרויקט

```
src/
├── auth.ts                 # הגדרת Auth.js (providers, callbacks)
├── proxy.ts                # הגנת נתיבים (לשעבר middleware)
├── app/
│   ├── (app)/              # אזור מחובר: layout עם sidebar + topbar
│   │   ├── dashboard/      # אנליטיקס
│   │   ├── orders/         # הזמנות
│   │   ├── projects/       # משימות
│   │   └── settings/       # הגדרות
│   ├── login/              # מסך כניסה
│   └── api/auth/[...nextauth]/
├── components/             # sidebar, topbar, stat-card, charts/
└── lib/mock-data.ts        # נתוני דמו
```

## הצעדים הבאים

- חיבור נתונים אמיתיים (Monday.com למשימות, Windsor.ai/GA4 לאנליטיקס).
- בסיס נתונים (Postgres/Prisma) ובידוד נתונים לפי לקוח (multi-tenant).
- מצב כהה (dark mode) ותפריט נייד.
- בדיקות (Vitest / Playwright).
