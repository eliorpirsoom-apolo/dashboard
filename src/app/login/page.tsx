import { signIn } from "@/auth";

export default function LoginPage() {
  const hasGoogle = !!process.env.AUTH_GOOGLE_ID;
  const hasMicrosoft = !!process.env.AUTH_MICROSOFT_ENTRA_ID_ID;
  const showDemo = process.env.NODE_ENV !== "production" || (!hasGoogle && !hasMicrosoft);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            ד
          </div>
          <h1 className="text-2xl font-bold">דשבורד לקוחות</h1>
          <p className="text-muted">התחבר כדי להמשיך לפורטל</p>
        </div>

        <div className="space-y-3">
          {hasGoogle && (
            <ProviderButton provider="google" label="התחברות עם Google" />
          )}
          {hasMicrosoft && (
            <ProviderButton
              provider="microsoft-entra-id"
              label="התחברות עם Microsoft"
            />
          )}

          {showDemo && (
            <>
              {(hasGoogle || hasMicrosoft) && (
                <div className="flex items-center gap-3 py-2 text-xs text-muted">
                  <span className="h-px flex-1 bg-border" />
                  או
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}
              <form
                action={async () => {
                  "use server";
                  await signIn("demo", { redirectTo: "/dashboard" });
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  כניסת דמו (ללא הגדרת SSO)
                </button>
              </form>
            </>
          )}
        </div>

        {!hasGoogle && !hasMicrosoft && (
          <p className="mt-6 text-center text-xs text-muted">
            כדי להפעיל SSO אמיתי, הגדר את משתני הסביבה של Google / Microsoft
            בקובץ <code className="rounded bg-accent px-1">.env.local</code>
          </p>
        )}
      </div>
    </div>
  );
}

function ProviderButton({
  provider,
  label,
}: {
  provider: string;
  label: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider, { redirectTo: "/dashboard" });
      }}
    >
      <button
        type="submit"
        className="w-full rounded-lg border bg-background px-4 py-2.5 font-medium transition-colors hover:bg-accent"
      >
        {label}
      </button>
    </form>
  );
}
