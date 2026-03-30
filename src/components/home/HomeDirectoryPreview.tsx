import Link from 'next/link';

const doctors = [
  {
    name: 'Dr. Maya Shrestha',
    role: 'Cardiology · KMC',
    city: 'Kathmandu',
    tag: 'Verified',
    rating: 4.9,
  },
  {
    name: 'Dr. Rajesh Koirala',
    role: 'Orthopedics',
    city: 'Patan',
    tag: 'Verified',
    rating: 4.8,
  },
  {
    name: 'Dr. Anisha Gurung',
    role: 'Pediatrics',
    city: 'Bhaktapur',
    tag: 'Verified',
    rating: 5.0,
  },
];

const hospitals = [
  {
    name: 'Grande International Hospital',
    role: 'Multi-specialty · Trauma',
    city: 'Kathmandu',
    cover: 'from-teal-600/80 to-slate-800/90',
  },
  {
    name: 'Patan Hospital',
    role: 'Public · Teaching',
    city: 'Lalitpur',
    cover: 'from-cyan-600/70 to-slate-800/90',
  },
  {
    name: 'Norvic International',
    role: 'Cardiac · Emergency',
    city: 'Kathmandu',
    cover: 'from-emerald-600/70 to-slate-800/90',
  },
];

function PreviewStars() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/** Top rated doctors + nearby hospitals — Stitch card pattern (rounded-xl, border, shadow-sm) */
export default function HomeDirectoryPreview() {
  return (
    <section id="providers" className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Top rated doctors
            </h2>
            <p className="font-ui mt-2 max-w-xl text-sm text-slate-600">
              Highly rated specialists — connect API for live data.
            </p>
          </div>
          <Link
            href="/doctors"
            className="font-ui rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0d9488]/40 hover:text-[#0d9488]"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((c) => (
            <article
              key={c.name}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex gap-3">
                <div
                  className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-[#0d9488]/25 to-slate-200 ring-2 ring-white"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <span className="font-ui inline-block rounded-md bg-[#0d9488]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#0f766e]">
                    {c.tag}
                  </span>
                  <h3 className="font-ui mt-1 truncate text-base font-semibold text-slate-900">
                    {c.name}
                  </h3>
                  <p className="font-ui truncate text-sm text-slate-600">
                    {c.role}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <PreviewStars />
                    <span className="font-ui text-xs font-medium text-slate-500">
                      {c.rating}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-ui mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {c.city}
              </p>
              <Link
                href="/doctors"
                className="font-ui mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#0d9488] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f766e]"
              >
                Book appointment
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Nearby hospitals
            </h2>
            <p className="font-ui mt-2 max-w-xl text-sm text-slate-600">
              Verified facilities with photos and locations.
            </p>
          </div>
          <Link
            href="/hospitals"
            className="font-ui rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0d9488]/40 hover:text-[#0d9488]"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((h) => (
            <Link
              key={h.name}
              href="/hospitals"
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className={`relative h-32 bg-gradient-to-br ${h.cover}`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
                <span className="font-ui absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                  Partner
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-ui text-base font-semibold text-slate-900 group-hover:text-[#0d9488]">
                  {h.name}
                </h3>
                <p className="font-ui mt-1 text-sm text-slate-600">{h.role}</p>
                <p className="font-ui mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  {h.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
