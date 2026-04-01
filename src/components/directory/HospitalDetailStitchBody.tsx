// @ts-nocheck
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import HospitalReviewModal from '@/components/reviews/HospitalReviewModal';
import { directoryReviewsIndexUrl, fetchJson } from '@/api/publicApi';

function uniqueBy(array, keyFn) {
    const seen = new Set();
    const out = [];
    for (const item of array) {
        const key = keyFn(item);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(item);
    }
    return out;
}

function formatFacilitiesChips(h) {
    const list = Array.isArray(h?.facilities) ? h.facilities : [];
    return list.map((x) => String(x)).filter(Boolean).slice(0, 6);
}

function isEmergencyHospital(h) {
    const emergencyPhone = h?.emergency_phone != null && String(h.emergency_phone).trim() !== '';
    const traumaCenter = !!h?.is_trauma_center;
    const bedsEmergency = h?.beds_emergency != null ? Number(h.beds_emergency) : null;
    return emergencyPhone || traumaCenter || (bedsEmergency != null && !Number.isNaN(bedsEmergency) && bedsEmergency > 0);
}

function formatAddress(h) {
    const parts = [h.address_line1, h.address_line2, h.municipality, h.city, h.district, h.province, h.country].filter(Boolean);
    return parts.join(', ');
}

function specialtyIconFallback() {
    return 'medical_services';
}

export default function HospitalDetailStitchBody({ h, cover, photo, doctors, lines }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState(null);

    const slug = h?.slug;

    useEffect(() => {
        setActiveTab('overview');
    }, [h?.id]);

    const specialties = useMemo(() => {
        const all = [];
        (doctors || []).forEach((d) => {
            (d?.specialties || []).forEach((s) => {
                if (s?.id != null) all.push(s);
                else if (s?.name) all.push({ id: s.name, slug: s.slug, name: s.name });
            });
        });
        return uniqueBy(all, (s) => String(s?.id ?? s?.slug ?? s?.name)).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [doctors]);

    const facilitiesChips = useMemo(() => formatFacilitiesChips(h), [h]);
    const carriers = useMemo(() => {
        const panels = Array.isArray(h?.insurance_panels) ? h.insurance_panels : [];
        if (panels.length) return panels.map((x) => String(x)).filter(Boolean).slice(0, 8);
        return ['BLUE CROSS', 'AETNA', 'CIGNA', 'KAISER'];
    }, [h]);

    function refreshReviews() {
        if (!slug) return;
        setReviewsLoading(true);
        setReviewsError(null);
        fetchJson(directoryReviewsIndexUrl('hospitals', slug, { per_page: 10 }))
            .then((json) => setReviews(json.data || []))
            .catch((e) => {
                setReviewsError(e.message || 'Could not load reviews');
                setReviews([]);
            })
            .finally(() => setReviewsLoading(false));
    }

    useEffect(() => {
        if (!slug) return;
        refreshReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const emergencyOn = isEmergencyHospital(h);

    return (
        <article className="bg-background text-on-surface font-body pb-16">
            {/* Hero Section */}
            <section className="relative h-[420px] w-full overflow-hidden bg-surface">
                {cover ? (
                    <img src={cover} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0d9488]/30 to-slate-900/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="mx-auto w-[90%] max-w-8xl px-0 sm:px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {h?.is_partner ? 'Premium Care' : 'Healthcare Facility'}
                                </span>
                                {h?.average_rating != null ? (
                                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-sm" aria-hidden style={{ fontVariationSettings: "'FILL' 1" }}>
                                            star
                                        </span>
                                        <span className="text-sm font-semibold">
                                            {Number(h.average_rating).toFixed(1)}{' '}
                                            <span className="opacity-80">{h.reviews_count != null ? `(${h.reviews_count} reviews)` : ''}</span>
                                        </span>
                                    </div>
                                ) : null}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-headline font-extrabold mb-4 tracking-tight leading-tight">
                                {h?.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined" aria-hidden>
                                        location_on
                                    </span>
                                    {h?.district ? `${h.city ? `${h.city}, ${h.district}` : h.district}` : h?.city || 'Nepal'}
                                </span>
                                <span className="flex items-center gap-1 opacity-90">
                                    <span className="material-symbols-outlined" aria-hidden>
                                        distance
                                    </span>
                                    {/* distance is dynamic only on listing page; keep placeholder */}
                                    2.4 km away
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="bg-gradient-to-br from-primary-container to-secondary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                            onClick={() => {
                                if (h?.emergency_phone) window.location.href = `tel:${String(h.emergency_phone).replace(/\s/g, '')}`;
                            }}
                        >
                            <span className="material-symbols-outlined text-[20px]" aria-hidden>
                                calendar_month
                            </span>
                            Book Appointment
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="mx-auto w-[90%] max-w-8xl px-0 sm:px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Content & Tabs */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-8 border-b border-outline-variant/20 overflow-x-auto whitespace-nowrap pb-1 hide-scrollbar">
                        {[
                            ['overview', 'Overview'],
                            ['specialties', 'Specialties'],
                            ['care_team', 'Care Team'],
                            ['facilities', 'Facilities'],
                            ['location', 'Location'],
                            ['reviews', 'Reviews'],
                        ].map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveTab(key)}
                                className={[
                                    'pb-4 font-bold transition-all whitespace-nowrap',
                                    activeTab === key ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant font-medium hover:text-primary',
                                ].join(' ')}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {activeTab === 'overview' ? (
                        <>
                            {/* Bio & Stats Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                                    <h2 className="text-2xl font-headline font-bold text-primary mb-4">Clinical Excellence</h2>
                                    <p className="text-on-surface-variant leading-relaxed mb-6">
                                        {h?.description || 'A trusted healthcare facility providing patient-centered care and modern medical services.'}
                                    </p>

                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex -space-x-2">
                                            {(doctors || []).slice(0, 3).map((d) => (
                                                <img
                                                    key={d.id}
                                                    className="h-8 w-8 rounded-full border-2 border-white"
                                                    alt=""
                                                    src={d.profile_photo_url || ''}
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium text-on-surface-variant">
                                            {doctors?.length ? `${doctors.length}+ Specialized Doctors` : 'Specialized care team'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-primary-container text-on-primary p-8 rounded-xl flex flex-col justify-center items-center text-center">
                                    <span className="material-symbols-outlined text-4xl mb-2" aria-hidden style={{ fontVariationSettings: "'FILL' 1" }}>
                                        verified
                                    </span>
                                    <h3 className="font-bold text-xl mb-1">{h?.verification_status === 'approved' ? 'JCI Accredited' : 'Trusted Care Partner'}</h3>
                                    <p className="text-sm opacity-90 font-medium">Since 2012</p>
                                </div>
                            </div>

                            {/* Capacity Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 text-center">
                                    <span className="block text-3xl font-bold text-primary mb-1">{h?.beds_general ?? 0}</span>
                                    <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Total Beds</span>
                                </div>
                                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 text-center">
                                    <span className="block text-3xl font-bold text-primary mb-1">{h?.beds_icu ?? 0}</span>
                                    <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">ICU Units</span>
                                </div>
                                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 text-center">
                                    <span className="block text-3xl font-bold text-primary mb-1">{h?.beds_emergency ?? 0}</span>
                                    <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Emergency Beds</span>
                                </div>
                                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 text-center">
                                    <span className="block text-3xl font-bold text-primary mb-1">{h?.beds_emergency ?? 0}</span>
                                    <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Theaters</span>
                                </div>
                            </div>
                        </>
                    ) : null}

                    {activeTab === 'specialties' ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-headline font-bold text-on-surface">Medical Specialties</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {specialties.length ? (
                                    specialties.slice(0, 12).map((s) => (
                                        <div
                                            key={s.id}
                                            className="group bg-surface-container-lowest p-6 rounded-xl hover:bg-secondary-container transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-3xl text-primary mb-3 group-hover:scale-110 transition-transform" aria-hidden>
                                                {specialtyIconFallback(s)}
                                            </span>
                                            <p className="font-bold text-on-surface">{s.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-on-surface-variant">No specialties found for this hospital yet.</p>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {activeTab === 'care_team' ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-headline font-bold text-on-surface">Care Team</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(doctors || []).slice(0, 8).map((d) => {
                                    const name = `${d.first_name || ''} ${d.last_name || ''}`.trim() || 'Doctor';
                                    const spec = d?.specialties?.[0]?.name || d.sub_specialty || 'Specialist';
                                    return (
                                        <Link
                                            key={d.id}
                                            to={`/doctors/${d.slug}`}
                                            className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 hover:border-primary transition-all flex items-center gap-4"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-surface-container-highest overflow-hidden ring-2 ring-white shrink-0">
                                                {d.profile_photo_url ? (
                                                    <img src={d.profile_photo_url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center font-bold text-primary">
                                                        {(name[0] || 'D').toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-on-surface truncate">{name}</div>
                                                <div className="text-sm text-on-surface-variant truncate">{spec}</div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    {activeTab === 'facilities' ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-headline font-bold text-on-surface">Facilities</h3>
                            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10">
                                <div className="flex flex-wrap gap-2">
                                    {facilitiesChips.length ? (
                                        facilitiesChips.map((c) => (
                                            <span key={c} className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                                                {c}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-on-surface-variant">No facilities listed.</span>
                                    )}
                                </div>
                                {Array.isArray(h?.accreditations) && h.accreditations.length ? (
                                    <div className="mt-6">
                                        <p className="font-bold text-primary mb-2">Accreditations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {h.accreditations.slice(0, 6).map((a) => (
                                                <span key={a} className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-medium rounded-full">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ) : null}

                    {activeTab === 'location' ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-headline font-bold text-on-surface">Location & Access</h3>
                            <div className="bg-surface-container-low rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                                <div className="p-8 space-y-6">
                                    <div>
                                        <h4 className="font-bold text-primary mb-1">Contact Information</h4>
                                        {h?.phone ? <p className="text-on-surface-variant">Phone: {h.phone}</p> : <p className="text-on-surface-variant">Phone: —</p>}
                                        {h?.email ? <p className="text-on-surface-variant">Email: {h.email}</p> : null}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary mb-1">Working Hours</h4>
                                        <p className="text-on-surface-variant">{emergencyOn ? 'Emergency: 24/7 Open' : 'Outpatient hours available'}</p>
                                        {Array.isArray(lines) && lines.length ? <p className="text-on-surface-variant">Phone lines available for contact.</p> : null}
                                    </div>

                                    <button
                                        type="button"
                                        className="w-fit text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
                                    >
                                        <span className="material-symbols-outlined" aria-hidden>
                                            directions
                                        </span>
                                        Get Direct Navigation
                                    </button>
                                </div>

                                <div className="relative bg-surface-variant">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt=""
                                        data-location={h?.city || h?.district || 'Nepal'}
                                        src={cover || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKBdznZ0BPjk69vZFE3sH1H2OeRabvFvWhzMmLXM0DLCrvDOJfOgmzdQs8axgvCl0Fe45EMOgLoGXFw7HVmNI6mWeFA9NRMZzeuP6N0QNp3J-DmPGb56OUQZgdPIgCbqLll2_C-5nCApiPoD5q0BtBO40ir68ZWgxB1eMguFO1GV1QipkrF2uICIe3nueFVLb_wcA_418loniRutxU4gl2PubkTA_J3I2pIc14om9RT8-vG4vqDMI0Nhi4MDCftaekY-2Aj4fwIa4'}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {activeTab === 'reviews' ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-headline font-bold text-on-surface">Patient Voices</h3>
                                <button
                                    type="button"
                                    className="text-primary font-bold"
                                    onClick={() => setReviewModalOpen(true)}
                                >
                                    Write a Review
                                </button>
                            </div>

                            {reviewsLoading ? (
                                <p className="text-on-surface-variant">Loading reviews…</p>
                            ) : reviewsError ? (
                                <p className="text-error">{reviewsError}</p>
                            ) : reviews.length === 0 ? (
                                <p className="text-on-surface-variant">No reviews yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.slice(0, 3).map((r) => (
                                        <div key={r.id} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-secondary-container rounded-full flex items-center justify-center font-bold text-primary">
                                                        {(r.author_name?.[0] || 'R').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-on-surface">{r.author_name}</p>
                                                        <p className="text-xs text-on-surface-variant">
                                                            {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 text-tertiary">
                                                    <Stars value={r.rating} />
                                                </div>
                                            </div>

                                            {r.body ? <p className="text-on-surface-variant italic leading-relaxed">{r.body}</p> : null}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Right Column: Quick Actions + Accepted Carriers */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-surface-container-high rounded-2xl p-8 space-y-6 sticky top-28">
                        <h3 className="text-xl font-headline font-bold text-on-surface">Quick Actions</h3>

                        <button
                            type="button"
                            className={`w-full p-4 rounded-xl flex items-center justify-between group transition-all hover:brightness-110 ${
                                emergencyOn ? 'bg-error text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20'
                            }`}
                            onClick={() => {
                                if (h?.emergency_phone) window.location.href = `tel:${String(h.emergency_phone).replace(/\s/g, '')}`;
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl" aria-hidden>
                                    emergency
                                </span>
                                <div className="text-left">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">24/7 Hotline</p>
                                    <p className="font-black text-lg">{h?.emergency_phone ? 'Emergency Call' : 'Emergency Info'}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden>
                                chevron_right
                            </span>
                        </button>

                        <div className="space-y-3">
                            <button
                                type="button"
                                className="w-full bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all"
                                onClick={() => {}}
                            >
                                <span className="material-symbols-outlined text-primary" aria-hidden>
                                    verified_user
                                </span>
                                <div className="text-left">
                                    <p className="font-bold text-on-surface">Insurance Support</p>
                                    <p className="text-xs text-on-surface-variant">Check your coverage</p>
                                </div>
                            </button>

                            <button type="button" className="w-full bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all">
                                <span className="material-symbols-outlined text-primary" aria-hidden>
                                    download
                                </span>
                                <div className="text-left">
                                    <p className="font-bold text-on-surface">Download Map</p>
                                    <p className="text-xs text-on-surface-variant">PDF Floor Plan</p>
                                </div>
                            </button>

                            <button type="button" className="w-full bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all">
                                <span className="material-symbols-outlined text-primary" aria-hidden>
                                    local_parking
                                </span>
                                <div className="text-left">
                                    <p className="font-bold text-on-surface">Parking Status</p>
                                    <p className="text-xs text-on-surface-variant">Live valet availability</p>
                                </div>
                            </button>
                        </div>

                        <div className="pt-6 border-t border-outline-variant/30">
                            <p className="text-xs text-on-surface-variant font-medium mb-4">ACCEPTED CARRIERS</p>
                            <div className="flex flex-wrap gap-2">
                                {carriers.map((c) => (
                                    <span key={c} className="px-2 py-1 bg-white text-[10px] font-bold rounded border border-outline-variant/20">
                                        {String(c).toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="font-bold text-on-surface">Phone & Address</p>
                        <p className="text-sm text-on-surface-variant">{formatAddress(h) || '—'}</p>
                        {h?.emergency_phone ? (
                            <p className="text-sm text-on-surface-variant">
                                Emergency: <a className="font-bold text-primary" href={`tel:${String(h.emergency_phone).replace(/\s/g, '')}`}>{h.emergency_phone}</a>
                            </p>
                        ) : null}
                    </div>
                </aside>
            </main>

            <HospitalReviewModal
                slug={slug}
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onSubmitted={() => {
                    setReviewModalOpen(false);
                    refreshReviews();
                }}
            />
        </article>
    );
}

