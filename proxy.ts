import NextAuth from "next-auth"
import { authConfig } from "./app/api/auth/auth.config"

export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/dashboard/:path*" ],
}