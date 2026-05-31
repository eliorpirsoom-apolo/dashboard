# פריסה ל-Vercel (דרך GitHub)

Next.js רץ על Vercel **ללא קובץ קונפיגורציה** — Vercel מזהה את הפרויקט אוטומטית. אין צורך ב-`vercel.json`.

## צעד אחר צעד

1. היכנס ל-**[vercel.com](https://vercel.com)** והתחבר עם חשבון ה-**GitHub** שלך.
2. **Add New → Project** ובחר **Import** על ה-repo `eliorpirsoom-apolo/dashboard`.
3. Vercel יזהה אוטומטית **Next.js** — אל תשנה את הגדרות ה-Build.
4. **Production Branch:** ב-*Settings → Git* קבע את ענף הפרודקשן ל-`claude/tender-gauss-djkL8`
   (או מזג קודם ל-`main`). Vercel יפרוס את הענף הזה.
5. הוסף משתנה סביבה (ראה טבלה למטה) — לפחות `AUTH_SECRET`.
6. **Deploy**. בסיום תקבל כתובת ציבורית (למשל `https://dashboard-xxxx.vercel.app`).
7. היכנס לכתובת ולחץ **"כניסת דמו"** — וזהו, אתה רואה את הדשבורד באוויר. 🎉

## משתני סביבה ב-Vercel

| משתנה | חובה? | ערך / הערה |
|-------|-------|------------|
| `AUTH_SECRET` | ✅ חובה | `KZjOxjSXHb3si+BxHXoMSt2BU3jRVQaX8RrIzNdf9B1V` (או צור חדש: `npx auth secret`) |
| `MONDAY_API_TOKEN` | אופציונלי | טוקן מ-Monday → Developers → My Access Tokens. בלי זה — נתוני דמו במשימות ובלידים |
| `MONDAY_BOARD_ID` | אופציונלי | `2072697123` (לוח המשימות "ניהול תיקי לקוחות") |
| `MONDAY_LEADS_BOARD_ID` | אופציונלי | `6623135619` (לוח הלידים "כניסת לקוחות חדשים") |
| `WINDSOR_API_KEY` | אופציונלי | מפתח מ-Windsor.ai → Account → API. בלי זה — תקציב מדיה דמו |
| `WINDSOR_CONNECTORS` | אופציונלי | `facebook` (להוספת גוגל בעתיד: `facebook,google_ads`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | אופציונלי | להפעלת כניסת Google |
| `AUTH_MICROSOFT_ENTRA_ID_ID` / `_SECRET` / `_ISSUER` | אופציונלי | להפעלת כניסת Microsoft |

> **שים לב:**
> - `AUTH_URL` **לא** נדרש ב-Vercel — מזוהה אוטומטית (יחד עם `trustHost: true` שכבר בקוד).
> - **כניסת דמו** נדלקת אוטומטית בפרודקשן כל עוד לא הגדרת providers של Google/Microsoft, כדי שתוכל לראות מיד.
> - ברגע שתגדיר SSO, הוסף אצל הספק את כתובות ה-callback:
>   `https://<DOMAIN>/api/auth/callback/google` ו-`.../microsoft-entra-id`.

## אחרי הפריסה

- כל push לענף הפרודקשן יפרוס אוטומטית מחדש.
- נתוני Monday החיים יעבדו בפרודקשן (לרשת של Vercel יש יציאה פתוחה, בניגוד לסביבת הפיתוח המבודדת).
