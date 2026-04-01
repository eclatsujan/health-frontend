import {
  blogsIndexUrl,
  doctorsIndexUrl,
  hospitalsIndexUrl,
  newsIndexUrl,
} from '@/api/publicApi';
import { DIRECTORY_FETCH_LIMIT } from '@/lib/homePreview';
import { getSiteOrigin } from '@/lib/siteOrigin';

// const HOME_CACHE_TAG = 'home';

/** Keep well under Next’s static generation timeout when the API is down during `next build`. */
const FETCH_TIMEOUT_MS = 10_000;

type Paginated<T> = { data?: T[] };

async function serverFetchJson<T>(path: string): Promise<T> {
  const url = `${getSiteOrigin()}${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    // next: { revalidate: HOME_REVALIDATE_SECONDS, tags: [HOME_CACHE_TAG] },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

async function safeFetch<T extends Paginated<unknown>>(
  path: string,
): Promise<T> {
  try {
    return await serverFetchJson<T>(path);
  } catch {
    return { data: [] } as unknown as T;
  }
}

/**
 * ISR-backed data for the home page. Passed into client components as TanStack Query `initialData`.
 */
export async function getHomePageInitialData() {
  try{
    const [docRes, hospRes, blogRes, newsRes] = await Promise.all([
      safeFetch<Paginated<unknown>>(
        doctorsIndexUrl({
          page: 1,
          per_page: DIRECTORY_FETCH_LIMIT,
          sort: 'name',
        }),
      ),
      safeFetch<Paginated<unknown>>(
        hospitalsIndexUrl({
          page: 1,
          per_page: DIRECTORY_FETCH_LIMIT,
        }),
      ),
      safeFetch<Paginated<unknown>>(blogsIndexUrl({ per_page: 5 })),
      safeFetch<Paginated<unknown>>(newsIndexUrl({ per_page: 5 })),
    ]);
    
    return {
      doctorsRaw: docRes.data ?? [],
      hospitalsRaw: hospRes.data ?? [],
      blogs: blogRes.data ?? [],
      news: newsRes.data ?? [],
    };
  }catch(error){
    console.error(error);
    return {
      doctorsRaw: [],
      hospitalsRaw: [],
      blogs: [],
      news: [],
    };
  }
}
