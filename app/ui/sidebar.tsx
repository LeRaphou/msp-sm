import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden min-h-full w-60 rounded-3xl border border-slate-200 bg-slate-900 p-4 text-white shadow-sm md:flex md:flex-col md:gap-2 items-center justify-start">
      <div className="mb-2 px-2 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 ">
        Navigation
      </div>


      <div className="flex flex-1 flex-col gap-2 items-center ">
<Link href="/">
  <button>Accueil</button>
</Link>

<Link href="/presentation">
  <button>Présentation</button>
</Link>

<Link href="/contact">
  <button>Contact</button>
</Link>

<Link href="/stock">
  <button>Stock</button>
</Link>

<Link href="/planning">
  <button>Planning</button>
</Link>

<Link href="/professionnels">
  <button>Professionnels</button>
</Link>

<Link href="/reservations">
    <button>Reservations</button>
  </Link>
      </div>
    </aside>
  );
}
