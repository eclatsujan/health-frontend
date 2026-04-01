import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchJson } from '@/api/publicApi';

type ListMeta = {
  current_page?: number;
  last_page?: number;
};

type ListResponse<T> = {
  data?: T[];
  meta?: ListMeta | null;
};

/**
 * Infinite scroll list: first page replaces rows; later pages append.
 */
export function useInfiniteResourceList<T = Record<string, unknown>>(urlForPage: (page: number) => string) {
  const [rows, setRows] = useState<T[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchJson<ListResponse<T>>(urlForPage(1));
      setRows(json.data ?? []);
      setMeta(json.meta ?? null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load';
      setError(msg);
      setRows([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [urlForPage]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore) return;
    const current = meta?.current_page ?? 0;
    const last = meta?.last_page ?? 0;
    if (!meta || current >= last) return;

    setLoadingMore(true);
    try {
      const nextPage = current + 1;
      const json = await fetchJson<ListResponse<T>>(urlForPage(nextPage));
      setRows((prev) => [...prev, ...(json.data ?? [])]);
      setMeta(json.meta ?? null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load more';
      setError(msg);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, meta, urlForPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root: null, rootMargin: '240px', threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return { rows, meta, loading, loadingMore, error, sentinelRef, loadMore };
}
