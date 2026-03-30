import Link from 'next/link';

/**
 * Stitch homepage hero: centered headline + compound search
 * (Specialty / doctor name | Location | Search)
 */
export default function HomeHero() {
  return (
    <section
      id="find"
      className="relative overflow-hidden bg-white pb-12 pt-12 sm:pb-16 sm:pt-16"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_70%_60%_at_50%_-20%,rgba(13,148,136,0.08),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h1 className="font-display mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-[2.5rem] md:leading-tight">
          Find the right doctor for your needs
        </h1>
        <p className="font-ui mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Search by specialty or name, location, and book trusted care across
          Nepal.
        </p>

        <search className="mx-auto mt-10 block max-w-3xl">
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
            action="/doctors"
            method="get"
          >
            <label className="sr-only" htmlFor="hero-q">
              Specialty or doctor name
            </label>
            <input
              id="hero-q"
              type="search"
              name="q"
              placeholder="Specialty or doctor name"
              className="font-ui min-h-[48px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
              autoComplete="off"
            />
            <label className="sr-only" htmlFor="hero-location">
              Location
            </label>
            <input
              id="hero-location"
              type="text"
              name="location"
              placeholder="Location"
              className="font-ui min-h-[48px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
              autoComplete="address-level2"
            />
            <button
              type="submit"
              className="font-ui min-h-[48px] shrink-0 rounded-lg bg-[#0d9488] px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f766e] sm:min-w-[120px]"
            >
              Search
            </button>
          </form>
        </search>

        <p className="font-ui mt-4 text-sm text-slate-500">
          Popular:{' '}
          <Link
            href="/specialties/cardiology"
            className="font-medium text-slate-700 underline-offset-2 hover:text-[#0d9488] hover:underline"
          >
            Cardiology
          </Link>
          ,{' '}
          <Link
            href="/doctors?location=Kathmandu"
            className="font-medium text-slate-700 underline-offset-2 hover:text-[#0d9488] hover:underline"
          >
            Kathmandu
          </Link>
          ,{' '}
          <Link
            href="/specialties/dental"
            className="font-medium text-slate-700 underline-offset-2 hover:text-[#0d9488] hover:underline"
          >
            Dental
          </Link>
          {' · '}
          <Link
            href="/hospitals"
            className="font-medium text-[#0d9488] hover:underline"
          >
            Browse all hospitals
          </Link>
        </p>
      </div>
    </section>
  );
}
