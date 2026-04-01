'use client';

import { Suspense, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ListingPageShell from '@/components/layout/ListingPageShell';
import PharmacyCard from '@/components/directory/PharmacyCard';
import type { PharmacyCardPharmacy } from '@/components/directory/PharmacyCard';
import { pharmaciesIndexUrl } from '@/api/publicApi';
import { useInfiniteResourceList } from '@/hooks/useInfiniteResourceList';

const PER_PAGE = 12;

function PharmaciesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || searchParams.get('q') || '';
  const district = searchParams.get('district') || searchParams.get('location') || '';
  const delivery = searchParams.get('delivery') === '1';

  const urlForPage = useCallback(
    (page: number) =>
      pharmaciesIndexUrl({
        search: search || undefined,
        district: district || undefined,
        delivery: delivery || undefined,
        page,
        per_page: PER_PAGE,
      }),
    [search, district, delivery],
  );

  const { rows, meta, loading, loadingMore, error, sentinelRef } = useInfiniteResourceList<PharmacyCardPharmacy>(urlForPage);
  const hasMore = meta && meta.current_page != null && meta.last_page != null && meta.current_page < meta.last_page;

  function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    const s = fd.get('search')?.toString().trim();
    const d = fd.get('district')?.toString().trim();
    if (s) next.set('search', s);
    if (d) next.set('district', d);
    if (fd.get('delivery') === 'on') next.set('delivery', '1');
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }

  return (
    <ListingPageShell
      title="Pharmacies"
      subtitle="Retail and hospital pharmacies. Filter by location or home delivery."
      filterLabels={[]}
    >
      <form onSubmit={applyFilters} className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="ph-search" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              Name or keyword
            </label>
            <input
              id="ph-search"
              name="search"
              defaultValue={search}
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div>
            <label htmlFor="ph-district" className="font-ui mb-1 block text-xs font-medium text-slate-600">
              District / city
            </label>
            <input
              id="ph-district"
              name="district"
              defaultValue={district}
              className="font-ui w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="font-ui flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="delivery"
                defaultChecked={delivery}
                className="rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]"
              />
              Home delivery
            </label>
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
        <p className="font-ui py-12 text-center text-slate-500">Loading pharmacies…</p>
      ) : error && rows.length === 0 ? (
        <p className="font-ui rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-800">{error}</p>
      ) : rows.length === 0 ? (
        <p className="font-ui rounded-xl border border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-600">No pharmacies match your filters.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((p) => (
              <PharmacyCard key={p.slug} pharmacy={p} />
            ))}
          </div>
          {error && rows.length > 0 ? <p className="font-ui mt-4 text-center text-sm text-red-700">{error}</p> : null}
          <div ref={sentinelRef} className="h-px w-full" aria-hidden />
          {loadingMore ? <p className="font-ui py-8 text-center text-sm text-slate-500">Loading more pharmacies…</p> : null}
          {!loading && !loadingMore && rows.length > 0 && !hasMore ? (
            <p className="font-ui py-6 text-center text-xs text-slate-400">You’ve reached the end of the list.</p>
          ) : null}
        </>
      )}
    </ListingPageShell>
  );
}

export default function PharmaciesPage() {
  return (
    <Suspense fallback={<p className="font-ui py-12 text-center text-slate-500">Loading…</p>}>
      <PharmaciesPageContent />
    </Suspense>
  );
}
