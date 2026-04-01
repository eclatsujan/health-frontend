// @ts-nocheck
'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import HospitalSearchCard from '@/components/directory/HospitalSearchCard';
import { hospitalsIndexUrl } from '@/api/publicApi';
import { useInfiniteResourceList } from '@/hooks/useInfiniteResourceList';

const PER_PAGE = 12;

function approxDistanceKm(lat1, lon1, lat2, lon2) {
    if ([lat1, lon1, lat2, lon2].some((v) => v == null || Number.isNaN(Number(v)))) return null;
    const toRad = (d) => (Number(d) * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function districtCenter(district) {
    const key = String(district || '').trim().toLowerCase();
    const centers = {
        kathmandu: [27.7172, 85.324],
        lalitpur: [27.6243, 85.3131],
        bhaktapur: [27.671, 85.4298],
        pokhara: [28.2096, 83.9856],
        biratnagar: [26.4525, 87.2718],
    };
    if (!key) return null;
    if (centers[key]) return centers[key];
    return null;
}

function normalizeText(s) {
    return String(s || '').trim().toLowerCase();
}

function isEyeHospitalCandidate(h) {
    const haystack = [
        h?.name,
        h?.type,
        h?.description,
        Array.isArray(h?.facilities) ? h.facilities.join(' ') : '',
        Array.isArray(h?.accreditations) ? h.accreditations.join(' ') : '',
    ]
        .map(normalizeText)
        .join(' ');

    // Loose matching because backend doesn't have dedicated "eye_hospital" type.
    return ['eye', 'ophthalm', 'ophthalmology', 'cataract', 'laser eye', 'optical', 'vision'].some((kw) => haystack.includes(kw));
}

function HospitalsPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const commitSearchParams = (next: URLSearchParams) => {
        const q = next.toString();
        router.replace(q ? `${pathname}?${q}` : pathname);
    };

    const search = searchParams.get('search') || searchParams.get('q') || '';
    const district = searchParams.get('district') || searchParams.get('location') || '';

    // UI state (mapped to API query param only when possible)
    const [facilityMode, setFacilityMode] = useState('all_types'); // all_types | multi | eye | dental
    const [ownershipMode, setOwnershipMode] = useState('private_gov'); // private_gov | private | government
    const [emergencyOnly, setEmergencyOnly] = useState(false);
    const [insuranceOnly, setInsuranceOnly] = useState(false);

    // Keep facilityMode in sync with API type param when it's a direct mapping
    useEffect(() => {
        const apiType = String(searchParams.get('type') || '').trim();
        if (apiType === 'multi_speciality_clinic') setFacilityMode('multi');
        else if (apiType === 'dental_clinic') setFacilityMode('dental');
        else setFacilityMode('all_types');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const apiType = useMemo(() => {
        if (facilityMode === 'multi') return 'multi_speciality_clinic';
        if (facilityMode === 'dental') return 'dental_clinic';
        // Eye hospital / all types can't be expressed with current backend `type` param.
        return '';
    }, [facilityMode]);

    const urlForPage = useCallback(
        (page) =>
            hospitalsIndexUrl({
                search: search || undefined,
                district: district || undefined,
                type: apiType || undefined,
                page,
                per_page: PER_PAGE,
            }),
        [search, district, apiType],
    );

    const { rows, meta, loading, loadingMore, error, sentinelRef, loadMore } = useInfiniteResourceList(urlForPage);
    const hasMore = meta && meta.current_page < meta.last_page;

    function applyFilters(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const next = new URLSearchParams();
        const s = fd.get('search')?.trim();
        const d = fd.get('district')?.trim();
        // Facility filter uses API `type` only for multi/dental; "Eye" and ownership are client-side.
        // Keep API type in sync only when the input includes it.
        const t = fd.get('type')?.trim();
        if (s) next.set('search', s);
        if (d) next.set('district', d);
        // Respect existing type if present, otherwise we clear so it doesn't conflict with facilityMode selection.
        if (t) next.set('type', t);
        else next.delete('type');
        commitSearchParams(next);
    }

    const districtCenterRow = districtCenter(district);

    const cards = useMemo(() => {
        return rows.map((h) => {
            let distanceKm = null;
            if (districtCenterRow && h?.latitude != null && h?.longitude != null) {
                const km = approxDistanceKm(Number(h.latitude), Number(h.longitude), districtCenterRow[0], districtCenterRow[1]);
                distanceKm = km == null ? null : Math.round(km * 10) / 10;
            }
            return { h, distanceKm };
        });
    }, [rows, districtCenterRow]);

    const displayCards = useMemo(() => {
        const q = search.trim().toLowerCase();
        const loc = district.trim().toLowerCase();

        const ownershipSet = (() => {
            if (ownershipMode === 'private') return new Set(['private']);
            if (ownershipMode === 'government') return new Set(['government']);
            // private_gov
            return new Set(['private', 'government']);
        })();

        const facilityMatches = (h) => {
            if (facilityMode === 'multi') return String(h?.type || '').trim().toLowerCase() === 'multi_speciality_clinic';
            if (facilityMode === 'dental') return String(h?.type || '').trim().toLowerCase() === 'dental_clinic';
            if (facilityMode === 'eye') return isEyeHospitalCandidate(h);
            return true;
        };

        const emergencyMatches = (h) => {
            if (!emergencyOnly) return true;
            const emergencyPhone = h?.emergency_phone != null && String(h.emergency_phone).trim() !== '';
            const traumaCenter = !!h?.is_trauma_center;
            const bedsEmergency = h?.beds_emergency != null ? Number(h.beds_emergency) : null;
            return emergencyPhone || traumaCenter || (bedsEmergency != null && !Number.isNaN(bedsEmergency) && bedsEmergency > 0);
        };

        const insuranceMatches = (h) => {
            if (!insuranceOnly) return true;
            const panels = Array.isArray(h?.insurance_panels) ? h.insurance_panels : [];
            return panels.length > 0;
        };

        const ownershipMatches = (h) => {
            if (ownershipSet.size === 0) return true;
            return ownershipSet.has(String(h?.type || '').trim().toLowerCase());
        };

        return cards.filter(({ h }) => {
            if (q) {
                const haystack = [h?.name, h?.type, h?.city, h?.district, h?.description].filter(Boolean).join(' ').toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            if (loc) {
                const locationText = [h?.district, h?.city, h?.address_line1].filter(Boolean).join(' ').toLowerCase();
                if (!locationText.includes(loc)) return false;
            }
            return facilityMatches(h) && ownershipMatches(h) && emergencyMatches(h) && insuranceMatches(h);
        });
    }, [cards, ownershipMode, facilityMode, emergencyOnly, insuranceOnly, search, district]);

    const pins = useMemo(() => {
        return displayCards
            .map(({ h, distanceKm }) => ({ h, distanceKm }))
            .filter(({ h }) => h && h.latitude != null && h.longitude != null)
            .slice(0, 6);
    }, [displayCards]);

    const pinsLayout = useMemo(() => {
        if (!pins.length) return [];
        const lats = pins.map((x) => Number(x.h.latitude));
        const lons = pins.map((x) => Number(x.h.longitude));
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        const latSpan = maxLat - minLat || 1;
        const lonSpan = maxLon - minLon || 1;
        return pins.map(({ h }) => {
            const normX = (Number(h.longitude) - minLon) / lonSpan;
            const normY = (Number(h.latitude) - minLat) / latSpan;
            const left = 20 + normX * 60;
            const top = 18 + (1 - normY) * 64;
            return { h, left, top };
        });
    }, [pins]);

    return (
        <div className="min-h-screen bg-surface pt-24">
            {/* Filter Bar */}
            <section className="bg-surface-container-low px-6 py-4 sticky top-[72px] z-40">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-outline-variant/20">
                        <span className="text-sm font-semibold text-on-surface-variant">Facility:</span>
                        <select
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 pr-6"
                            value={facilityMode}
                            onChange={(e) => {
                                const v = e.target.value;
                                setFacilityMode(v);
                                const next = new URLSearchParams(searchParams.toString());
                                if (v === 'multi') next.set('type', 'multi_speciality_clinic');
                                else if (v === 'dental') next.set('type', 'dental_clinic');
                                else next.delete('type');
                                commitSearchParams(next);
                            }}
                        >
                            <option value="all_types">All Types</option>
                            <option value="multi">Multi-specialty</option>
                            <option value="eye">Eye Hospital</option>
                            <option value="dental">Dental Clinic</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-outline-variant/20">
                        <span className="text-sm font-semibold text-on-surface-variant">Ownership:</span>
                        <select
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 pr-6"
                            value={ownershipMode}
                            onChange={(e) => setOwnershipMode(e.target.value)}
                        >
                            <option value="private_gov">Private &amp; Govt</option>
                            <option value="private">Private</option>
                            <option value="government">Government</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-transform active:scale-95 ${
                            emergencyOnly ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                        onClick={() => setEmergencyOnly((v) => !v)}
                    >
                        <span className="material-symbols-outlined text-sm" aria-hidden>
                            emergency
                        </span>
                        Emergency 24/7
                    </button>

                    <button
                        type="button"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-transform active:scale-95 ${
                            insuranceOnly ? 'bg-secondary-container text-on-secondary' : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                        onClick={() => setInsuranceOnly((v) => !v)}
                    >
                        <span className="material-symbols-outlined text-sm" aria-hidden>
                            shield_with_heart
                        </span>
                        Insurance Support
                    </button>

                    <div className="ml-auto flex items-center gap-2 text-on-surface-variant text-sm whitespace-nowrap">
                        <span className="font-semibold">{displayCards.length}</span> Hospitals found in {district || 'Nepal'}
                    </div>
                </div>
            </section>

            <div className="flex flex-1 relative">
                {/* Hospital List */}
                <section className="w-full lg:w-3/5 px-6 py-8 overflow-y-auto hide-scrollbar">
                    <div className="max-w-5xl mx-auto flex flex-col gap-6">
                        {loading ? (
                            <p className="text-center text-on-surface-variant font-ui py-12">Loading hospitals…</p>
                        ) : error && displayCards.length === 0 ? (
                            <p className="rounded-xl border border-error-container bg-error-container/20 p-6 text-center text-sm text-error">{error}</p>
                        ) : displayCards.length === 0 ? (
                            <p className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-12 text-center text-sm text-on-surface-variant">
                                No hospitals match your filters.
                            </p>
                        ) : (
                            displayCards.map(({ h, distanceKm }) => <HospitalSearchCard key={h.id} hospital={h} distanceKm={distanceKm} />)
                        )}

                        <div ref={sentinelRef} className="h-px w-full" aria-hidden />
                        {hasMore ? (
                            <div className="pt-6 flex justify-center">
                                <button
                                    type="button"
                                    className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => loadMore()}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? 'Loading more…' : 'Load more hospitals'}
                                </button>
                            </div>
                        ) : null}
                        {!loading && !loadingMore && displayCards.length > 0 && !hasMore ? (
                            <p className="py-6 text-center text-xs text-on-surface-variant/80">You’ve reached the end of the list.</p>
                        ) : null}
                    </div>
                </section>

                {/* Sticky Map Area */}
                <section className="hidden lg:block w-2/5 sticky top-[136px] h-[calc(100vh-136px)] bg-surface-container-high overflow-hidden">
                    <div className="relative w-full h-full">
                        <img
                            className="w-full h-full object-cover opacity-60 grayscale-[40%]"
                            alt=""
                            data-location={district || 'Nepal'}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwBhqALx24bj3oUmKgUUBHesEwJmkcEskYEiNw795dyP6sqPb6eaUQO9GKIlAdoxmqwFk7oBftAQfBg94LyLdRKIWKVHbwedzoMcEb-2WLY1E3Imad7LIwOuddV3hVsMGZiq3unlna-VhxJSGA9xAd4l6K6TeXrHEnMOmPsu0ooqtvXpRXt7ZrCfV3L6WmRxeLJHXD9Idet0Qu8qIiojCVRVDWi9SepY9RtplFy4OeVLM9xhbFKtZE-8EIAXUhkZqg0d0YJChFiUI"
                        />

                        {/* Map Overlay Markers */}
                        {pinsLayout.map(({ h: ph, left, top }) => (
                            <div key={ph.id} className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
                                <div className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[22px]" aria-hidden>
                                        local_hospital
                                    </span>
                                </div>
                                <div className="mt-2 bg-surface-container-lowest px-3 py-1 rounded-lg shadow-sm border border-outline-variant/20">
                                    <span className="text-xs font-bold text-on-surface truncate block max-w-[120px]">{ph.name.split(' ')[0]}</span>
                                </div>
                            </div>
                        ))}

                        {/* Map Controls Overlay */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                            <button className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" type="button">
                                <span className="material-symbols-outlined" aria-hidden>
                                    add
                                </span>
                            </button>
                            <button className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" type="button">
                                <span className="material-symbols-outlined" aria-hidden>
                                    remove
                                </span>
                            </button>
                            <button className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-md flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors mt-2" type="button">
                                <span className="material-symbols-outlined" aria-hidden>
                                    my_location
                                </span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}


export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface py-20 text-center text-on-surface-variant">Loading…</div>}>
      <HospitalsPageContent />
    </Suspense>
  );
}
