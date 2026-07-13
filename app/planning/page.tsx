'use client'

import ReservationCalendar from '../components/ReservationCalendar'
import Sidebar from "../ui/sidebar";


export default function PlanningPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <Sidebar />
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Planning</p>
          </div>
          
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

          <ReservationCalendar />
          
        </div>
      </div>
    </main>
  )
}