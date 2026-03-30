'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { blogsIndexUrl, fetchJson, newsIndexUrl } from '@/api/publicApi';

function formatDate(iso: string | null | undefined): string {
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

type ArticleItem = {
  id: number | string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  published_at?: string | null;
};

type IndexResponse = { data?: ArticleItem[] };

function ArticleCard({
  href,
  title,
  excerpt,
  imageUrl,
  dateLabel,
  kind,
}: {
  href: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  dateLabel: string;
  kind: 'blog' | 'news';
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[#0d9488]/35 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center text-sm font-medium ${
              kind === 'blog'
                ? 'bg-gradient-to-br from-[#0d9488]/20 to-slate-200 text-[#0f766e]'
                : 'bg-gradient-to-br from-slate-600/20 to-slate-200 text-slate-600'
            }`}
          >
            {kind === 'blog' ? 'Blog' : 'News'}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {dateLabel}
        </p>
        <h3 className="font-display mt-1 line-clamp-2 text-base font-bold text-slate-900 group-hover:text-[#0d9488]">
          {title}
        </h3>
        {excerpt ? (
          <p className="font-ui mt-2 line-clamp-3 flex-1 text-sm text-slate-600">
            {excerpt}
          </p>
        ) : null}
        <span className="font-ui mt-3 text-sm font-semibold text-[#0d9488]">
          Read more →
        </span>
      </div>
    </Link>
  );
}

export default function HomeNewsAndBlogs() {
  const [blogs, setBlogs] = useState<ArticleItem[]>([]);
  const [news, setNews] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchJson<IndexResponse>(blogsIndexUrl({ per_page: 3 })).catch(() => ({
        data: [],
      })),
      fetchJson<IndexResponse>(newsIndexUrl({ per_page: 3 })).catch(() => ({
        data: [],
      })),
    ])
      .then(([b, n]) => {
        if (!cancelled) {
          setBlogs(b.data ?? []);
          setNews(n.data ?? []);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="border-t border-slate-200 bg-[#f8fafc] py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-ui text-center text-sm text-slate-500">
            Loading articles…
          </p>
        </div>
      </section>
    );
  }

  if (blogs.length === 0 && news.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-200 bg-[#f8fafc] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {blogs.length > 0 ? (
          <div className={news.length > 0 ? 'mb-14 sm:mb-16' : ''}>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  Health blog
                </h2>
                <p className="font-ui mt-2 max-w-2xl text-sm text-slate-600">
                  Tips, stories, and guidance from our care network.
                </p>
              </div>
              <Link
                href="/blog"
                className="font-ui shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0d9488]/40 hover:text-[#0d9488]"
              >
                View all posts
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((item) => (
                <ArticleCard
                  key={item.id}
                  href={`/blog/${encodeURIComponent(item.slug)}`}
                  title={item.title}
                  excerpt={item.excerpt}
                  imageUrl={item.featured_image_url}
                  dateLabel={formatDate(item.published_at)}
                  kind="blog"
                />
              ))}
            </div>
          </div>
        ) : null}

        {news.length > 0 ? (
          <div>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  News & updates
                </h2>
                <p className="font-ui mt-2 max-w-2xl text-sm text-slate-600">
                  Announcements, partnerships, and community updates.
                </p>
              </div>
              <Link
                href="/news"
                className="font-ui shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0d9488]/40 hover:text-[#0d9488]"
              >
                View all news
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <ArticleCard
                  key={item.id}
                  href={`/news/${encodeURIComponent(item.slug)}`}
                  title={item.title}
                  excerpt={item.excerpt}
                  imageUrl={item.featured_image_url}
                  dateLabel={formatDate(item.published_at)}
                  kind="news"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
