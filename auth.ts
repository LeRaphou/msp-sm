// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { Pool } from "pg"
import bcrypt from "bcrypt"
import { authConfig } from "./auth.config"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const result = await pool.query(
          `SELECT * FROM users WHERE email = $1`,
          [email]
        )

        const user = result.rows[0]
        if (!user) {
          return null
        }

        const passwordValid = await bcrypt.compare(password, user.password_hash)
        if (!passwordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role, 
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})