'use client';
// @ts-nocheck

import { useEffect } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { nurseBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';

export default function NurseDetailView({ slug }: { slug: string }) {
  const appName = useAppName();
  const { data: n, loading, notFound, loadError } = usePublicSlugResource(nurseBySlugUrl(slug));

  useEffect(() => {
    if (n?.first_name) {
      document.title = `${n.first_name} ${n.last_name || ''} — ${appName}`;
    }
    return () => {
      document.title = appName;
    };
  }, [n, appName]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] py-20 text-center">
        <p className="font-ui text-slate-600">Loading profile…</p>
      </div>
    );
  }

  if (loadError && !notFound) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="font-ui text-red-700">{loadError}</p>
        <Link href="/nurses" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
          Back to nurses
        </Link>
      </div>
    );
  }

  if (notFound || !n) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Nurse not found</h1>
        <Link href="/nurses" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
          Back to nurses
        </Link>
      </div>
    );
  }

  const name = `${n.first_name || ''} ${n.last_name || ''}`.trim();
  const photo = n.profile_photo_url;
  const hospitals = n.hospitals || [];

  return (
    <article className="bg-[#f8fafc] pb-16">
      <div className="relative h-40 w-full overflow-hidden bg-slate-200 sm:h-48">
        <div className="h-full w-full bg-gradient-to-br from-[#0d9488]/35 via-slate-600/25 to-slate-800/40" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative -mt-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left lg:flex-row lg:gap-6">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg ring-2 ring-slate-100 sm:h-32 sm:w-32">
              {photo ? (
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d9488]/25 to-slate-200 text-2xl font-bold text-slate-600">
                  {(n.first_name?.[0] || '') + (n.last_name?.[0] || '')}
                </div>
              )}
            </div>
            <div className="mt-4 min-w-0 flex-1 lg:mt-8">
              {n.verification_status === 'approved' ? (
                <span className="inline-block rounded-md bg-[#0d9488]/10 px-2 py-0.5 text-xs font-semibold uppercase text-[#0f766e]">
                  Verified
                </span>
              ) : null}
              <h1 className="font-display mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{name}</h1>
              <p className="font-ui mt-1 text-slate-600">{n.specialty?.name || n.sub_specialty || 'Registered nurse'}</p>
              {n.average_rating != null ? (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Stars value={n.average_rating} />
                  <span className="font-ui text-sm font-semibold">{Number(n.average_rating).toFixed(1)}</span>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-72 lg:pt-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <p className="font-ui text-sm font-semibold text-slate-900">Contact</p>
              {n.phone ? (
                <a
                  href={`tel:${n.phone}`}
                  className="font-ui mt-4 block w-full rounded-lg bg-[#0d9488] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
                >
                  Call {n.phone}
                </a>
              ) : (
                <p className="font-ui mt-2 text-xs text-slate-500">No phone listed</p>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {n.biography ? (
              <section>
                <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">About</h2>
                <div className="font-ui mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{n.biography}</div>
              </section>
            ) : null}

            {hospitals.length > 0 ? (
              <section>
                <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Hospitals</h2>
                <ul className="mt-4 space-y-3">
                  {hospitals.map((h: { id: string | number; slug?: string; name?: string; district?: string }) => (
                    <li key={h.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <Link href={`/hospitals/${h.slug}`} className="font-ui font-semibold text-[#0d9488] hover:underline">
                        {h.name}
                      </Link>
                      {h.district ? <p className="font-ui mt-1 text-sm text-slate-600">{h.district}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <div className="space-y-6">
            {n.clinic_name || n.clinic_address_line1 ? (
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-display text-base font-bold text-slate-900">Clinic</h2>
                {n.clinic_name ? <p className="font-ui mt-2 font-medium">{n.clinic_name}</p> : null}
                <p className="font-ui mt-1 text-sm text-slate-600">
                  {[n.clinic_address_line1, n.clinic_address_line2].filter(Boolean).join(', ')}
                </p>
              </section>
            ) : null}
          </div>
        </div>

        <p className="mt-12 text-center">
          <Link href="/nurses" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
            ← All nurses
          </Link>
        </p>
      </div>
    </article>
  );
}
