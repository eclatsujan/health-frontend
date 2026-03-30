'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ListingPageShell from '@/components/layout/ListingPageShell';
import DoctorCard from '@/components/doctors/DoctorCard';
import type { DoctorCardDoctor } from '@/components/doctors/DoctorCard';
import { doctorsIndexUrl, fetchJson, specialtiesIndexUrl } from '@/api/publicApi';
import { useInfiniteResourceList } from '@/hooks/useInfiniteResourceList';

const PER_PAGE = 12;

export default function DoctorsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [specialties, setSpecialties] = useState<{ id: number | string; name?: string; slug?: string }[]>([]);

  const search = searchParams.get('search') || searchParams.get('q') || '';
  const district = searchParams.get('district') || searchParams.get('location') || '';
  const specialty = searchParams.get('specialty') || '';

  const urlForPage = useCallback(
    (page: number) =>
      doctorsIndexUrl({
        search: search || undefined,
        district: district || undefined,
        specialty: specialty || undefined,
        page,
        per_page: PER_PAGE,
        sort: 'name',
      }),
    [search, district, specialty],
  );

  const { rows, meta, loading, loadingMore, error, sentinelRef } = useInfiniteResourceList<DoctorCardDoctor>(urlForPage);
  const hasMore = meta && meta.current_page != null && meta.last_page != null && meta.current_page < meta.last_page;

  useEffect(() => {
    fetchJson<{ data: typeof specialties }>(specialtiesIndexUrl())
      .then((json) => setSpecialties(json.data || []))
      .catch(() => setSpecialties([]));
  }, []);

  function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    const s = fd.get('search')?.toString().trim();
    const d = fd.get('district')?.toString().trim();
    const sp = fd.get('specialty')?.toString().trim();
    if (s) next.set('search', s);
    if (d) next.set('district', d);
    if (sp) next.set('specialty', sp);
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }

  return (
    <ListingPageShell title="Find doctors" subtitle="Search published profiles by name, location, or specialty." filterLabels={[]}>
      <form onSubmit={applyFilters} className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="fd-search" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              Name or keyword
            </label>
            <input
              id="fd-search"
              name="search"
              defaultValue={search}
              placeholder="e.g. cardiology"
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div>
            <label htmlFor="fd-district" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              District / city
            </label>
            <input
              id="fd-district"
              name="district"
              defaultValue={district}
              placeholder="e.g. Kathmandu"
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div>
            <label htmlFor="fd-specialty" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              Specialty
            </label>
            <select
              id="fd-specialty"
              name="specialty"
              defaultValue={specialty}
              className="font-ui w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            >
              <option value="">All specialties</option>
              {specialties.map((sp) => (
                <option key={sp.id} value={sp.slug || String(sp.id)}>
                  {sp.name}
                </option>
              ))}
            </select>
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
          No doctors match your filters. Try adjusting search or location.
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
    </ListingPageShell>
  );
}
