import { isMondayConfigured, fetchTasks } from "@/lib/monday";
import {
  tasks as mockTasks,
  taskColumns,
  importanceColors,
  type Task,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let tasks: Task[] = mockTasks;
  let source: "monday" | "demo" = "demo";
  let error: string | null = null;

  if (isMondayConfigured()) {
    try {
      tasks = await fetchTasks();
      source = "monday";
    } catch (e) {
      error = e instanceof Error ? e.message : "שגיאה לא ידועה";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">פרויקטים ומשימות</h1>
          <p className="text-muted">מעקב אחר התקדמות המשימות בפרויקט</p>
        </div>
        <SourceBadge source={source} />
      </div>

      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          לא ניתן היה למשוך נתונים מ-Monday ({error}). מוצגים נתוני דמו.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {taskColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="rounded-xl border bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: col.color }}
                />
                <h2 className="font-semibold">{col.status}</h2>
                <span className="mr-auto text-sm text-muted">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border bg-background p-3"
                  >
                    <p className="font-medium leading-snug">{task.title}</p>
                    {task.importance && (
                      <span
                        className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{
                          background:
                            importanceColors[task.importance] ?? "var(--muted)",
                        }}
                      >
                        {task.importance}
                      </span>
                    )}
                    <div className="mt-2 flex items-center justify-between text-xs text-muted">
                      <span>{task.owner}</span>
                      {task.due && <span>יעד: {task.due}</span>}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted">אין משימות</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: "monday" | "demo" }) {
  const isLive = source === "monday";
  return (
    <span
      className={
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium " +
        (isLive
          ? "bg-green-100 text-green-700"
          : "bg-slate-100 text-slate-600")
      }
    >
      <span
        className={
          "h-2 w-2 rounded-full " + (isLive ? "bg-green-500" : "bg-slate-400")
        }
      />
      {isLive ? "מחובר ל-Monday" : "נתוני דמו"}
    </span>
  );
}
