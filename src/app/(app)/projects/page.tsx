import { tasks, taskColumns } from "@/lib/mock-data";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">פרויקטים ומשימות</h1>
        <p className="text-muted">מעקב אחר התקדמות המשימות בפרויקט</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                    <p className="font-medium">{task.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted">
                      <span>{task.owner}</span>
                      <span>יעד: {task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
