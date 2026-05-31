import NextAuth from "next-auth";
import { authConfig } from "@/auth";

// מגן על כל הנתיבים מלבד נכסים סטטיים ו-API של האימות
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
