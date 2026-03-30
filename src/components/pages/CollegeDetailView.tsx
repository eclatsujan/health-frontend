'use client';
// @ts-nocheck

import { useEffect } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { collegeBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';

export default function CollegeDetailView({ slug }: { slug: string }) {
    const appName = useAppName();
    const { data: c, loading, notFound, loadError } = usePublicSlugResource(collegeBySlugUrl(slug));

    useEffect(() => {
        if (c?.name) {
            document.title = `${c.name} — ${appName}`;
        }
        return () => {
            document.title = appName;
        };
    }, [c, appName]);

    if (loading) {
        return (
            <div className="bg-[#f8fafc] py-20 text-center">
                <p className="font-ui text-slate-600">Loading college…</p>
            </div>
        );
    }

    if (loadError && !notFound) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <p className="font-ui text-red-700">{loadError}</p>
                <Link href="/colleges" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
                    Back to colleges
                </Link>
            </div>
        );
    }

    if (notFound || !c) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <h1 className="font-display text-2xl font-bold text-slate-900">College not found</h1>
                <Link href="/colleges" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
                    Back to colleges
                </Link>
            </div>
        );
    }

    const hospitals = c.hospitals || [];

    return (
        <article className="bg-[#f8fafc] pb-16">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900">{c.name}</h1>
                        <p className="font-ui mt-2 text-slate-600">{[c.city, c.district].filter(Boolean).join(', ')}</p>
                        {c.average_rating != null ? (
                            <div className="mt-4 flex items-center gap-2">
                                <Stars value={c.average_rating} />
                                <span className="font-ui text-sm font-semibold">{Number(c.average_rating).toFixed(1)}</span>
                            </div>
                        ) : null}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:w-72">
                        {c.phone ? (
                            <a href={`tel:${c.phone}`} className="font-ui block w-full rounded-lg bg-[#0d9488] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0f766e]">
                                Call {c.phone}
                            </a>
                        ) : null}
                        {c.website ? (
                            <a href={c.website} target="_blank" rel="noopener noreferrer" className="font-ui mt-3 block text-center text-sm text-[#0d9488] hover:underline">
                                Website
                            </a>
                        ) : null}
                    </div>
                </div>

                {c.description ? (
                    <section className="mt-10">
                        <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">About</h2>
                        <div className="font-ui mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{c.description}</div>
                    </section>
                ) : null}

                {hospitals.length > 0 ? (
                    <section className="mt-10">
                        <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Affiliated hospitals</h2>
                        <ul className="mt-4 space-y-2">
                            {hospitals.map((h) => (
                                <li key={h.id}>
                                    <Link href={`/hospitals/${h.slug}`} className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                                        {h.name}
                                    </Link>
                                    {h.district ? <span className="font-ui text-slate-500"> — {h.district}</span> : null}
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                <section className="mt-10">
                    <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Address</h2>
                    <p className="font-ui mt-4 text-sm text-slate-700">
                        {[c.address_line1, c.address_line2, c.municipality, c.district, c.province].filter(Boolean).join(', ')}
                    </p>
                </section>

                <p className="mt-12 text-center">
                    <Link href="/colleges" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                        ← All colleges
                    </Link>
                </p>
            </div>
        </article>
    );
}
