"use client";

import { type FormEvent, useEffect, useState } from "react";

type Item = { id: number; name: string };

type PatientPayload = {
  name: string;
  age: number;
  gender: string;
  address: string;
  phone_number: string;
  email: string;
  num_secu_social: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  selectedDate?: string | null;
  onSuccess?: () => void;
};

export default function ReservationForm({
  title = "Nouvelle réservation",
  subtitle = "Choisis le patient, le professionnel et la salle, puis renseigne les horaires.",
  compact = false,
  selectedDate = null,
  onSuccess,
}: Props) {
  const [patients, setPatients] = useState<Item[]>([]);
  const [professionals, setProfessionals] = useState<Item[]>([]);
  const [salles, setSalles] = useState<Item[]>([]);
  const [patientId, setPatientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [salleId, setSalleId] = useState("");
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [message, setMessage] = useState("");
  const [creatingPatient, setCreatingPatient] = useState(false);
  const [newPatient, setNewPatient] = useState<PatientPayload>({
    name: "",
    age: 0,
    gender: "",
    address: "",
    phone_number: "",
    email: "",
    num_secu_social: "",
  });

  const isPlanningMode = Boolean(selectedDate);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((rows: Item[]) => setPatients(rows))
      .catch(() => setPatients([]));

    fetch("/api/professionals")
      .then((res) => res.json())
      .then((rows: Item[]) => setProfessionals(rows))
      .catch(() => setProfessionals([]));

    fetch("/api/salles")
      .then((res) => res.json())
      .then((rows: Item[]) => setSalles(rows))
      .catch(() => setSalles([]));
  }, []);

  const handlePatientCreate = async () => {
    setMessage("");

    if (
      !newPatient.name ||
      !newPatient.age ||
      !newPatient.gender ||
      !newPatient.address ||
      !newPatient.phone_number ||
      !newPatient.email ||
      !newPatient.num_secu_social
    ) {
      setMessage("Veuillez remplir tous les champs du patient.");
      return;
    }

    const response = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPatient),
    });

    if (!response.ok) {
      const error = await response.json();
      setMessage(error.error || "Impossible de créer le patient.");
      return;
    }

    const created = await response.json();
    setPatients((current) => [...current, created]);
    setPatientId(String(created.id));
    setCreatingPatient(false);
    setNewPatient({
      name: "",
      age: 0,
      gender: "",
      address: "",
      phone_number: "",
      email: "",
      num_secu_social: "",
    });
    setMessage("Patient créé avec succès.");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!patientId || !professionalId || !salleId || !startValue || !endValue) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    const payload = {
      patient_id: Number(patientId),
      professional_id: Number(professionalId),
      salle_id: Number(salleId),
      start_at:
        isPlanningMode && selectedDate
          ? `${selectedDate}T${startValue}:00`
          : startValue,
      end_at:
        isPlanningMode && selectedDate
          ? `${selectedDate}T${endValue}:00`
          : endValue,
    };

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setMessage("Réservation enregistrée !");
      setPatientId("");
      setProfessionalId("");
      setSalleId("");
      setStartValue("");
      setEndValue("");
      onSuccess?.();
    } else {
      const text = await response.text();
      let errorMessage = "Erreur lors de l'enregistrement.";

      if (text) {
        try {
          const parsed = JSON.parse(text);
          errorMessage = parsed?.error || errorMessage;
        } catch {
          errorMessage = text;
        }
      }

      setMessage(errorMessage);
    }
  };

  return (
    <section className={compact ? "rounded-[20px] border border-slate-200 bg-white p-4" : "rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"}>
      {!compact && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      )}

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.includes("Réservation enregistrée") ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Patient</label>
            <select
              value={creatingPatient ? "new" : patientId}
              onChange={(e) => {
                if (e.target.value === "new") {
                  setCreatingPatient(true);
                  setPatientId("");
                } else {
                  setCreatingPatient(false);
                  setPatientId(e.target.value);
                }
              }}
              className="mt-2 w-full rounded border px-3 py-2"
            >
              <option value="">Sélectionner un patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
              <option value="new">Créer un nouveau patient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Professionnel</label>
            <select
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
              className="mt-2 w-full rounded border px-3 py-2"
            >
              <option value="">Sélectionner un professionnel</option>
              {professionals.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Salle</label>
          <select
            value={salleId}
            onChange={(e) => setSalleId(e.target.value)}
            className="mt-2 w-full rounded border px-3 py-2"
          >
            <option value="">Sélectionner une salle</option>
            {salles.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        {creatingPatient && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-black">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Créer un patient</h2>
              <button
                type="button"
                onClick={() => setCreatingPatient(false)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm"
              >
                Annuler
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={newPatient.name}
                onChange={(e) => setNewPatient((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du patient"
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="number"
                value={newPatient.age}
                onChange={(e) => setNewPatient((prev) => ({ ...prev, age: Number(e.target.value) }))}
                placeholder="Âge"
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="text"
                value={newPatient.gender}
                onChange={(e) => setNewPatient((prev) => ({ ...prev, gender: e.target.value }))}
                placeholder="Genre"
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="text"
                value={newPatient.address}
                onChange={(e) => setNewPatient((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse"
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="tel"
                value={newPatient.phone_number}
                onChange={(e) => setNewPatient((prev) => ({ ...prev, phone_number: e.target.value }))}
                placeholder="Téléphone"
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="text"
                value={newPatient.num_secu_social}
                onChange={(e) => setNewPatient((prev) => ({ ...prev, num_secu_social: e.target.value }))}
                placeholder="Numéro de sécurité sociale"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <button
              type="button"
              onClick={handlePatientCreate}
              className="mt-4 rounded bg-slate-900 px-4 py-2 text-white"
            >
              Créer le patient
            </button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700">Début</span>
            <input
              type={isPlanningMode ? "time" : "datetime-local"}
              value={startValue}
              onChange={(e) => setStartValue(e.target.value)}
              className="mt-2 w-full rounded border px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-slate-700">Fin</span>
            <input
              type={isPlanningMode ? "time" : "datetime-local"}
              value={endValue}
              onChange={(e) => setEndValue(e.target.value)}
              className="mt-2 w-full rounded border px-3 py-2"
              required
            />
          </label>
        </div>

        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">
          Envoyer
        </button>
      </form>
    </section>
  );
}
