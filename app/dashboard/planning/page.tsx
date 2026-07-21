"use client";

import { useEffect, useState } from "react";
import ReservationCalendar from "@/app/components/ReservationCalendar";
import ReservationForm from "@/app/components/ReservationForm";

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

export default function PlanningPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const selectedDayEvents = events.filter((event) => {
    if (!selectedDate || !event.start) return false;
    return event.start.slice(0, 10) === selectedDate;
  });

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDetails(true);
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
                  <p className="text-sm text-slate-500">Aucune réservation pour cette journée.</p>
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Ajouter une réservation</h3>
              

              <div className="mt-4 text-black">
                <ReservationForm
                  title="Ajouter une réservation"
                  subtitle="Complète le formulaire puis enregistre la réservation pour la journée sélectionnée."
                  compact
                  selectedDate={selectedDate}
                  onSuccess={() => {
                    void loadReservations();
                  }}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
