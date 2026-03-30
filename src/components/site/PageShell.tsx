'use client';

import type { ReactNode } from 'react';

type PageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

/**
 * Inner marketing pages — same canvas as Stitch: white content band on #f8fafc
 */
export default function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: PageShellProps) {
  return (
    <div className="bg-[#f8fafc] pb-16 pt-10 sm:pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          {eyebrow ? (
            <p className="font-ui mb-3 text-xs font-semibold uppercase tracking-wider text-[#0d9488]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="font-ui mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
