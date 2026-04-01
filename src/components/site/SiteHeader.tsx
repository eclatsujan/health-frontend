'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from '@/components/ui/NavLink';

const primaryNav = [
  { href: '/doctors', label: 'Doctors' },
  { href: '/hospitals', label: 'Hospitals' },
  { href: '/pharmacies', label: 'Pharmacies' },
  { href: '/labs', label: 'Labs' },
  { href: '/nurses', label: 'Nurses' },
  { href: '/emergency', label: 'Emergency' },
] as const;

const drawerNav = [
  { href: '/', label: 'Home', end: true as const },
  ...primaryNav,
  { href: '/colleges', label: 'Colleges' },
  { href: '/blog', label: 'Blog' },
  { href: '/news', label: 'News' },
] as const;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

export default function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return document.documentElement.classList.contains('dark');
  });
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      window.localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const languages = useMemo(() => ['English (EN)', 'Español (ES)', 'Français (FR)'], []);

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      try {
        window.localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <header
      className={[
        'w-full z-50 backdrop-blur-xl border-b transition-colors duration-200',
        isScrolled
          ? 'fixed top-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 shadow-sm dark:shadow-none border-slate-200 dark:border-slate-800'
          : 'bg-white/30 dark:bg-slate-900/30 shadow-none border-transparent',
      ].join(' ')}
    >
      <nav className="flex justify-between items-center w-[90%] max-w-8xl mx-auto py-4 px-0 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <MenuIcon open={drawerOpen} />
          </button>

          <Link
            href="/"
            className="text-2xl font-black text-teal-800 dark:text-teal-400 tracking-tighter flex items-center gap-2"
            onClick={() => setDrawerOpen(false)}
          >
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed" aria-hidden>
              medical_services
            </span>
            MediHub
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className={({ isActive }) =>
                  [
                    'font-["Manrope"] font-semibold text-sm tracking-tight transition-colors duration-300',
                    isActive
                      ? 'text-teal-700 dark:text-teal-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative group hidden sm:block">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold text-slate-600 dark:text-slate-400"
              onClick={() => setLangOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-lg" aria-hidden>
                language
              </span>
              EN
              <span className="material-symbols-outlined text-sm" aria-hidden>
                expand_more
              </span>
            </button>
            {langOpen ? (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-100 dark:border-slate-700 py-2 opacity-100 visible z-50">
                {languages.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 w-full text-left"
                    onClick={() => {
                      setLangOpen(false);
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined" aria-hidden>
              {darkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2 text-sm font-semibold text-primary dark:text-teal-400 border border-primary/20 dark:border-teal-400/20 hover:bg-primary/5 dark:hover:bg-teal-400/5 rounded-full transition-all"
            >
              List Your Practice
            </Link>
            <Link href="/login" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-primary-container text-on-primary dark:bg-teal-600 font-bold rounded-full scale-95 active:opacity-80 transition-transform"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {drawerOpen ? (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur lg:hidden">
          <nav className="mx-auto w-[90%] max-w-6xl px-4 py-3 sm:px-6" aria-label="Mobile">
            {drawerNav.map((item) => (
              <NavLink
                key={item.href + item.label}
                href={item.href}
                end={'end' in item ? item.end : undefined}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  [
                    'font-ui block rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
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
