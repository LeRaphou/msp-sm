"use client";

import { useEffect, useState } from "react";
import ReservationCalendar from "../components/ReservationCalendar";

type ReservationRow = {
  patient_name: string;
  professional_name: string;
  salle_name: string;
  start_time: string;
  end_time: string;
};

type CalendarEvent = {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

type Item = { id: number; name: string };

export default function PlanningPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [patients, setPatients] = useState<Item[]>([]);
  const [professionals, setProfessionals] = useState<Item[]>([]);
  const [salles, setSalles] = useState<Item[]>([]);
  const [patientId, setPatientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [salleId, setSalleId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reservations");
      const rows: ReservationRow[] = await response.json();
      const mappedEvents = rows.map((row) => ({
        title: `${row.patient_name} • ${row.professional_name} • ${row.salle_name}`,
        start: row.start_time,
        end: row.end_time,
        allDay: false,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Erreur de chargement des réservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReservations();

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

  const selectedDayEvents = events.filter((event) => {
    if (!selectedDate || !event.start) return false;
    return event.start.slice(0, 10) === selectedDate;
  });

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDetails(true);
  };

  const handleAddReservation = async () => {
    if (!selectedDate || !patientId || !professionalId || !salleId || !startTime || !endTime) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    setMessage("");
    const startDateTime = `${selectedDate}T${startTime}:00`;
    const endDateTime = `${selectedDate}T${endTime}:00`;

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: Number(patientId),
          professional_id: Number(professionalId),
          salle_id: Number(salleId),
          start_at: startDateTime,
          end_at: endDateTime,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Erreur lors de l’ajout.";
        if (text) {
          try {
            const parsed = JSON.parse(text);
            errorMessage = parsed?.error || errorMessage;
          } catch {
            errorMessage = text;
          }
        }
        setMessage(errorMessage);
        return;
      }

      setMessage("Réservation ajoutée avec succès.");
      setPatientId("");
      setProfessionalId("");
      setSalleId("");
      setStartTime("");
      setEndTime("");
      await loadReservations();
    } catch (error) {
      console.error(error);
      setMessage("Erreur réseau.");
    }
  };

  const formatDateLabel = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Planning des réservations</h1>
            <p className="text-sm text-slate-500">
              Cliquez sur une date pour voir les réservations de la journée et en ajouter.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <ReservationCalendar events={events} onDateSelect={handleDateSelect} />
        </div>

        {showDetails && selectedDate && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Réservations du {formatDateLabel(selectedDate)}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Liste des réservations déjà enregistrées sur cette journée.
                  </p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm"
                >
                  Fermer
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {loading ? (
                  <p className="text-sm text-slate-500">Chargement…</p>
                ) : selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event, index) => (
                    <div
                      key={`${event.title}-${event.start}-${index}`}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-3"
                    >
                      <div className="font-medium text-slate-900">{event.title}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        {event.start} → {event.end}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Aucune réservation pour cette journée.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Ajouter une réservation</h3>
              <p className="mt-1 text-sm text-slate-500">
                Utilise le même type de formulaire que la page réservations.
              </p>

              {message && (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Patient</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="">Sélectionner un patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Professionnel</label>
                  <select
                    value={professionalId}
                    onChange={(e) => setProfessionalId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="">Sélectionner un professionnel</option>
                    {professionals.map((professional) => (
                      <option key={professional.id} value={professional.id}>{professional.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Salle</label>
                  <select
                    value={salleId}
                    onChange={(e) => setSalleId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="">Sélectionner une salle</option>
                    {salles.map((salle) => (
                      <option key={salle.id} value={salle.id}>{salle.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="block text-sm font-medium text-slate-700">Début</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-slate-700">Fin</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>
                </div>
              </div>

              <button
                onClick={handleAddReservation}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Enregistrer
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
