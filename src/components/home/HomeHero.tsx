import Link from 'next/link';

/**
 * Stitch homepage hero: centered headline + compound search
 * (Specialty / doctor name | Location | Search)
 */
export default function HomeHero() {
  return (
    <section id="find" className="relative overflow-hidden bg-surface pb-16 pt-16 sm:pb-20 sm:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_70%_60%_at_50%_-20%,rgba(13,115,119,0.14),transparent)]" />

      <div className="relative mx-auto w-[90%] max-w-8xl px-0 text-center sm:px-4">
        <h1 className="font-headline mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-on-surface sm:text-4xl md:text-[2.5rem] md:leading-tight">
          Find the right doctor for your needs
        </h1>
        <p className="font-body mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
          Search by specialty or name, location, and book trusted care across Nepal.
        </p>

        <form
          className="mx-auto mt-10 flex max-w-4xl flex-col gap-2 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-2 shadow-sm sm:flex-row sm:items-stretch"
          action="/doctors"
          method="get"
          role="search"
        >
          <label className="sr-only" htmlFor="hero-q">
            Specialty or doctor name
          </label>
          <input
            id="hero-q"
            type="search"
            name="q"
            placeholder="Specialty or doctor name"
            className="font-body min-h-[48px] w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-left text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
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
            className="font-body min-h-[48px] w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-left text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            autoComplete="address-level2"
          />
          <button
            type="submit"
            className="font-body min-h-[48px] shrink-0 rounded-xl bg-primary-container px-8 text-sm font-semibold text-on-primary shadow-sm transition hover:brightness-95 sm:min-w-[120px]"
          >
            Search
          </button>
        </form>

        <p className="font-body mt-4 text-sm text-on-surface-variant">
          Popular:{' '}
          <Link
            href="/specialties/cardiology"
            className="font-medium text-on-surface underline-offset-2 hover:text-primary-container hover:underline"
          >
            Cardiology
          </Link>
          ,{' '}
          <Link
            href="/doctors?location=Kathmandu"
            className="font-medium text-on-surface underline-offset-2 hover:text-primary-container hover:underline"
          >
            Kathmandu
          </Link>
          ,{' '}
          <Link
            href="/specialties/dental"
            className="font-medium text-on-surface underline-offset-2 hover:text-primary-container hover:underline"
          >
            Dental
          </Link>
          {' · '}
          <Link href="/hospitals" className="font-medium text-primary-container hover:underline">
            Browse all hospitals
          </Link>
        </p>
      </div>
    </section>
  );
}
