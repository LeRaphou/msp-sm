// app/actions/register.ts
"use server"

import { Pool } from "pg"
import bcrypt from "bcrypt"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function registerUser(
  prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string 
  const phoneNumber = formData.get("phone_number") as string

  const specialty = formData.get("specialty") as string | null
  const age = formData.get("age") as string | null
  const gender = formData.get("gender") as string | null
  const address = formData.get("address") as string | null
  const numSecuSocial = formData.get("num_secu_social") as string | null

  if (!email || !password || !name) {
    return "Nom, email et mot de passe requis."
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const existing = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    )
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK")
      return "Un compte existe déjà avec cet email."
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id`,
      [email, passwordHash, role]
    )
    const userId = userResult.rows[0].id

    if (role === "pro") {
      await client.query(
        `INSERT INTO professionals (user_id, name, specialty, phone_number, email)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, name, specialty, phoneNumber, email]
      )
    } else {
      await client.query(
        `INSERT INTO patients (user_id, name, age, gender, address, phone_number, email, num_secu_social)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, name, age, gender, address, phoneNumber, email, numSecuSocial]
      )
    }

    await client.query("COMMIT")
    return "success"
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Erreur registerUser:", error)
    return "Une erreur est survenue. Réessaie dans quelques instants."
  } finally {
    client.release()
  }
}