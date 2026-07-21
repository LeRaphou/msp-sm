// app/register/page.tsx
"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser } from "@/app/actions/register"

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<"patient" | "pro">("patient")
  const [message, formAction, isPending] = useActionState(
    registerUser,
    undefined
  )

  useEffect(() => {
    if (message === "success") {
      router.push("/login")
    }
  }, [message, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Créer un compte</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quelques infos pour commencer.
          </p>

          {/* Choix du rôle */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                role === "patient"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              Je suis patient
            </button>
            <button
              type="button"
              onClick={() => setRole("pro")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                role === "pro"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              Je suis professionnel
            </button>
          </div>

          <form action={formAction} className="mt-6 space-y-4">
            {/* Champ caché pour transmettre le rôle */}
            <input type="hidden" name="role" value={role} />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Ton nom"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="toi@exemple.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="8 caractères minimum"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Champs spécifiques professionnel */}
            {role === "pro" && (
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Spécialité
                </label>
                <input
                  id="specialty"
                  name="specialty"
                  type="text"
                  required
                  placeholder="Ex: Kinésithérapeute"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            )}

            {/* Champs spécifiques patient */}
            {role === "patient" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Âge
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min={0}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Genre
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      <option value="">--</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    placeholder="12 rue de la Paix, 75002 Paris"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="num_secu_social" className="block text-sm font-medium text-gray-700">
                    Numéro de sécurité sociale
                  </label>
                  <input
                    id="num_secu_social"
                    name="num_secu_social"
                    type="text"
                    placeholder="1 23 45 67 890 123 45"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </>
            )}

            {message && message !== "success" && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-medium text-gray-900 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}