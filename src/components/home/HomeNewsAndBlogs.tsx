'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { blogsIndexUrl, fetchJson, newsIndexUrl } from '@/api/publicApi';
import { HOME_REVALIDATE_SECONDS } from '@/lib/homeConstants';
import { useCallback, useState } from 'react';

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

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  published_at?: string | null;
};

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
      className="group flex-none w-[320px] flex flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition hover:border-primary-container/30 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-container-low">
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
                ? 'bg-gradient-to-br from-primary-container/20 to-surface-container-high text-primary-container'
                : 'bg-gradient-to-br from-slate-600/20 to-surface-container-high text-on-surface-variant'
            }`}
          >
            {kind === 'blog' ? 'Blog' : 'News'}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
          {dateLabel}
        </p>
        <h3 className="font-headline mt-1 line-clamp-2 text-base font-bold text-on-surface group-hover:text-primary-container">
          {title}
        </h3>
        {excerpt ? (
          <p className="font-body mt-2 line-clamp-3 flex-1 text-sm text-on-surface-variant">
            {excerpt}
          </p>
        ) : null}
        <span className="font-body mt-3 text-sm font-semibold text-primary-container">
          Read more →
        </span>
      </div>
    </Link>
  );
}

const staleMs = HOME_REVALIDATE_SECONDS * 1000;

export default function HomeNewsAndBlogs({
  initialBlogs,
  initialNews,
}: {
  initialBlogs: unknown[];
  initialNews: unknown[];
}) {
  const [initialBlogsData] = useState(() => initialBlogs as ArticleRow[]);
  const [initialNewsData] = useState(() => initialNews as ArticleRow[]);

  const fetchBlogs = useCallback(async () => {
    const res = await fetchJson<{ data?: unknown[] }>(
      blogsIndexUrl({ per_page: 5 }),
    ).catch(() => ({ data: [] }));
    return (res?.data ?? []) as ArticleRow[];
  }, []);

  const fetchNews = useCallback(async () => {
    const res = await fetchJson<{ data?: unknown[] }>(
      newsIndexUrl({ per_page: 5 }),
    ).catch(() => ({ data: [] }));
    return (res?.data ?? []) as ArticleRow[];
  }, []);

  const blogsQuery = useQuery({
    queryKey: ['home', 'blogs'],
    queryFn: fetchBlogs,
    initialData: initialBlogsData,
    staleTime: staleMs,
    refetchOnMount: false,
    retry: 1,
  });

  const newsQuery = useQuery({
    queryKey: ['home', 'news'],
    queryFn: fetchNews,
    initialData: initialNewsData,
    staleTime: staleMs,
    refetchOnMount: false,
    retry: 1,
  });

  const loading =
    blogsQuery.isPending ||
    newsQuery.isPending ||
    blogsQuery.isLoading ||
    newsQuery.isLoading;

  const blogs = blogsQuery.data ?? [];
  const news = newsQuery.data ?? [];

  if (loading) {
    return (
      <section className="border-t border-outline-variant/20 bg-surface-container-low py-12 sm:py-14">
        <div className="mx-auto w-[90%] max-w-8xl px-0 sm:px-4">
          <p className="font-body text-center text-sm text-on-surface-variant">
            Loading articles...
          </p>
        </div>
      </section>
    );
  }

  if (blogs.length === 0 && news.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-outline-variant/20 bg-surface-container-low py-12 sm:py-16">
      <div className="mx-auto w-[90%] max-w-8xl px-0 sm:px-4">
        {blogs.length > 0 ? (
          <div className={news.length > 0 ? 'mb-14 sm:mb-16' : ''}>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">
                  Health blog
                </h2>
                <p className="font-body mt-2 max-w-2xl text-sm text-on-surface-variant">
                  Tips, stories, and guidance from our care network.
                </p>
              </div>
              <Link
                href="/blog"
                className="font-body shrink-0 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface shadow-sm transition hover:border-primary-container/40 hover:text-primary-container"
              >
                View all posts
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                <h2 className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">
                  News & updates
                </h2>
                <p className="font-body mt-2 max-w-2xl text-sm text-on-surface-variant">
                  Announcements, partnerships, and community updates.
                </p>
              </div>
              <Link
                href="/news"
                className="font-body shrink-0 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface shadow-sm transition hover:border-primary-container/40 hover:text-primary-container"
              >
                View all news
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
