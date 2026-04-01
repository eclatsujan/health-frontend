import Link from 'next/link';
import type { ReactNode } from 'react';

type ListingPageShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  filterLabels?: string[];
};

/**
 * Stitch listing layout: filters sidebar + main results (lg+).
 */
export default function ListingPageShell({
  title,
  subtitle,
  children,
  filterLabels = ['Availability', 'Rating', 'Location'],
}: ListingPageShellProps) {
  const showAside = filterLabels.length > 0;

  return (
    <div className="bg-surface pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">{title}</h1>
          {subtitle ? <p className="font-body mt-2 max-w-2xl text-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>

        <div className={showAside ? 'flex flex-col gap-8 lg:flex-row lg:items-start' : ''}>
          {showAside ? (
            <aside className="w-full shrink-0 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm lg:w-64 lg:sticky lg:top-24">
              <h2 className="font-body text-sm font-semibold text-on-surface">Filters</h2>
              <ul className="font-body mt-4 space-y-3 text-sm text-on-surface-variant">
                {filterLabels.map((label) => (
                  <li key={label} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary-container focus:ring-primary-container"
                      disabled
                      readOnly
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <p className="font-body mt-4 text-xs text-on-surface-variant">Hook checkboxes to query params when API is connected.</p>
            </aside>
          ) : null}

          <div className={showAside ? 'min-w-0 flex-1' : 'min-w-0'}>{children}</div>
        </div>

        <p className="font-body mt-10 text-center text-sm text-on-surface-variant">
          <Link href="/" className="text-primary-container hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
