'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageShell from '@/components/site/PageShell';
import { blogsIndexUrl, fetchJson } from '@/api/publicApi';

function formatDate(iso: string | null | undefined) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

type BlogRow = {
  id: number | string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  published_at?: string | null;
};

export default function BlogListPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<BlogRow[]>([]);
  const [meta, setMeta] = useState<{ last_page?: number; current_page?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchJson<{ data: BlogRow[]; meta?: { last_page?: number; current_page?: number } }>(blogsIndexUrl({ page, per_page: 9 }))
      .then((json) => {
        if (!cancelled) {
          setItems(json.data || []);
          setMeta(json.meta || null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load posts');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const lastPage = meta?.last_page ?? 1;

  return (
    <PageShell eyebrow="Blog" title="Health articles" subtitle="Stories, tips, and guidance from our network.">
      {error ? <p className="font-ui text-sm text-red-700">{error}</p> : null}
      {loading ? (
        <p className="font-ui text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-ui text-sm text-slate-600">No posts published yet.</p>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/blog/${encodeURIComponent(item.slug)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 transition hover:border-[#0d9488]/40 hover:bg-white hover:shadow-md"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    {item.featured_image_url ? (
                      <img
                        src={item.featured_image_url}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0d9488]/15 to-slate-200 text-sm text-[#0f766e]">
                        Article
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-slate-400">{formatDate(item.published_at)}</p>
                    <h2 className="font-display mt-1 text-lg font-bold text-slate-900 group-hover:text-[#0d9488]">{item.title}</h2>
                    {item.excerpt ? <p className="font-ui mt-2 line-clamp-3 text-sm text-slate-600">{item.excerpt}</p> : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {lastPage > 1 ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="font-ui rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="font-ui text-sm text-slate-600">
                Page {meta?.current_page ?? page} of {lastPage}
              </span>
              <button
                type="button"
                disabled={page >= lastPage}
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                className="font-ui rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
