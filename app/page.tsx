import Sidebar from "./ui/sidebar";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-black items-center justify-center">
      <header className="flex items-center justify-between rounded-b-2xl bg-slate-900 px-6 py-4 text-white shadow-md">
        <div>
          <h1 className="text-lg font-semibold">MSP-SM</h1>
          <p className="text-sm text-slate-300">Bienvenue</p>
        </div>
        <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
          Se connecter
        </button>
      </header>


 
      <section className="flex min-h-[70vh] items-stretch gap-8 px-6 py-16">
        <Sidebar />

        <div className="flex flex-1 max-w-3xl items-center justify-center text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            Une maison de santé pluriprofessionnelle, c&apos;est avant tout un lieu
            de soins pensé autour du patient.
          </h2>
          
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Elle réunit plusieurs professionnels de santé, comme des médecins,
            des infirmiers, des kinésithérapeutes ou encore des psychologues,
            afin de proposer une prise en charge globale, cohérente et proche
            du quotidien des personnes accompagnées.
          </p>
        </div>
        </section>
    </main>
  );
}
