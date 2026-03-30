// @ts-nocheck — generated from legacy DoctorDetailPage; tighten types when API contracts are stable
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import ReviewModal from '@/components/reviews/ReviewModal';
import Stars from '@/components/ui/Stars';
import { doctorBySlugUrl, doctorConnectUrl, doctorReviewsIndexUrl, fetchJson, postJson, type HttpError } from '@/api/publicApi';
import { doctorProfileFallback } from '@/data/doctorProfileCopy';
import { useAppName } from '@/hooks/useAppName';

const LANG_LABELS: Record<string, string> = { ne: 'Nepali', en: 'English', hi: 'Hindi', np: 'Nepali' };

function formatLanguages(langs: unknown): string | null {
    if (!langs || !Array.isArray(langs) || langs.length === 0) return null;
    return langs.map((c) => LANG_LABELS[c] || String(c)).join(' · ');
}

function formatVisitingHours(v: unknown): string | null {
    if (v == null || v === '') return null;
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.filter(Boolean).join(' · ');
    if (typeof v === 'object') {
        const rows = Object.entries(v)
            .map(([k, val]) => (val ? `${k}: ${val}` : null))
            .filter(Boolean);
        return rows.length ? rows.join(' · ') : null;
    }
    return null;
}

/**
 * Doctor profile — Stitch layout: full-bleed hero, 8+4 grid, identity + main column left,
 * single sticky right rail (book, review CTA, practice, schedule, fee).
 */
export default function DoctorDetailView({ slug }: { slug: string }) {
    const appName = useAppName();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API resource shape from backend
    const [doc, setDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [connectName, setConnectName] = useState('');
    const [connectPhone, setConnectPhone] = useState('');
    const [connectEmail, setConnectEmail] = useState('');
    const [connectMessage, setConnectMessage] = useState('');
    const [connectPreferredDate, setConnectPreferredDate] = useState('');
    const [connectStatus, setConnectStatus] = useState('idle');
    const [connectFormError, setConnectFormError] = useState<string | null>(null);
    const [connectFieldErrors, setConnectFieldErrors] = useState<Record<string, string[] | string>>({});

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewsList, setReviewsList] = useState<Record<string, unknown>[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    function connectFieldError(field: string) {
        const v = connectFieldErrors[field];
        if (!v) return null;
        return Array.isArray(v) ? v[0] : v;
    }

    async function handleConnectSubmit(e: FormEvent) {
        e.preventDefault();
        setConnectFormError(null);
        setConnectFieldErrors({});
        setConnectStatus('submitting');
        const payload: Record<string, unknown> = {
            name: connectName.trim(),
            phone: connectPhone.trim(),
        };
        const em = connectEmail.trim();
        if (em) payload.email = em;
        const msg = connectMessage.trim();
        if (msg) payload.message = msg;
        if (connectPreferredDate) payload.preferred_date = connectPreferredDate;
        try {
            await postJson(doctorConnectUrl(slug), payload);
            setConnectStatus('success');
            setConnectName('');
            setConnectPhone('');
            setConnectEmail('');
            setConnectMessage('');
            setConnectPreferredDate('');
        } catch (err: unknown) {
            setConnectStatus('idle');
            const e = err as HttpError;
            if (e.status === 422 && e.errors) {
                setConnectFieldErrors(e.errors);
            } else {
                setConnectFormError(e.message || 'Could not send your request. Please try again.');
            }
        }
    }

    function refreshAfterReview() {
        fetchJson<{ data: Record<string, unknown> }>(doctorBySlugUrl(slug))
            .then((json) => setDoc(json.data))
            .catch(() => {});
        fetchJson<{ data: Record<string, unknown>[] }>(doctorReviewsIndexUrl(slug, { per_page: 30 }))
            .then((json) => setReviewsList(json.data || []))
            .catch(() => {});
    }

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setNotFound(false);
        setLoadError(null);
        fetchJson<{ data: Record<string, unknown> }>(doctorBySlugUrl(slug))
            .then((json) => {
                if (!cancelled) {
                    setDoc(json.data);
                }
            })
            .catch((e: unknown) => {
                if (cancelled) return;
                const err = e as HttpError;
                if (err.status === 404) setNotFound(true);
                else setLoadError(err.message || 'Could not load profile');
                setDoc(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    useEffect(() => {
        if (!slug || !doc) return;
        let cancelled = false;
        setReviewsLoading(true);
        fetchJson<{ data: Record<string, unknown>[] }>(doctorReviewsIndexUrl(slug, { per_page: 30 }))
            .then((json) => {
                if (!cancelled) setReviewsList(json.data || []);
            })
            .catch(() => {
                if (!cancelled) setReviewsList([]);
            })
            .finally(() => {
                if (!cancelled) setReviewsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [slug, doc?.id]);

    useEffect(() => {
        if (doc && typeof doc.first_name === 'string') {
            const name = `${doc.first_name} ${String(doc.last_name ?? '')}`.trim();
            document.title = `${name} — ${appName}`;
        }
        return () => {
            document.title = appName;
        };
    }, [doc, appName]);

    if (loading) {
        return (
            <div className="bg-[#f8fafc] py-20 text-center">
                <p className="font-ui text-slate-600">Loading profile…</p>
            </div>
        );
    }

    if (loadError && !notFound) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <p className="font-ui text-red-700">{loadError}</p>
                <Link href="/doctors" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
                    Back to doctors
                </Link>
            </div>
        );
    }

    if (notFound || !doc) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
                <h1 className="font-display text-2xl font-bold text-slate-900">Doctor not found</h1>
                <p className="font-ui mt-2 text-slate-600">This profile may be unpublished or the link is incorrect.</p>
                <Link href="/doctors" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
                    Back to doctors
                </Link>
            </div>
        );
    }

    const name = `${doc.first_name || ''} ${doc.last_name || ''}`.trim();
    const cover = doc.cover_image_url;
    const photo = doc.profile_photo_url;
    const specialties = doc.specialties || [];
    const hospitals = doc.hospitals || [];
    const socialLinks = doc.social_links || [];
    const rating = doc.average_rating;
    const reviewCount = doc.reviews_count;

    const aboutText =
        doc.biography && String(doc.biography).trim() ? doc.biography : doctorProfileFallback.about(name);
    const languagesLine = formatLanguages(doc.languages) || doctorProfileFallback.languages;
    const hoursLine = formatVisitingHours(doc.visiting_hours) || doctorProfileFallback.hours;
    const clinicalBullets =
        doc.sub_specialty != null && String(doc.sub_specialty).trim()
            ? [String(doc.sub_specialty).trim(), ...doctorProfileFallback.clinicalFocus.slice(0, 2)]
            : doctorProfileFallback.clinicalFocus;
    const specialtyChips =
        specialties.length > 0 ? specialties : doctorProfileFallback.specialtiesChips.map((label, i) => ({ id: `fb-${i}`, name: label, slug: null }));
    const educationLines = Array.isArray(doc.education) && doc.education.length > 0 ? doc.education : [doctorProfileFallback.education];
    const certLines =
        Array.isArray(doc.certifications) && doc.certifications.length > 0
            ? doc.certifications
            : [doctorProfileFallback.certifications];
    const hasRealHospitals = hospitals.length > 0;

    return (
        <article className="bg-[#f8fafc] pb-16">
            <div className="relative h-44 w-full overflow-hidden bg-slate-200 sm:h-52 md:h-60">
                {cover ? (
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0d9488]/40 via-slate-600/30 to-slate-800/50" />
                )}
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent"
                    aria-hidden
                />
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <nav className="relative z-20 pt-4 font-ui text-xs text-slate-500" aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li>
                            <Link href="/" className="transition hover:text-[#0d9488]">
                                Home
                            </Link>
                        </li>
                        <li aria-hidden className="text-slate-300">
                            /
                        </li>
                        <li>
                            <Link href="/doctors" className="transition hover:text-[#0d9488]">
                                Doctors
                            </Link>
                        </li>
                        <li aria-hidden className="text-slate-300">
                            /
                        </li>
                        <li className="max-w-[14rem] truncate font-medium text-slate-700 sm:max-w-none">{name}</li>
                    </ol>
                </nav>

                <div className="relative z-10 mt-2 grid grid-cols-1 gap-8 lg:mt-3 lg:grid-cols-12 lg:gap-x-10 lg:items-start">
                    <div className="min-w-0 lg:col-span-8">
                        <div className="relative -mt-12 w-full sm:-mt-14 md:-mt-16">
                            <div className="relative overflow-visible rounded-2xl border border-slate-200/90 bg-white px-5 pb-7 pt-[4.85rem] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/[0.04] sm:px-8 sm:pb-8 sm:pt-7 md:pt-8">
                            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[44%] sm:left-8 sm:translate-x-0 sm:-translate-y-[48%]">
                                <div className="h-28 w-28 overflow-hidden rounded-full border-[5px] border-white bg-white shadow-[0_8px_30px_rgba(15,23,42,0.2)] ring-2 ring-slate-100 sm:h-32 sm:w-32">
                                    {photo ? (
                                        <img src={photo} alt={`${name} — profile photo`} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d9488]/25 to-slate-200 text-2xl font-bold text-slate-600">
                                            {(doc.first_name?.[0] || '') + (doc.last_name?.[0] || '')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="relative z-10 mx-auto max-w-2xl text-center sm:mx-0 sm:max-w-none sm:pl-[9.25rem] sm:text-left md:pl-[10.5rem]">
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    {doc.verification_status === 'approved' ? (
                                        <span className="inline-block rounded-md bg-[#0d9488]/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#0f766e]">
                                            Verified
                                        </span>
                                    ) : null}
                                    {doc.is_online ? (
                                        <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                                            Accepting online consults
                                        </span>
                                    ) : null}
                                </div>
                                <h1 className="font-display mt-2 text-balance text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
                                    {name}
                                </h1>
                                <p className="font-ui mt-1.5 text-base text-slate-600">
                                    {specialties.length > 0 ? (
                                        specialties.map((s, i) => (
                                            <span key={s.id}>
                                                {i > 0 ? ' · ' : null}
                                                {s.slug ? (
                                                    <Link href={`/specialties/${s.slug}`} className="text-[#0d9488] hover:underline">
                                                        {s.name}
                                                    </Link>
                                                ) : (
                                                    s.name
                                                )}
                                            </span>
                                        ))
                                    ) : (
                                        doc.sub_specialty || 'Medical specialist'
                                    )}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                                    {rating != null ? (
                                        <div className="flex items-center gap-2">
                                            <Stars value={rating} />
                                            <span className="font-ui text-sm font-semibold text-slate-800">{Number(rating).toFixed(1)}</span>
                                            {reviewCount != null ? (
                                                <span className="font-ui text-sm text-slate-500">({reviewCount} reviews)</span>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    {doc.years_experience != null ? (
                                        <span className="font-ui text-sm text-slate-600">{doc.years_experience}+ years experience</span>
                                    ) : null}
                                    {doc.is_board_certified ? (
                                        <span className="font-ui rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                            Board certified
                                        </span>
                                    ) : null}
                                </div>
                                {(doc.district || doc.municipality) && (
                                    <p className="font-ui mt-2 text-sm text-slate-500">
                                        {[doc.municipality, doc.district].filter(Boolean).join(', ')}
                                        {doc.country ? ` · ${doc.country}` : ''}
                                    </p>
                                )}
                                {socialLinks.length > 0 ? (
                                    <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                        {socialLinks.map((s, idx) => (
                                            <li key={s.id ?? `${s.platform_key}-${idx}`}>
                                                <a
                                                    href={s.url}
                                                    target="_blank"
                                                    rel={s.rel || 'noopener noreferrer'}
                                                    className="font-ui inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[#0d9488]/40 hover:text-[#0d9488]"
                                                >
                                                    {s.name || s.platform_key}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-10">
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">About</h2>
                            <div className="font-ui mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{aboutText}</div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Clinical focus</h2>
                            <ul className="font-ui mt-4 list-inside list-disc space-y-2 text-sm text-slate-700">
                                {clinicalBullets.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Languages</h2>
                            <p className="font-ui mt-4 text-sm text-slate-700">{languagesLine}</p>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Credentials</h2>
                            <div className="font-ui mt-4 space-y-2 text-sm text-slate-700">
                                {doc.license_number ? (
                                    <p>
                                        <span className="font-medium text-slate-900">License: </span>
                                        {doc.license_number}
                                    </p>
                                ) : null}
                                {doc.registration_board ? (
                                    <p>
                                        <span className="font-medium text-slate-900">Registration: </span>
                                        {doc.registration_board}
                                    </p>
                                ) : null}
                                {!doc.license_number && !doc.registration_board ? <p>{doctorProfileFallback.license}</p> : null}
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="patient-reviews-heading">
                            <div className="flex flex-col gap-3 border-b border-slate-200 pb-2 sm:flex-row sm:items-center sm:justify-between">
                                <h2 id="patient-reviews-heading" className="font-display text-lg font-bold text-slate-900">
                                    Patient reviews
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setReviewModalOpen(true)}
                                    className="font-ui shrink-0 rounded-lg border border-[#0d9488] bg-white px-3 py-1.5 text-sm font-semibold text-[#0d9488] hover:bg-[#0d9488]/5"
                                >
                                    Write a review
                                </button>
                            </div>
                            {reviewsLoading ? (
                                <p className="font-ui mt-6 text-sm text-slate-500">Loading reviews…</p>
                            ) : reviewsList.length === 0 ? (
                                <p className="font-ui mt-4 text-sm text-slate-600">{doctorProfileFallback.reviewsEmpty}</p>
                            ) : (
                                <ul className="mt-6 space-y-4">
                                    {reviewsList.map((r) => (
                                        <li key={r.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Stars value={r.rating} />
                                                <span className="font-ui font-semibold text-slate-900">{r.author_name}</span>
                                                {r.created_at ? (
                                                    <time dateTime={r.created_at} className="font-ui text-xs text-slate-400">
                                                        {new Date(r.created_at).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </time>
                                                ) : null}
                                            </div>
                                            {r.body ? <p className="font-ui mt-3 text-sm leading-relaxed text-slate-700">{r.body}</p> : null}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Specialties</h2>
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {specialtyChips.map((s) => (
                                    <li key={s.id}>
                                        {s.slug ? (
                                            <Link
                                                to={`/specialties/${s.slug}`}
                                                className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:border-[#0d9488]/50 hover:text-[#0d9488]"
                                            >
                                                {s.name}
                                            </Link>
                                        ) : (
                                            <span className="inline-block rounded-lg border border-dashed border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600">
                                                {s.name}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
                                Hospitals & affiliations
                            </h2>
                            {hasRealHospitals ? (
                                <ul className="mt-4 space-y-3">
                                    {hospitals.map((h) => (
                                        <li key={h.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                                            {h.slug ? (
                                                <Link
                                                    to={`/hospitals/${h.slug}`}
                                                    className="font-ui text-base font-semibold text-[#0d9488] hover:underline"
                                                >
                                                    {h.name}
                                                </Link>
                                            ) : (
                                                <p className="font-ui font-semibold text-slate-900">{h.name}</p>
                                            )}
                                            {h.city || h.district ? (
                                                <p className="font-ui mt-1 text-sm text-slate-600">
                                                    {[h.municipality || h.city, h.district].filter(Boolean).join(', ')}
                                                </p>
                                            ) : null}
                                            {h.pivot?.department ? (
                                                <p className="font-ui mt-1 text-xs text-slate-500">Department: {h.pivot.department}</p>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
                                    <p className="font-ui font-semibold text-slate-900">{doctorProfileFallback.hospitalCard.title}</p>
                                    <p className="font-ui mt-2 text-sm leading-relaxed text-slate-600">{doctorProfileFallback.hospitalCard.body}</p>
                                    <Link
                                        to="/hospitals"
                                        className="font-ui mt-3 inline-block text-sm font-semibold text-[#0d9488] hover:underline"
                                    >
                                        Browse hospitals
                                    </Link>
                                </div>
                            )}
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Education</h2>
                            <ul className="font-ui mt-4 list-inside list-disc space-y-1 text-sm text-slate-700">
                                {educationLines.map((line, i) => (
                                    <li key={i}>{typeof line === 'string' ? line : JSON.stringify(line)}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="font-display border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">Certifications & training</h2>
                            <ul className="font-ui mt-4 list-inside list-disc space-y-1 text-sm text-slate-700">
                                {certLines.map((line, i) => (
                                    <li key={i}>{typeof line === 'string' ? line : JSON.stringify(line)}</li>
                                ))}
                            </ul>
                        </section>
                        </div>
                    </div>

                    <aside className="min-w-0 lg:col-span-4 lg:-mt-16 lg:self-start">
                        <div className="space-y-6 lg:sticky lg:top-24">
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="font-ui text-sm font-semibold text-slate-900">Book an appointment</p>
                                <p className="font-ui mt-2 text-xs text-slate-500">
                                    Send your details and we’ll contact you to confirm a time.
                                </p>
                                {doc.phone ? (
                                    <p className="font-ui mt-3 text-sm">
                                        <span className="text-slate-500">Phone: </span>
                                        <a href={`tel:${String(doc.phone).replace(/\s/g, '')}`} className="font-semibold text-[#0d9488] hover:underline">
                                            {doc.phone}
                                        </a>
                                    </p>
                                ) : null}
                                {connectStatus === 'success' ? (
                                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                        <p className="font-ui text-sm font-medium text-emerald-900">Request received</p>
                                        <p className="font-ui mt-1 text-xs text-emerald-800">We’ll reach out shortly.</p>
                                        <button
                                            type="button"
                                            className="font-ui mt-3 text-xs font-semibold text-[#0f766e] hover:underline"
                                            onClick={() => setConnectStatus('idle')}
                                        >
                                            Submit another request
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleConnectSubmit} className="mt-4 space-y-3">
                                        {connectFormError ? (
                                            <p className="font-ui rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-800">{connectFormError}</p>
                                        ) : null}
                                        <div>
                                            <label htmlFor="connect-name" className="font-ui text-xs font-medium text-slate-600">
                                                Your name
                                            </label>
                                            <input
                                                id="connect-name"
                                                name="name"
                                                type="text"
                                                autoComplete="name"
                                                required
                                                value={connectName}
                                                onChange={(e) => setConnectName(e.target.value)}
                                                className="font-ui mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
                                            />
                                            {connectFieldError('name') ? (
                                                <p className="font-ui mt-0.5 text-xs text-red-600">{connectFieldError('name')}</p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label htmlFor="connect-phone" className="font-ui text-xs font-medium text-slate-600">
                                                Phone
                                            </label>
                                            <input
                                                id="connect-phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                required
                                                value={connectPhone}
                                                onChange={(e) => setConnectPhone(e.target.value)}
                                                className="font-ui mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
                                            />
                                            {connectFieldError('phone') ? (
                                                <p className="font-ui mt-0.5 text-xs text-red-600">{connectFieldError('phone')}</p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label htmlFor="connect-email" className="font-ui text-xs font-medium text-slate-600">
                                                Email <span className="font-normal text-slate-400">(optional)</span>
                                            </label>
                                            <input
                                                id="connect-email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                value={connectEmail}
                                                onChange={(e) => setConnectEmail(e.target.value)}
                                                className="font-ui mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
                                            />
                                            {connectFieldError('email') ? (
                                                <p className="font-ui mt-0.5 text-xs text-red-600">{connectFieldError('email')}</p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label htmlFor="connect-date" className="font-ui text-xs font-medium text-slate-600">
                                                Preferred date <span className="font-normal text-slate-400">(optional)</span>
                                            </label>
                                            <input
                                                id="connect-date"
                                                name="preferred_date"
                                                type="date"
                                                value={connectPreferredDate}
                                                onChange={(e) => setConnectPreferredDate(e.target.value)}
                                                className="font-ui mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
                                            />
                                            {connectFieldError('preferred_date') ? (
                                                <p className="font-ui mt-0.5 text-xs text-red-600">{connectFieldError('preferred_date')}</p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label htmlFor="connect-message" className="font-ui text-xs font-medium text-slate-600">
                                                Message <span className="font-normal text-slate-400">(optional)</span>
                                            </label>
                                            <textarea
                                                id="connect-message"
                                                name="message"
                                                rows={3}
                                                value={connectMessage}
                                                onChange={(e) => setConnectMessage(e.target.value)}
                                                placeholder="Reason for visit, preferred time…"
                                                className="font-ui mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
                                            />
                                            {connectFieldError('message') ? (
                                                <p className="font-ui mt-0.5 text-xs text-red-600">{connectFieldError('message')}</p>
                                            ) : null}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={connectStatus === 'submitting'}
                                            className="font-ui w-full rounded-lg bg-[#0d9488] py-2.5 text-sm font-semibold text-white hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {connectStatus === 'submitting' ? 'Sending…' : 'Request appointment'}
                                        </button>
                                    </form>
                                )}
                                {doc.teleconsult_available ? (
                                    <p className="font-ui mt-3 text-center text-xs text-[#0d9488]">Teleconsult available</p>
                                ) : null}
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                    <p className="font-ui text-xs font-medium text-slate-600">Patient feedback</p>
                                    <button
                                        type="button"
                                        onClick={() => setReviewModalOpen(true)}
                                        className="font-ui mt-2 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-[#0d9488] transition hover:border-[#0d9488]/50 hover:bg-[#0d9488]/5"
                                    >
                                        Write a review
                                    </button>
                                </div>
                            </div>

                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h2 className="font-display text-base font-bold text-slate-900">Practice location</h2>
                                {doc.clinic_name || doc.clinic_address_line1 ? (
                                    <>
                                        {doc.clinic_name ? <p className="font-ui mt-2 font-medium text-slate-800">{doc.clinic_name}</p> : null}
                                        <p className="font-ui mt-2 text-sm text-slate-600">
                                            {[doc.clinic_address_line1, doc.clinic_address_line2].filter(Boolean).join(', ')}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-ui mt-2 font-medium text-slate-800">{doctorProfileFallback.clinic.name}</p>
                                        <p className="font-ui mt-2 text-sm text-slate-600">{doctorProfileFallback.clinic.address}</p>
                                    </>
                                )}
                            </section>

                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h2 className="font-display text-base font-bold text-slate-900">Schedule & availability</h2>
                                <p className="font-ui mt-2 text-sm leading-relaxed text-slate-600">{hoursLine}</p>
                            </section>

                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h2 className="font-display text-base font-bold text-slate-900">Consultation fee</h2>
                                <p className="font-ui mt-2 text-sm text-slate-700">
                                    {doc.consultation_fee_min != null || doc.consultation_fee_max != null
                                        ? doc.consultation_fee_min != null && doc.consultation_fee_max != null
                                            ? `NPR ${doc.consultation_fee_min} – ${doc.consultation_fee_max}`
                                            : doc.consultation_fee_min != null
                                              ? `From NPR ${doc.consultation_fee_min}`
                                              : `Up to NPR ${doc.consultation_fee_max}`
                                        : doctorProfileFallback.fees}
                                </p>
                            </section>
                        </div>
                    </aside>
                </div>

                <p className="mt-12 text-center">
                    <Link href="/doctors" className="font-ui text-sm font-medium text-[#0d9488] hover:underline">
                        ← All doctors
                    </Link>
                </p>
            </div>

            <ReviewModal
                slug={slug}
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onSubmitted={refreshAfterReview}
            />
        </article>
    );
}
