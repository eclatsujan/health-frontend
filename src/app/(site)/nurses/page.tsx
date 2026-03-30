'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ListingPageShell from '@/components/layout/ListingPageShell';
import NurseCard from '@/components/directory/NurseCard';
import type { NurseCardNurse } from '@/components/directory/NurseCard';
import { fetchJson, nursesIndexUrl, specialtiesIndexUrl } from '@/api/publicApi';
import { useInfiniteResourceList } from '@/hooks/useInfiniteResourceList';

const PER_PAGE = 12;

export default function NursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [specialties, setSpecialties] = useState<{ id: number | string; name?: string; slug?: string }[]>([]);

  const search = searchParams.get('search') || searchParams.get('q') || '';
  const district = searchParams.get('district') || searchParams.get('location') || '';
  const specialty = searchParams.get('specialty') || '';

  const urlForPage = useCallback(
    (page: number) =>
      nursesIndexUrl({
        search: search || undefined,
        district: district || undefined,
        specialty: specialty || undefined,
        page,
        per_page: PER_PAGE,
        sort: 'name',
      }),
    [search, district, specialty],
  );

  const { rows, meta, loading, loadingMore, error, sentinelRef } = useInfiniteResourceList<NurseCardNurse>(urlForPage);
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
    <ListingPageShell title="Nurses" subtitle="Find published nursing profiles by name, location, or specialty." filterLabels={[]}>
      <form onSubmit={applyFilters} className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="nv-search" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              Name or keyword
            </label>
            <input
              id="nv-search"
              name="search"
              defaultValue={search}
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div>
            <label htmlFor="nv-district" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              District / city
            </label>
            <input
              id="nv-district"
              name="district"
              defaultValue={district}
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div>
            <label htmlFor="nv-specialty" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              Specialty
            </label>
            <select
              id="nv-specialty"
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
        <p className="font-ui py-12 text-center text-slate-500">Loading nurses…</p>
      ) : error && rows.length === 0 ? (
        <p className="font-ui rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-800">{error}</p>
      ) : rows.length === 0 ? (
        <p className="font-ui rounded-xl border border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-600">No nurses match your filters.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((n) => (
              <NurseCard key={String(n.id)} nurse={n} />
            ))}
          </div>
          {error && rows.length > 0 ? <p className="font-ui mt-4 text-center text-sm text-red-700">{error}</p> : null}
          <div ref={sentinelRef} className="h-px w-full" aria-hidden />
          {loadingMore ? <p className="font-ui py-8 text-center text-sm text-slate-500">Loading more nurses…</p> : null}
          {!loading && !loadingMore && rows.length > 0 && !hasMore ? (
            <p className="font-ui py-6 text-center text-xs text-slate-400">You’ve reached the end of the list.</p>
          ) : null}
        </>
      )}
    </ListingPageShell>
  );
}
