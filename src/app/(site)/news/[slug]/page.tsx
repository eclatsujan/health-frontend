'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchJson, newsBySlugUrl, type HttpError } from '@/api/publicApi';
import { useAppName } from '@/hooks/useAppName';

function formatDate(iso: string | null | undefined) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const appName = useAppName();
  const [article, setArticle] = useState<{
    title?: string;
    excerpt?: string | null;
    published_at?: string | null;
    featured_image_url?: string | null;
    body?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetchJson<{ data: typeof article }>(newsBySlugUrl(slug))
      .then((json) => {
        if (!cancelled) setArticle(json.data);
      })
      .catch((e: unknown) => {
        if (!cancelled && (e as HttpError).status === 404) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} — ${appName}`;
    }
    return () => {
      document.title = appName;
    };
  }, [article?.title, appName]);

  if (!slug) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="font-ui text-slate-600">Invalid link.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#f8fafc] py-20 text-center">
        <p className="font-ui text-slate-600">Loading…</p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">News not found</h1>
        <Link href="/news" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
          ← Back to news
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-[#f8fafc] pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/news" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
          ← All news
        </Link>
        <header className="mt-6">
          <p className="font-ui text-xs font-semibold uppercase tracking-wide text-slate-500">{formatDate(article.published_at)}</p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{article.title}</h1>
          {article.excerpt ? <p className="font-ui mt-4 text-lg text-slate-600">{article.excerpt}</p> : null}
        </header>
        {article.featured_image_url ? (
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <img src={article.featured_image_url} alt="" className="w-full object-cover" />
          </div>
        ) : null}
        <div
          className="article-body font-ui mt-8 text-sm leading-relaxed text-slate-800 [&_a]:text-[#0d9488] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: article.body || '' }}
        />
      </div>
    </article>
  );
}
