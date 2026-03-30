import Link from 'next/link';

/** Slugs must match `medical_specialties.slug` for live specialty pages. */
const categories = [
  { slug: 'cardiology', label: 'Cardiology', emoji: '❤️' },
  { slug: 'dental', label: 'Dental', emoji: '🦷' },
  { slug: 'pediatrics', label: 'Pediatrics', emoji: '👶' },
  { slug: 'orthopedics', label: 'Orthopedics', emoji: '🦴' },
  { slug: 'dermatology', label: 'Dermatology', emoji: '✨' },
  { slug: 'neurology', label: 'Neurology', emoji: '🧠' },
];

/** Horizontal specialty row — Stitch canvas */
export default function HomeCategoryRow() {
  return (
    <section className="border-y border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-ui mb-6 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
          Browse by specialty
        </h2>
        <div className="flex justify-center gap-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/specialties/${encodeURIComponent(c.slug)}`}
              className="font-ui flex min-w-[4.5rem] shrink-0 flex-col items-center gap-2 transition hover:opacity-90"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-2xl shadow-sm transition hover:border-[#0d9488]/40 hover:bg-[#0d9488]/5">
                <span aria-hidden>{c.emoji}</span>
              </span>
              <span className="max-w-[5rem] text-center text-xs font-medium leading-tight text-slate-700">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
