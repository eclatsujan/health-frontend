/**
 * Public JSON API (same origin). Base path /api/v1
 */
const BASE = '/api/v1';

export type HttpError = Error & {
  status: number;
  errors?: Record<string, string[] | string>;
};

export async function postJson(url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const err = new Error(`HTTP ${res.status}`) as HttpError;
  err.status = res.status;
  let data: unknown = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const obj = data as {
      message?: string;
      errors?: Record<string, string[] | string>;
    } | null;
    if (obj?.message) err.message = obj.message;
    if (obj?.errors) err.errors = obj.errors;
    throw err;
  }
  return data ?? {};
}

export async function fetchJson<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`) as HttpError;
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

function withQuery(
  path: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (typeof v === 'boolean') {
      if (v) q.set(key, '1');
      return;
    }
    q.set(key, String(v));
  });
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

export function doctorsIndexUrl(params: {
  search?: string;
  district?: string;
  specialty?: string;
  specialty_id?: number;
  sort?: string;
  page?: number;
  per_page?: number;
}) {
  return withQuery(`${BASE}/doctors`, {
    search: params.search,
    district: params.district,
    specialty: params.specialty,
    specialty_id: params.specialty_id,
    sort: params.sort,
    page: params.page,
    per_page: params.per_page,
  });
}

export function doctorBySlugUrl(slug: string) {
  return `${BASE}/doctors/slug/${encodeURIComponent(slug)}`;
}

export function doctorConnectUrl(slug: string) {
  return `${BASE}/doctors/slug/${encodeURIComponent(slug)}/connect`;
}

export function directoryReviewsIndexUrl(
  resource:
    | 'doctors'
    | 'hospitals'
    | 'nurses'
    | 'pharmacies'
    | 'laboratories'
    | 'colleges',
  slug: string,
  params: { page?: number; per_page?: number } = {},
) {
  return withQuery(
    `${BASE}/${resource}/slug/${encodeURIComponent(slug)}/reviews`,
    {
      page: params.page,
      per_page: params.per_page,
    },
  );
}

export function directoryReviewsStoreUrl(
  resource:
    | 'doctors'
    | 'hospitals'
    | 'nurses'
    | 'pharmacies'
    | 'laboratories'
    | 'colleges',
  slug: string,
) {
  return `${BASE}/${resource}/slug/${encodeURIComponent(slug)}/reviews`;
}

export function doctorReviewsIndexUrl(
  slug: string,
  params: { page?: number; per_page?: number } = {},
) {
  return directoryReviewsIndexUrl('doctors', slug, params);
}

export function doctorReviewsStoreUrl(slug: string) {
  return directoryReviewsStoreUrl('doctors', slug);
}

export function hospitalsIndexUrl(params: {
  search?: string;
  district?: string;
  type?: string;
  page?: number;
  per_page?: number;
}) {
  return withQuery(`${BASE}/hospitals`, {
    search: params.search,
    district: params.district,
    type: params.type,
    page: params.page,
    per_page: params.per_page,
  });
}

export function hospitalBySlugUrl(slug: string) {
  return `${BASE}/hospitals/slug/${encodeURIComponent(slug)}`;
}

export function nursesIndexUrl(params: {
  search?: string;
  district?: string;
  specialty?: string;
  specialty_id?: number;
  sort?: string;
  page?: number;
  per_page?: number;
}) {
  return withQuery(`${BASE}/nurses`, {
    search: params.search,
    district: params.district,
    specialty: params.specialty,
    specialty_id: params.specialty_id,
    sort: params.sort,
    page: params.page,
    per_page: params.per_page,
  });
}

export function nurseBySlugUrl(slug: string) {
  return `${BASE}/nurses/slug/${encodeURIComponent(slug)}`;
}

export function pharmaciesIndexUrl(params: {
  search?: string;
  district?: string;
  delivery?: boolean;
  page?: number;
  per_page?: number;
}) {
  return withQuery(`${BASE}/pharmacies`, {
    search: params.search,
    district: params.district,
    delivery: params.delivery,
    page: params.page,
    per_page: params.per_page,
  });
}

export function pharmacyBySlugUrl(slug: string) {
  return `${BASE}/pharmacies/slug/${encodeURIComponent(slug)}`;
}

export function laboratoriesIndexUrl(params: {
  search?: string;
  district?: string;
  roots_only?: boolean;
  page?: number;
  per_page?: number;
}) {
  return withQuery(`${BASE}/laboratories`, {
    search: params.search,
    district: params.district,
    roots_only: params.roots_only,
    page: params.page,
    per_page: params.per_page,
  });
}

export function laboratoryBySlugUrl(slug: string) {
  return `${BASE}/laboratories/slug/${encodeURIComponent(slug)}`;
}

export function collegesIndexUrl(params: {
  search?: string;
  district?: string;
  page?: number;
  per_page?: number;
}) {
  return withQuery(`${BASE}/colleges`, {
    search: params.search,
    district: params.district,
    page: params.page,
    per_page: params.per_page,
  });
}

export function collegeBySlugUrl(slug: string) {
  return `${BASE}/colleges/slug/${encodeURIComponent(slug)}`;
}

export function specialtiesIndexUrl() {
  return `${BASE}/specialties`;
}

export function specialtyBySlugUrl(slug: string) {
  return `${BASE}/specialties/slug/${encodeURIComponent(slug)}`;
}

export function blogsIndexUrl(
  params: { page?: number; per_page?: number } = {},
) {
  return withQuery(`${BASE}/blogs`, {
    page: params.page,
    per_page: params.per_page,
  });
}

export function blogBySlugUrl(slug: string) {
  return `${BASE}/blogs/slug/${encodeURIComponent(slug)}`;
}

export function newsIndexUrl(
  params: { page?: number; per_page?: number } = {},
) {
  return withQuery(`${BASE}/news`, {
    page: params.page,
    per_page: params.per_page,
  });
}

export function newsBySlugUrl(slug: string) {
  return `${BASE}/news/slug/${encodeURIComponent(slug)}`;
}
