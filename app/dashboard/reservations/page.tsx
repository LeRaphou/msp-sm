"use client";

import ReservationForm from "@/app/components/ReservationForm";

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-semibold">Nouvelle réservation</h1>
          <p className="text-sm text-slate-500">
            Choisis le patient, le professionnel et la salle, puis renseigne les horaires.
          </p>
        </div>
        <ReservationForm />
      </div>
    </main>
  );
}
