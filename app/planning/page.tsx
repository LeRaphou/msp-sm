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

export default function PlanningPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch("/api/reservations")
      .then((res) => res.json())
      .then((rows: ReservationRow[]) => {
        const mappedEvents = rows.map((row) => ({
          title: `${row.patient_name} • ${row.professional_name} • ${row.salle_name}`,
          start: row.start_time,
          end: row.end_time,
          allDay: false,
        }));

        setEvents(mappedEvents);
      })
      .catch((err) => {
        console.error("Erreur de chargement des réservations", err);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-6">
          Réservation
        </h1>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <ReservationCalendar events={events} onDateSelect={() => {}} />
        </div>
      </div>
    </main>
  );
}