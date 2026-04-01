'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { doctorsIndexUrl, fetchJson, hospitalsIndexUrl } from '@/api/publicApi';
import { HOME_REVALIDATE_SECONDS } from '@/lib/homeConstants';
import {
  DIRECTORY_FETCH_LIMIT,
  processRawDoctorsForHome,
  processRawHospitalsForHome,
} from '@/lib/homePreview';

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <title>Star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const staleMs = HOME_REVALIDATE_SECONDS * 1000;

const DOCTOR_SKELETON_KEYS = ['d1', 'd2', 'd3', 'd4', 'd5'] as const;
const HOSPITAL_SKELETON_KEYS = ['h1', 'h2', 'h3', 'h4', 'h5'] as const;

export default function HomeDirectoryPreview({
  initialDoctorsRaw,
  initialHospitalsRaw,
}: {
  initialDoctorsRaw: unknown[];
  initialHospitalsRaw: unknown[];
}) {
  const [initialDoctors] = useState(() => initialDoctorsRaw);
  const [initialHospitals] = useState(() => initialHospitalsRaw);

  const fetchDoctors = useCallback(async () => {
    const res = await fetchJson<{ data?: unknown[] }>(
      doctorsIndexUrl({
        page: 1,
        per_page: DIRECTORY_FETCH_LIMIT,
        sort: 'name',
      }),
    ).catch(() => ({ data: [] }));
    return res?.data ?? [];
  }, []);

  const fetchHospitals = useCallback(async () => {
    const res = await fetchJson<{ data?: unknown[] }>(
      hospitalsIndexUrl({
        page: 1,
        per_page: DIRECTORY_FETCH_LIMIT,
      }),
    ).catch(() => ({ data: [] }));
    return res?.data ?? [];
  }, []);

  const doctorsQuery = useQuery({
    queryKey: ['home', 'doctors-preview'],
    queryFn: fetchDoctors,
    initialData: initialDoctors,
    staleTime: staleMs,
    refetchOnMount: false,
    retry: 1,
  });

  const hospitalsQuery = useQuery({
    queryKey: ['home', 'hospitals-preview'],
    queryFn: fetchHospitals,
    initialData: initialHospitals,
    staleTime: staleMs,
    refetchOnMount: false,
    retry: 1,
  });

  const loading =
    doctorsQuery.isPending ||
    hospitalsQuery.isPending ||
    doctorsQuery.isLoading ||
    hospitalsQuery.isLoading;

  const mappedDoctors = useMemo(
    () => processRawDoctorsForHome(doctorsQuery.data ?? []),
    [doctorsQuery.data],
  );
  const mappedHospitals = useMemo(
    () => processRawHospitalsForHome(hospitalsQuery.data ?? []),
    [hospitalsQuery.data],
  );

  return (
    <section id="providers" className="bg-surface py-14 sm:py-16">
      <div className="mx-auto w-[90%] max-w-8xl px-0 sm:px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">
              Top rated doctors
            </h2>
            <p className="font-body mt-2 max-w-xl text-sm text-on-surface-variant">
              Highly rated specialists - live data.
            </p>
          </div>
          <Link
            href="/doctors"
            className="font-body rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface shadow-sm transition hover:border-primary-container/40 hover:text-primary-container"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading
            ? DOCTOR_SKELETON_KEYS.map((sk) => (
                <div
                  key={`doc-skel-${sk}`}
                  className="flex-none w-[320px] flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm animate-pulse"
                >
                  <div className="flex gap-3">
                    <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="min-w-0 flex-1">
                      <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="mt-2 h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="mt-2 h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="mt-3 h-5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                  <div className="mt-3 h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-4 h-9 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
                </div>
              ))
            : mappedDoctors.map((c) => (
                <article
                  key={c.key}
                  className="flex-none w-[320px] flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm transition hover:border-primary-container/25 hover:shadow-md"
                >
                  <div className="flex gap-3">
                    <div
                      className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-[#0d9488]/25 to-slate-200 ring-2 ring-white dark:to-slate-700 dark:ring-slate-800"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-body inline-block rounded-md bg-primary-container/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-container">
                        {c.tag}
                      </span>
                      <h3 className="font-body mt-1 truncate text-base font-semibold text-on-surface">
                        {c.name}
                      </h3>
                      <p className="font-body truncate text-sm text-on-surface-variant">
                        {c.role}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Stars />
                        <span className="font-body text-xs font-medium text-on-surface-variant">
                          {c.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body mt-3 text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">
                    {c.city}
                  </p>
                  <Link
                    href={c.slug ? `/doctors/${c.slug}` : '/doctors'}
                    className="font-body mt-4 inline-flex w-full items-center justify-center rounded-lg bg-primary-container py-2.5 text-sm font-semibold text-on-primary transition hover:brightness-95"
                  >
                    Book appointment
                  </Link>
                </article>
              ))}
        </div>

        <div className="mt-14 mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">
              Nearby hospitals
            </h2>
            <p className="font-body mt-2 max-w-xl text-sm text-on-surface-variant">
              Verified facilities with quick access.
            </p>
          </div>
          <Link
            href="/hospitals"
            className="font-body rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface shadow-sm transition hover:border-primary-container/40 hover:text-primary-container"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading
            ? HOSPITAL_SKELETON_KEYS.map((sk) => (
                <div
                  key={`hosp-skel-${sk}`}
                  className="flex-none w-[320px] group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm animate-pulse"
                >
                  <div className="relative h-32 bg-gradient-to-br from-slate-600/70 to-slate-800/90">
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 opacity-40" />
                  </div>
                  <div className="p-4">
                    <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-2 h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-3 h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              ))
            : mappedHospitals.map((h) => (
                <Link
                  key={h.key}
                  href={h.slug ? `/hospitals/${h.slug}` : '/hospitals'}
                  className="flex-none w-[320px] group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition hover:border-primary-container/25 hover:shadow-md"
                >
                  <div className={`relative h-32 bg-gradient-to-br ${h.cover}`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
                    <span className="font-body absolute bottom-2 left-2 rounded-md bg-surface-container-lowest/95 px-2 py-0.5 text-[11px] font-semibold text-on-surface">
                      {h.badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-body text-base font-semibold text-on-surface group-hover:text-primary-container">
                      {h.name}
                    </h3>
                    <p className="font-body mt-1 text-sm text-on-surface-variant">
                      {h.role}
                    </p>
                    <p className="font-body mt-2 text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">
                      {h.city}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
