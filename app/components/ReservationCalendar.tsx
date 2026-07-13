'use client'

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { inter } from '../ui/font';

export default function ReservationCalendar() {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: 'title', center: '', right: 'prev,next today' }}
            buttonText={{ today: "Aujourd'hui" }}
            dayMaxEventRows={3}
            fixedWeekCount={false}
            height="auto"
            dateClick={(info) => {
                console.log(info.dateStr);
            }}
          />
    );
}
