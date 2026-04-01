import type { ReactNode } from 'react';

type PageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function PageShell({ eyebrow, title, subtitle, children }: PageShellProps) {
  return (
    <div className="bg-surface pb-16 pt-10 sm:pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm sm:p-10">
          {eyebrow ? (
            <p className="font-body mb-3 text-xs font-semibold uppercase tracking-wider text-primary-container">{eyebrow}</p>
          ) : null}
          <h1 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">{title}</h1>
          {subtitle ? (
            <p className="font-body mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">{subtitle}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
