"use client";

import { useState } from "react";

type Props = {
  date: string;
  onSubmit: (title: string) => void;
  onClose: () => void;
};

export default function ReservationForm({ date, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState("");

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Réserver pour le</p>
          <p className="text-xl font-semibold text-slate-900">{date}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
        >
          Fermer
        </button>
      </div>

      <label className="mt-6 block text-sm font-medium text-slate-700">
        Nom de la réservation
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
        placeholder="Ex: Rendez-vous infirmier"
      />

      <button
        onClick={() => {
          if (title.trim()) onSubmit(title.trim());
        }}
        className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Confirmer
      </button>
    </div>
  );
}