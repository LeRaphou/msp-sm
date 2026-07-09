const navItems = ["Accueil", "Présentation", "Contact"];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-[70vh] w-60 rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-sm md:flex md:flex-col md:gap-2 items-center">
      <div className="mb-2 px-2 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        Navigation
      </div>
      {navItems.map((item) => (
        <button
          key={item}
          className="rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          {item}
        </button>
      ))}
    </aside>
  );
}
