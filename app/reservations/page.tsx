"use client";

import { useEffect, useState } from "react";

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

export default function ReservationPage() {
  const [patients, setPatients] = useState<Item[]>([]);
  const [professionals, setProfessionals] = useState<Item[]>([]);
  const [salles, setSalles] = useState<Item[]>([]);
  const [patientId, setPatientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [salleId, setSalleId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then(setPatients)
      .catch(() => setPatients([]));

    fetch("/api/professionals")
      .then((res) => res.json())
      .then(setProfessionals)
      .catch(() => setProfessionals([]));

    fetch("/api/salles")
      .then((res) => res.json())
      .then(setSalles)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!patientId || !professionalId || !salleId || !startTime || !endTime) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: Number(patientId),
        professional_id: Number(professionalId),
        salle_id: Number(salleId),
        start_time: startTime,
        end_time: endTime,
      }),
    });

    if (response.ok) {
      setMessage("Réservation enregistrée !");
      setPatientId("");
      setProfessionalId("");
      setSalleId("");
      setStartTime("");
      setEndTime("");
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
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Nouvelle réservation</h1>
          <p className="text-sm text-slate-500">
            Choisis le patient, le professionnel et la salle, puis renseigne les horaires.
          </p>
        </div>

        {message && (
          <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
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
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
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
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
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
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
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
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nom du patient"
                  className="w-full rounded border px-3 py-2"
                />
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      age: Number(e.target.value),
                    }))
                  }
                  placeholder="Âge"
                  className="w-full rounded border px-3 py-2"
                />
                <input
                  type="text"
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  placeholder="Genre"
                  className="w-full rounded border px-3 py-2"
                />
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Adresse"
                  className="w-full rounded border px-3 py-2"
                />
                <input
                  type="tel"
                  value={newPatient.phone_number}
                  onChange={(e) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      phone_number: e.target.value,
                    }))
                  }
                  placeholder="Téléphone"
                  className="w-full rounded border px-3 py-2"
                />
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="w-full rounded border px-3 py-2"
                />

                <input
                  type="text"
                  value={newPatient.num_secu_social}
                  onChange={(e) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      num_secu_social: e.target.value,
                    }))
                  }
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
              Début
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-2 w-full rounded border px-3 py-2"
                required
              />
            </label>

            <label className="block">
              Fin
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-2 w-full rounded border px-3 py-2"
                required
              />
            </label>
          </div>

          <button className="rounded bg-slate-900 px-4 py-2 text-white">Envoyer</button>
        </form>
      </div>
    </main>
  );
}
