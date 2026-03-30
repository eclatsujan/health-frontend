'use client';

import Link from 'next/link';
import { useAppName } from '@/hooks/useAppName';

/** Multi-column footer — same max width as header/content */
export default function SiteFooter() {
  const y = new Date().getFullYear();
  const name = useAppName();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-ui text-lg font-bold text-slate-900">{name}</p>
            <p className="font-ui mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
              Find doctors and hospitals across Nepal. Trusted listings for
              patients and families.
            </p>
          </div>
          <div>
            <p className="font-ui text-sm font-semibold text-slate-900">
              Explore
            </p>
            <ul className="font-ui mt-3 grid gap-x-6 gap-y-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-1">
              <li>
                <Link href="/" className="hover:text-[#0d9488]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-[#0d9488]">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-[#0d9488]">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link href="/nurses" className="hover:text-[#0d9488]">
                  Nurses
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-[#0d9488]">
                  Labs
                </Link>
              </li>
              <li>
                <Link href="/pharmacies" className="hover:text-[#0d9488]">
                  Pharmacies
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-[#0d9488]">
                  Colleges
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#0d9488]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#0d9488]">
                  News
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-ui text-sm font-semibold text-slate-900">
              Company
            </p>
            <ul className="font-ui mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-[#0d9488]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0d9488]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-ui text-sm font-semibold text-slate-900">
              Account
            </p>
            <ul className="font-ui mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="/login" className="hover:text-[#0d9488]">
                  Sign in
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-[#0d9488]">
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="font-ui mt-10 border-t border-slate-100 pt-8 text-center text-xs text-slate-500">
          © {y} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
