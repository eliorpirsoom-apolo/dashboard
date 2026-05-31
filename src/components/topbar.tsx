import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

export async function Topbar() {
  const session = await auth();
  const user = session?.user;
  const initial = user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? "?";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-surface px-6">
      <div>
        <p className="text-sm text-muted">שלום,</p>
        <p className="font-semibold leading-tight">
          {user?.name ?? user?.email ?? "אורח"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold text-primary">
          {initial}
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            התנתקות
          </button>
        </form>
      </div>
    </header>
  );
}
