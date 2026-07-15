"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

type Props = {
  events: { title: string; start: string; end?: string; allDay?: boolean }[];
  onDateSelect: (date: string) => void;
};

export default function ReservationCalendar({ events, onDateSelect }: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{ left: "title", center: "", right: "prev,next today" }}
      buttonText={{ today: "Aujourd'hui" }}
      dayMaxEventRows={3}
      fixedWeekCount={false}
      height="auto"
      events={events}
      dateClick={(info) => onDateSelect(info.dateStr)}
    />
  );
}