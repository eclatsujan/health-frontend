'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NavLink } from '@/components/ui/NavLink';
import { useAppName } from '@/hooks/useAppName';

const centerNav = [
  { to: '/doctors', label: 'Find Doctors' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/blog', label: 'Blog' },
  { to: '/news', label: 'News' },
  { to: '/about', label: 'About Us' },
] as const;

const drawerNav = [
  { to: '/', label: 'Home', end: true as const },
  ...centerNav,
  { to: '/nurses', label: 'Nurses' },
  { to: '/colleges', label: 'Colleges' },
  { to: '/labs', label: 'Labs' },
  { to: '/pharmacies', label: 'Pharmacies' },
  { to: '/blog', label: 'Blog' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
}

export default function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const appName = useAppName();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#202124] text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/90 hover:bg-white/10 lg:hidden"
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <MenuIcon open={drawerOpen} />
          </button>
          <Link
            href="/"
            className="font-ui truncate text-lg font-bold tracking-tight text-white"
          >
            {appName}
          </Link>
        </div>

        <nav
          className="hidden flex-1 justify-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {centerNav.map((item) => (
            <NavLink
              key={item.to}
              href={item.to}
              className={({ isActive }) =>
                [
                  'font-ui rounded-lg px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/85 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center">
          <a
            href="/login"
            className="font-ui inline-flex items-center rounded-lg bg-[#0d9488] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f766e]"
          >
            Sign in
          </a>
        </div>
      </div>

      {drawerOpen ? (
        <div className="border-t border-white/10 bg-[#2d2f31] lg:hidden">
          <nav
            className="mx-auto max-w-6xl px-4 py-3 sm:px-6"
            aria-label="Mobile"
          >
            {drawerNav.map((item) => (
              <NavLink
                key={item.to + item.label}
                href={item.to}
                end={'end' in item ? item.end : undefined}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  [
                    'font-ui block rounded-lg px-3 py-3 text-sm font-medium',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/90 hover:bg-white/5',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
