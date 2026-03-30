'use client';
// @ts-nocheck

import { useEffect } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { laboratoryBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';

export default function LaboratoryDetailView({ slug }: { slug: string }) {
    const appName = useAppName();
    const { data: lab, loading, notFound, loadError } = usePublicSlugResource(laboratoryBySlugUrl(slug));

    useEffect(() => {
        if (lab?.name) {
            document.title = `${lab.name} — ${appName}`;
        }
        return () => {
            document.title = appName;
        };
    }, [lab, appName]);

    if (loading) {
        return (
            <div className="bg-[#f8fafc] py-20 text-center">
                <p className="font-ui text-slate-600">Loading laboratory…</p>
            </div>
        );
    }

    if (loadError && !notFound) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <p className="font-ui text-red-700">{loadError}</p>
                <Link href="/labs" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
                    Back to laboratories
                </Link>
            </div>
        );
    }

    if (notFound || !lab) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <h1 className="font-display text-2xl font-bold text-slate-900">Laboratory not found</h1>
                <Link href="/labs" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
                    Back to laboratories
                </Link>
            </div>
        );
    }

    const hospitals = lab.hospitals || [];
    const branches = lab.branches || [];
    const parent = lab.parent;

    return (
        <article className="bg-[#f8fafc] pb-16">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                {parent?.slug ? (
                    <p className="font-ui text-sm text-slate-600">
                        Part of{' '}
                        <Link href={`/labs/${parent.slug}`} className="font-medium text-[#0d9488] hover:underline">
                            {parent.name}
                        </Link>
                    </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900">{lab.name}</h1>
                        <p className="font-ui mt-2 text-slate-600">{[lab.city, lab.district].filter(Boolean).join(', ')}</p>
                        {lab.home_sample_collection ? (
                            <p className="font-ui mt-2 text-sm text-[#0d9488]">Home sample collection available</p>
                        ) : null}
                        {lab.average_rating != null ? (
                            <div className="mt-4 flex items-center gap-2">
                                <Stars value={lab.average_rating} />
                                <span className="font-ui text-sm font-semibold">{Number(lab.average_rating).toFixed(1)}</span>
                            </div>
                        ) : null}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:w-72">
                        {lab.phone ? (
                            <a href={`tel:${lab.phone}`} className="font-ui block w-full rounded-lg bg-[#0d9488] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0f766e]">
                                Call {lab.phone}
                            </a>
                        ) : null}
                        {lab.website ? (
                            <a href={lab.website} target="_blank" rel="noopener noreferrer" className="font-ui mt-3 block text-center text-sm text-[#0d9488] hover:underline">
                                Website
                            </a>
                        ) : null}
                    </div>
                </div>

                {lab.description ? (
                    <section className="mt-10">
                        <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">About</h2>
                        <div className="font-ui mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{lab.description}</div>
                    </section>
                ) : null}

                {branches.length > 0 ? (
                    <section className="mt-10">
                        <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Branches</h2>
                        <ul className="mt-4 space-y-2">
                            {branches.map((b) => (
                                <li key={b.id}>
                                    <Link href={`/labs/${b.slug}`} className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                                        {b.name}
                                    </Link>
                                    {b.district ? <span className="font-ui text-slate-500"> — {b.district}</span> : null}
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                {hospitals.length > 0 ? (
                    <section className="mt-10">
                        <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Hospitals</h2>
                        <ul className="mt-4 space-y-2">
                            {hospitals.map((h) => (
                                <li key={h.id}>
                                    <Link href={`/hospitals/${h.slug}`} className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                                        {h.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                <section className="mt-10">
                    <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Address</h2>
                    <p className="font-ui mt-4 text-sm text-slate-700">
                        {[lab.address_line1, lab.address_line2, lab.municipality, lab.district, lab.province].filter(Boolean).join(', ')}
                    </p>
                </section>

                <p className="mt-12 text-center">
                    <Link href="/labs" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                        ← All laboratories
                    </Link>
                </p>
            </div>
        </article>
    );
}
