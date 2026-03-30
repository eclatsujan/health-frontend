'use client';

import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ListingPageShell from '@/components/layout/ListingPageShell';
import DoctorCard from '@/components/doctors/DoctorCard';
import type { DoctorCardDoctor } from '@/components/doctors/DoctorCard';
import { doctorsIndexUrl, specialtyBySlugUrl } from '@/api/publicApi';
import { useInfiniteResourceList } from '@/hooks/useInfiniteResourceList';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';

const PER_PAGE = 12;

function SpecialtyDoctorsSection({ specialtySlug }: { specialtySlug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || searchParams.get('q') || '';
  const district = searchParams.get('district') || searchParams.get('location') || '';

  const urlForPage = useCallback(
    (page: number) =>
      doctorsIndexUrl({
        specialty: specialtySlug,
        search: search || undefined,
        district: district || undefined,
        page,
        per_page: PER_PAGE,
        sort: 'name',
      }),
    [specialtySlug, search, district],
  );

  const { rows, meta, loading, loadingMore, error, sentinelRef } = useInfiniteResourceList<DoctorCardDoctor>(urlForPage);
  const hasMore = meta && meta.current_page != null && meta.last_page != null && meta.current_page < meta.last_page;

  function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    const s = fd.get('search')?.toString().trim();
    const d = fd.get('district')?.toString().trim();
    if (s) next.set('search', s);
    if (d) next.set('district', d);
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }

  return (
    <>
      <form onSubmit={applyFilters} className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="sp-search" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              Name or keyword
            </label>
            <input
              id="sp-search"
              name="search"
              defaultValue={search}
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div>
            <label htmlFor="sp-district" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              District / city
            </label>
            <input
              id="sp-district"
              name="district"
              defaultValue={district}
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="font-ui w-full rounded-lg bg-[#0d9488] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f766e] sm:w-auto"
            >
              Apply filters
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <p className="font-ui py-12 text-center text-slate-500">Loading doctors…</p>
      ) : error && rows.length === 0 ? (
        <p className="font-ui rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-800">{error}</p>
      ) : rows.length === 0 ? (
        <p className="font-ui rounded-xl border border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-600">
          No doctors match these filters in this specialty.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((doc) => (
              <DoctorCard key={String(doc.id)} doctor={doc} />
            ))}
          </div>
          {error && rows.length > 0 ? <p className="font-ui mt-4 text-center text-sm text-red-700">{error}</p> : null}
          <div ref={sentinelRef} className="h-px w-full" aria-hidden />
          {loadingMore ? <p className="font-ui py-8 text-center text-sm text-slate-500">Loading more doctors…</p> : null}
          {!loading && !loadingMore && rows.length > 0 && !hasMore ? (
            <p className="font-ui py-6 text-center text-xs text-slate-400">You’ve reached the end of the list.</p>
          ) : null}
        </>
      )}
    </>
  );
}

type Specialty = {
  id: number | string;
  name?: string;
  slug?: string;
  children?: { id: number | string; name?: string; slug?: string }[];
};

export default function SpecialtyPageView({ slug }: { slug: string }) {
  const appName = useAppName();
  const { data: specialty, loading, notFound, loadError } = usePublicSlugResource<Specialty>(specialtyBySlugUrl(slug));

  useEffect(() => {
    if (specialty?.name) {
      document.title = `${specialty.name} — ${appName}`;
    }
    return () => {
      document.title = appName;
    };
  }, [specialty, appName]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] py-20 text-center">
        <p className="font-ui text-slate-600">Loading specialty…</p>
      </div>
    );
  }

  if (loadError && !notFound) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="font-ui text-red-700">{loadError}</p>
        <Link href="/doctors" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
          Browse all doctors
        </Link>
      </div>
    );
  }

  if (notFound || !specialty) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Specialty not found</h1>
        <Link href="/doctors" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
          Browse all doctors
        </Link>
      </div>
    );
  }

  const children = specialty.children || [];

  return (
    <ListingPageShell title={specialty.name ?? 'Specialty'} subtitle="Doctors in this specialty. Refine by name or location." filterLabels={[]}>
      {children.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="font-ui text-xs font-medium uppercase tracking-wide text-slate-500">Related:</span>
          {children.map((c) => (
            <Link
              key={c.id}
              href={`/specialties/${c.slug}`}
              className="font-ui rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-800 hover:border-[#0d9488]/40 hover:text-[#0d9488]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}

      <SpecialtyDoctorsSection specialtySlug={slug} />

      <p className="mt-10 text-center">
        <Link href="/doctors" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
          ← All doctors
        </Link>
      </p>
    </ListingPageShell>
  );
}
