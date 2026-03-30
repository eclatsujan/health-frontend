'use client';
// @ts-nocheck

import { useEffect } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { pharmacyBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';

export default function PharmacyDetailView({ slug }: { slug: string }) {
    const appName = useAppName();
    const { data: p, loading, notFound, loadError } = usePublicSlugResource(pharmacyBySlugUrl(slug));

    useEffect(() => {
        if (p?.name) {
            document.title = `${p.name} — ${appName}`;
        }
        return () => {
            document.title = appName;
        };
    }, [p, appName]);

    if (loading) {
        return (
            <div className="bg-[#f8fafc] py-20 text-center">
                <p className="font-ui text-slate-600">Loading pharmacy…</p>
            </div>
        );
    }

    if (loadError && !notFound) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <p className="font-ui text-red-700">{loadError}</p>
                <Link href="/pharmacies" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
                    Back to pharmacies
                </Link>
            </div>
        );
    }

    if (notFound || !p) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <h1 className="font-display text-2xl font-bold text-slate-900">Pharmacy not found</h1>
                <Link href="/pharmacies" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
                    Back to pharmacies
                </Link>
            </div>
        );
    }

    return (
        <article className="bg-[#f8fafc] pb-16">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900">{p.name}</h1>
                        <p className="font-ui mt-2 text-slate-600">
                            {[p.city, p.district].filter(Boolean).join(', ')}
                            {p.home_delivery_available ? ' · Home delivery' : ''}
                            {p.is_24_hours ? ' · 24 hours' : ''}
                        </p>
                        {p.average_rating != null ? (
                            <div className="mt-4 flex items-center gap-2">
                                <Stars value={p.average_rating} />
                                <span className="font-ui text-sm font-semibold">{Number(p.average_rating).toFixed(1)}</span>
                            </div>
                        ) : null}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:w-72">
                        {p.phone ? (
                            <a href={`tel:${p.phone}`} className="font-ui block w-full rounded-lg bg-[#0d9488] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0f766e]">
                                Call {p.phone}
                            </a>
                        ) : null}
                        {p.website ? (
                            <a href={p.website} target="_blank" rel="noopener noreferrer" className="font-ui mt-3 block text-center text-sm text-[#0d9488] hover:underline">
                                Website
                            </a>
                        ) : null}
                    </div>
                </div>

                {p.description ? (
                    <section className="mt-10">
                        <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">About</h2>
                        <div className="font-ui mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{p.description}</div>
                    </section>
                ) : null}

                <section className="mt-10">
                    <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Address</h2>
                    <p className="font-ui mt-4 text-sm text-slate-700">
                        {[p.address_line1, p.address_line2, p.municipality, p.district, p.province].filter(Boolean).join(', ')}
                    </p>
                </section>

                {p.opening_hours && typeof p.opening_hours === 'object' ? (
                    <section className="mt-10">
                        <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Opening hours</h2>
                        <pre className="font-ui mt-4 overflow-x-auto rounded-lg bg-slate-100 p-4 text-xs text-slate-700">
                            {JSON.stringify(p.opening_hours, null, 2)}
                        </pre>
                    </section>
                ) : null}

                <p className="mt-12 text-center">
                    <Link href="/pharmacies" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                        ← All pharmacies
                    </Link>
                </p>
            </div>
        </article>
    );
}
