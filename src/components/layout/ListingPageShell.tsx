'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Stitch listing layout: filters sidebar + main results (lg+).
 * Placeholder filters until API wiring.
 */
type ListingPageShellProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  filterLabels?: string[];
};

export default function ListingPageShell({
  title,
  subtitle,
  children,
  filterLabels = ['Availability', 'Rating', 'Location'],
}: ListingPageShellProps) {
  const showAside = filterLabels.length > 0;

  return (
    <div className="bg-[#f8fafc] pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="font-ui mt-2 max-w-2xl text-sm text-slate-600">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div
          className={
            showAside ? 'flex flex-col gap-8 lg:flex-row lg:items-start' : ''
          }
        >
          {showAside ? (
            <aside className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:w-64 lg:sticky lg:top-24">
              <h2 className="font-ui text-sm font-semibold text-slate-900">
                Filters
              </h2>
              <ul className="font-ui mt-4 space-y-3 text-sm text-slate-600">
                {filterLabels.map((label) => (
                  <li key={label} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]"
                      disabled
                      readOnly
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <p className="font-ui mt-4 text-xs text-slate-400">
                Hook checkboxes to query params when API is connected.
              </p>
            </aside>
          ) : null}

          <div className={showAside ? 'min-w-0 flex-1' : 'min-w-0'}>
            {children}
          </div>
        </div>

        <p className="font-ui mt-10 text-center text-sm text-slate-500">
          <Link href="/" className="text-[#0d9488] hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
