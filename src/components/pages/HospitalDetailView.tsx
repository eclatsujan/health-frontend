'use client';
// @ts-nocheck

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { hospitalBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';

export default function HospitalDetailView({ slug }: { slug: string }) {
    const appName = useAppName();
    const { data: h, loading, notFound, loadError } = usePublicSlugResource(hospitalBySlugUrl(slug));

    useEffect(() => {
        if (h?.name) {
            document.title = `${h.name} — ${appName}`;
        }
        return () => {
            document.title = appName;
        };
    }, [h, appName]);

    if (loading) {
        return (
            <div className="bg-[#f8fafc] py-20 text-center">
                <p className="font-ui text-slate-600">Loading hospital…</p>
            </div>
        );
    }

    if (loadError && !notFound) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <p className="font-ui text-red-700">{loadError}</p>
                <Link href="/hospitals" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
                    Back to hospitals
                </Link>
            </div>
        );
    }

    if (notFound || !h) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <h1 className="font-display text-2xl font-bold text-slate-900">Hospital not found</h1>
                <Link href="/hospitals" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
                    Back to hospitals
                </Link>
            </div>
        );
    }

    const cover = h.cover_image_url;
    const photo = h.profile_photo_url;
    const doctors = h.doctors || [];
    const lines = h.phone_lines || [];

    return (
        <HospitalDetailBody
            h={h}
            cover={cover}
            photo={photo}
            doctors={doctors}
            lines={lines}
        />
    );
}

function HospitalDetailBody({ h, cover, photo, doctors, lines }) {
    const [activeSpecialtyTab, setActiveSpecialtyTab] = useState('all');

    useEffect(() => {
        setActiveSpecialtyTab('all');
    }, [h.id]);

    const specialtyTabs = useMemo(() => {
        const byId = new Map();
        doctors.forEach((d) => {
            (d.specialties || []).forEach((s) => {
                if (s?.id != null && !byId.has(s.id)) {
                    byId.set(s.id, s);
                }
            });
        });
        return Array.from(byId.values()).sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        if (activeSpecialtyTab === 'all') {
            return doctors;
        }
        return doctors.filter((d) =>
            (d.specialties || []).some((s) => (s.slug || String(s.id)) === activeSpecialtyTab),
        );
    }, [doctors, activeSpecialtyTab]);

    const showSpecialtyTabs = specialtyTabs.length > 0;

    return (
        <article className="bg-[#f8fafc] pb-16">
            <div className="relative h-44 w-full overflow-hidden bg-slate-200 sm:h-56 md:h-64">
                {cover ? (
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-600/50 to-slate-800/60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="relative -mt-14 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                    <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left lg:flex-row lg:gap-6">
                        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg ring-2 ring-slate-100 sm:h-32 sm:w-32">
                            {photo ? (
                                <img src={photo} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-3xl font-bold text-slate-600">
                                    {(h.name?.[0] || 'H').toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 min-w-0 flex-1 lg:mt-10">
                            {h.is_partner ? (
                                <span className="inline-block rounded-md bg-[#0d9488]/10 px-2 py-0.5 text-xs font-semibold uppercase text-[#0f766e]">Partner</span>
                            ) : null}
                            <h1 className="font-display mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{h.name}</h1>
                            <p className="font-ui mt-1 text-slate-600">
                                {h.type || 'Hospital'}
                                {h.city || h.district ? ` · ${[h.city, h.district].filter(Boolean).join(', ')}` : ''}
                            </p>
                            {h.average_rating != null ? (
                                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    <Stars value={h.average_rating} />
                                    <span className="font-ui text-sm font-semibold">{Number(h.average_rating).toFixed(1)}</span>
                                    {h.reviews_count != null ? (
                                        <span className="font-ui text-sm text-slate-500">({h.reviews_count} reviews)</span>
                                    ) : null}
                                </div>
                            ) : null}
                            {h.is_trauma_center ? (
                                <span className="font-ui mt-2 inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">Trauma center</span>
                            ) : null}
                        </div>
                    </div>

                    <aside className="w-full shrink-0 lg:w-72 lg:pt-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
                            <p className="font-ui text-sm font-semibold text-slate-900">Contact</p>
                            {h.phone ? (
                                <a href={`tel:${h.phone}`} className="font-ui mt-3 block w-full rounded-lg bg-[#0d9488] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0f766e]">
                                    {h.phone}
                                </a>
                            ) : null}
                            {h.emergency_phone ? (
                                <p className="font-ui mt-2 text-center text-xs text-red-700">
                                    Emergency:{' '}
                                    <a href={`tel:${h.emergency_phone}`} className="font-semibold underline">
                                        {h.emergency_phone}
                                    </a>
                                </p>
                            ) : null}
                            {h.website ? (
                                <a
                                    href={h.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-ui mt-3 block text-center text-sm text-[#0d9488] hover:underline"
                                >
                                    Website
                                </a>
                            ) : null}
                        </div>
                    </aside>
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        {h.description ? (
                            <section>
                                <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">About</h2>
                                <div className="font-ui mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{h.description}</div>
                            </section>
                        ) : null}

                        {lines.length > 0 ? (
                            <section>
                                <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Phone lines</h2>
                                <ul className="mt-4 space-y-2">
                                    {lines.map((line) => (
                                        <li key={line.id || line.label} className="font-ui text-sm text-slate-700">
                                            <span className="font-semibold">{line.label}</span>
                                            {Array.isArray(line.numbers) ? `: ${line.numbers.join(', ')}` : null}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ) : null}

                        {doctors.length > 0 ? (
                            <section aria-labelledby="hospital-doctors-heading">
                                <h2
                                    id="hospital-doctors-heading"
                                    className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900"
                                >
                                    Doctors at this hospital
                                </h2>

                                {showSpecialtyTabs ? (
                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="font-ui text-xs text-slate-500">Filter by specialty</p>
                                        <nav className="flex flex-wrap gap-2" aria-label="Filter doctors by specialty">
                                            <button
                                                type="button"
                                                onClick={() => setActiveSpecialtyTab('all')}
                                                className={[
                                                    'font-ui rounded-full px-3 py-1.5 text-xs font-semibold transition',
                                                    activeSpecialtyTab === 'all'
                                                        ? 'bg-[#0d9488] text-white'
                                                        : 'border border-slate-200 bg-white text-slate-700 hover:border-[#0d9488]/40',
                                                ].join(' ')}
                                            >
                                                All ({doctors.length})
                                            </button>
                                            {specialtyTabs.map((s) => {
                                                const key = s.slug || String(s.id);
                                                const count = doctors.filter((d) =>
                                                    (d.specialties || []).some((sp) => (sp.slug || String(sp.id)) === key),
                                                ).length;
                                                return (
                                                    <button
                                                        key={s.id}
                                                        type="button"
                                                        onClick={() => setActiveSpecialtyTab(key)}
                                                        className={[
                                                            'font-ui rounded-full px-3 py-1.5 text-xs font-semibold transition',
                                                            activeSpecialtyTab === key
                                                                ? 'bg-[#0d9488] text-white'
                                                                : 'border border-slate-200 bg-white text-slate-700 hover:border-[#0d9488]/40',
                                                        ].join(' ')}
                                                    >
                                                        {s.name} ({count})
                                                    </button>
                                                );
                                            })}
                                        </nav>
                                    </div>
                                ) : null}

                                <ul className="mt-4 space-y-3">
                                    {filteredDoctors.map((d) => {
                                        const fullName = `${d.first_name || ''} ${d.last_name || ''}`.trim();
                                        const photo = d.profile_photo_url;
                                        return (
                                            <li
                                                key={d.id}
                                                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
                                            >
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white">
                                                    {photo ? (
                                                        <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d9488]/20 to-slate-200 text-sm font-bold text-slate-600">
                                                            {(d.first_name?.[0] || '') + (d.last_name?.[0] || '')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        to={`/doctors/${d.slug}`}
                                                        className="font-ui text-base font-semibold text-slate-900 hover:text-[#0d9488]"
                                                    >
                                                        {fullName || 'Doctor'}
                                                    </Link>
                                                    {(d.specialties || []).length > 0 ? (
                                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                            {(d.specialties || []).map((s) =>
                                                                s.slug ? (
                                                                    <Link
                                                                        key={s.id}
                                                                        to={`/specialties/${s.slug}`}
                                                                        className="font-ui rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-[#0d9488]/10 hover:text-[#0f766e]"
                                                                    >
                                                                        {s.name}
                                                                    </Link>
                                                                ) : (
                                                                    <span
                                                                        key={s.id}
                                                                        className="font-ui rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                                                                    >
                                                                        {s.name}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : null}
                                                    {d.pivot?.department ? (
                                                        <p className="font-ui mt-1 text-xs text-slate-500">Department: {d.pivot.department}</p>
                                                    ) : null}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {filteredDoctors.length === 0 ? (
                                    <p className="font-ui mt-4 text-sm text-slate-500">No doctors in this specialty.</p>
                                ) : null}
                            </section>
                        ) : null}
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="font-display text-base font-bold text-slate-900">Address</h2>
                            <p className="font-ui mt-2 text-sm text-slate-700">
                                {[h.address_line1, h.address_line2, h.municipality, h.district, h.province].filter(Boolean).join(', ')}
                            </p>
                        </section>
                        {(h.beds_general || h.beds_icu) ? (
                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h2 className="font-display text-base font-bold text-slate-900">Beds (reported)</h2>
                                <ul className="font-ui mt-2 list-inside list-disc text-sm text-slate-700">
                                    {h.beds_general != null ? <li>General: {h.beds_general}</li> : null}
                                    {h.beds_icu != null ? <li>ICU: {h.beds_icu}</li> : null}
                                    {h.beds_emergency != null ? <li>Emergency: {h.beds_emergency}</li> : null}
                                </ul>
                            </section>
                        ) : null}
                    </div>
                </div>

                <p className="mt-12 text-center">
                    <Link href="/hospitals" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                        ← All hospitals
                    </Link>
                </p>
            </div>
        </article>
    );
}
