import { auth } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">הגדרות</h1>
        <p className="text-muted">ניהול פרטי החשבון וההעדפות שלך</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <section className="rounded-xl border bg-surface p-6">
          <h2 className="mb-4 font-semibold">פרטי חשבון</h2>
          <div className="space-y-4">
            <Field label="שם מלא" defaultValue={user?.name ?? ""} />
            <Field label="אימייל" defaultValue={user?.email ?? ""} type="email" />
            <Field label="חברה" defaultValue="" placeholder="שם החברה" />
          </div>
        </section>

        <section className="rounded-xl border bg-surface p-6">
          <h2 className="mb-4 font-semibold">התראות</h2>
          <div className="space-y-3">
            <Toggle label="התראות אימייל על הזמנות חדשות" defaultChecked />
            <Toggle label="סיכום שבועי של ביצועים" defaultChecked />
            <Toggle label="עדכוני מערכת ותחזוקה" />
          </div>
        </section>

        <button className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90">
          שמירת שינויים
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function Toggle({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-5 w-5 accent-[var(--primary)]"
      />
    </label>
  );
}
