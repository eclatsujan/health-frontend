import { useEffect, useState } from 'react';
import { fetchJson, type HttpError } from '@/api/publicApi';

/**
 * Load a single public JSON:API-style resource by URL (e.g. …/slug/{slug}).
 */
export function usePublicSlugResource<T = unknown>(url: string | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setData(null);
      setNotFound(false);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setLoadError(null);
    fetchJson<{ data: T }>(url)
      .then((json) => {
        if (!cancelled) {
          setData(json.data);
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const err = e as HttpError;
        if (err.status === 404) setNotFound(true);
        else setLoadError(err.message || 'Could not load');
        setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, notFound, loadError };
}
