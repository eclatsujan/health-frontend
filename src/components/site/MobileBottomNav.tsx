'use client';

import { NavLink } from '@/components/ui/NavLink';

const items = [
  {
    to: '/',
    label: 'Home',
    end: true as const,
    path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    to: '/hospitals',
    label: 'Hospitals',
    path: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    to: '/doctors',
    label: 'Doctors',
    path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    to: '/contact',
    label: 'Contact',
    path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
];

export default function MobileBottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden"
      aria-label="Bottom"
    >
      <div className="mx-auto flex max-w-lg justify-around px-1 pt-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            href={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'font-ui flex min-w-[3.25rem] flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-semibold',
                isActive ? 'text-[#0d9488]' : 'text-slate-500',
              ].join(' ')
            }
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={item.path}
              />
            </svg>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
