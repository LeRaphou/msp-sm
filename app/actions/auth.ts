"use server"

import { signIn } from "@/app/api/auth/auth"
import { AuthError } from "next-auth"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return "Email ou mot de passe incorrect."
    }
    throw error
  }
}