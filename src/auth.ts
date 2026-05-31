import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";

/**
 * רשימת ה-providers נבנית דינמית לפי משתני הסביבה הקיימים.
 * כך האפליקציה רצה מיד גם ללא הגדרת OAuth (דרך כניסת דמו),
 * וברגע שמגדירים את משתני ה-Google / Microsoft הם מופיעים אוטומטית.
 */
const providers: NextAuthConfig["providers"] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (
  process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
  process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  );
}

// כניסת דמו — פעילה רק בפיתוח או כשאין providers אמיתיים מוגדרים.
// מאפשרת לראות את הדשבורד מיד. בייצור עם SSO אמיתי — להסיר.
if (process.env.NODE_ENV !== "production" || providers.length === 0) {
  providers.push(
    Credentials({
      id: "demo",
      name: "כניסת דמו",
      credentials: {
        email: { label: "אימייל", type: "email" },
      },
      authorize: async (credentials) => {
        const email =
          (credentials?.email as string) || "demo@company.co.il";
        return {
          id: "demo-user",
          name: "לקוח לדוגמה",
          email,
          image: null,
        };
      },
    }),
  );
}

export const authConfig: NextAuthConfig = {
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      if (isOnLogin) {
        // משתמש מחובר שמגיע ל-login — מפנים לדשבורד
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      // כל שאר העמודים דורשים התחברות
      return isLoggedIn;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
