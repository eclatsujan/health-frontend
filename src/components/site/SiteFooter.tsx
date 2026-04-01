'use client';

import Link from 'next/link';
import { useAppName } from '@/hooks/useAppName';

export default function SiteFooter() {
  const y = new Date().getFullYear();
  const name = useAppName();

  return (
    <footer className="bg-[#f1f4f4] dark:bg-slate-950 w-full border-t border-[#bec9c9]/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] max-w-8xl mx-auto py-12 px-0 sm:px-4">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-black text-[#0d7377] font-headline">{name}</span>
          <p className="font-['Inter'] text-sm text-[#3e4949] dark:text-slate-400 max-w-sm">
            Providing a digital sanctuary for your health needs. Connect with verified medical professionals and world-class
            facilities.
          </p>
          <p className="font-['Inter'] text-sm text-[#3e4949] dark:text-slate-400 mt-4">
            © {y} MediHub Clinical Sanctuary. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-6">
          <div className="flex flex-wrap gap-6 md:justify-end">
            <Link
              className="font-['Inter'] text-sm text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-white transition-colors"
              href="/about"
            >
              Privacy Policy
            </Link>
            <Link
              className="font-['Inter'] text-sm text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-white transition-colors"
              href="/about"
            >
              Terms of Service
            </Link>
            <Link
              className="font-['Inter'] text-sm text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-white transition-colors"
              href="/about"
            >
              Accessibility
            </Link>
            <Link
              className="font-['Inter'] text-sm text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-white transition-colors"
              href="/contact"
            >
              Contact Support
            </Link>
            <Link
              className="font-['Inter'] text-sm text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-white transition-colors"
              href="/about"
            >
              Careers
            </Link>
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-on-primary transition-all dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-600 dark:hover:text-white"
              aria-label="Public"
            >
              <span className="material-symbols-outlined" aria-hidden>
                public
              </span>
            </Link>
            <Link
              href="/contact"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-on-primary transition-all dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-600 dark:hover:text-white"
              aria-label="Email"
            >
              <span className="material-symbols-outlined" aria-hidden>
                mail
              </span>
            </Link>
          </div>

          <div className="flex gap-4 text-sm text-[#3e4949] dark:text-slate-500">
            <Link className="hover:text-[#0d7377] dark:hover:text-white transition-colors" href="/contact">
              Contact
            </Link>
            <Link className="hover:text-[#0d7377] dark:hover:text-white transition-colors" href="/about">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
