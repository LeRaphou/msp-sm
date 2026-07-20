'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");


    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });


    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }


    router.push("/dashboard");
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Connexion
        </h1>


        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="block text-sm mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full border rounded-lg p-2"
              required
            />
          </div>



          <div>
            <label className="block text-sm mb-1">
              Mot de passe
            </label>

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="********"
              className="w-full border rounded-lg p-2"
              required
            />
          </div>



          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg p-2"
          >
            {
              loading 
              ? "Connexion..."
              : "Se connecter"
            }
          </button>


        </form>

      </div>

    </main>
  );
}