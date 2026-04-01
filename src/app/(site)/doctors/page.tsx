// @ts-nocheck
'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DoctorSearchCard from '@/components/doctors/DoctorSearchCard';
import { doctorsIndexUrl, fetchJson, specialtiesIndexUrl } from '@/api/publicApi';
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

function DoctorsPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const commitSearchParams = (next: URLSearchParams) => {
        const q = next.toString();
        router.replace(q ? `${pathname}?${q}` : pathname);
    };
    const [specialties, setSpecialties] = useState([]);

    const search = searchParams.get('search') || searchParams.get('q') || '';
    const district = searchParams.get('district') || searchParams.get('location') || '';
    const specialty = searchParams.get('specialty') || '';

    // Frontend-only sort/filter (the backend index endpoint only fully supports name/featured style ordering).
    const sortMode = searchParams.get('sort') || 'rating';
    const [distanceMaxKm, setDistanceMaxKm] = useState(5);
    const [genderMale, setGenderMale] = useState(false);
    const [genderFemale, setGenderFemale] = useState(true);
    const [feeMin, setFeeMin] = useState('');
    const [feeMax, setFeeMax] = useState('');
    const [selectedHospitalKeys, setSelectedHospitalKeys] = useState([]);

    const urlForPage = useCallback(
        (page) =>
            doctorsIndexUrl({
                search: search || undefined,
                district: district || undefined,
                specialty: specialty || undefined,
                page,
                per_page: PER_PAGE,
                sort: 'name',
            }),
        [search, district, specialty],
    );

    const { rows, meta, loading, loadingMore, error, sentinelRef, loadMore } = useInfiniteResourceList(urlForPage);
    const hasMore = meta && meta.current_page < meta.last_page;

    useEffect(() => {
        fetchJson(specialtiesIndexUrl())
            .then((json) => setSpecialties(json.data || []))
            .catch(() => setSpecialties([]));
    }, []);

    function applyFilters(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const next = new URLSearchParams();
        const s = fd.get('search')?.trim();
        const d = fd.get('district')?.trim();
        const sp = fd.get('specialty')?.trim();
        if (s) next.set('search', s);
        if (d) next.set('district', d);
        if (sp) next.set('specialty', sp);
        commitSearchParams(next);
    }

    const selectedSpecialtyName =
        specialties.find((sp) => sp.slug === specialty || String(sp.id) === String(specialty))?.name || '';

    const distanceCenter = districtCenter(district);

    const cards = rows.map((doc) => {
        let distanceKm = null;
        if (distanceCenter && doc?.latitude != null && doc?.longitude != null) {
            const km = approxDistanceKm(Number(doc.latitude), Number(doc.longitude), distanceCenter[0], distanceCenter[1]);
            distanceKm = km == null ? null : Math.round(km * 10) / 10;
        }
        return { doc, distanceKm };
    });

    const searchFormDistrictDefault = district;
    const searchFormSpecialtyDefault =
        specialties.find((sp) => sp.slug === specialty || String(sp.id) === String(specialty))?.slug || '';

    // Sidebar hospitals list isn't loaded on the doctors index endpoint; fall back to clinic names.
    const hospitalLikeNames = (() => {
        const set = new Set();
        rows.forEach((d) => {
            const v = d?.clinic_name;
            if (v && String(v).trim()) set.add(v);
        });
        return [...set].slice(0, 8);
    })();

    const feeMinNum = feeMin.trim() === '' ? null : Number(feeMin);
    const feeMaxNum = feeMax.trim() === '' ? null : Number(feeMax);
    const feeMinValue = feeMinNum != null && !Number.isNaN(feeMinNum) ? feeMinNum : null;
    const feeMaxValue = feeMaxNum != null && !Number.isNaN(feeMaxNum) ? feeMaxNum : null;

    const hospitalKeySet = new Set(selectedHospitalKeys.map((k) => String(k).trim().toLowerCase()).filter(Boolean));
    const distanceEnabled = !!distanceCenter && Number(distanceMaxKm) > 0;

    const displayCards = (() => {
        const q = search.trim().toLowerCase();
        const loc = district.trim().toLowerCase();

        const filtered = cards.filter(({ doc, distanceKm: dKm }) => {
            if (!doc) return false;

            if (q) {
                const haystack = [
                    doc.first_name,
                    doc.last_name,
                    doc.specialty?.name,
                    doc.sub_specialty,
                    doc.clinic_name,
                    doc.district,
                    doc.municipality,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }

            if (loc) {
                const locationText = [doc.district, doc.municipality, doc.city].filter(Boolean).join(' ').toLowerCase();
                if (!locationText.includes(loc)) return false;
            }

            // Distance filter (frontend computed approximate distance)
            if (distanceEnabled) {
                if (dKm == null) return false;
                if (dKm > distanceMaxKm) return false;
            }

            // Gender filter (frontend)
            if (!genderMale && !genderFemale) return false;
            if (doc.gender === 'male' && !genderMale) return false;
            if (doc.gender === 'female' && !genderFemale) return false;
            if (doc.gender === 'other') {
                if (!(genderMale && genderFemale)) return false;
            }

            // Fee filter (frontend overlap)
            const docFeeMin = doc?.consultation_fee_min != null ? Number(doc.consultation_fee_min) : null;
            const docFeeMax = doc?.consultation_fee_max != null ? Number(doc.consultation_fee_max) : null;
            const lower = docFeeMin ?? docFeeMax;
            const upper = docFeeMax ?? docFeeMin;

            if (feeMinValue != null) {
                if (upper == null || Number.isNaN(upper)) return false;
                if (upper < feeMinValue) return false;
            }
            if (feeMaxValue != null) {
                if (lower == null || Number.isNaN(lower)) return false;
                if (lower > feeMaxValue) return false;
            }

            // Hospitals filter (frontend; uses clinic_name)
            if (hospitalKeySet.size > 0) {
                const clinicLower = (doc?.clinic_name ? String(doc.clinic_name) : '').trim().toLowerCase();
                if (!clinicLower || !hospitalKeySet.has(clinicLower)) return false;
            }

            return true;
        });

        const nameForSort = (d) => `${d?.last_name || ''} ${d?.first_name || ''}`.trim().toLowerCase();
        const distanceSortKey = (x) => (x.distanceKm == null ? Number.POSITIVE_INFINITY : x.distanceKm);
        const ratingSortKey = (x) =>
            x.doc?.average_rating == null ? -Infinity : Number(x.doc.average_rating);
        const earliestSortKey = (x) => {
            if (!x.doc?.published_at) return Number.POSITIVE_INFINITY;
            const t = new Date(x.doc.published_at).getTime();
            return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
        };

        return [...filtered].sort((a, b) => {
            if (sortMode === 'nearest') {
                const dk = distanceSortKey(a) - distanceSortKey(b);
                if (dk !== 0) return dk;
                const rk = ratingSortKey(b) - ratingSortKey(a);
                if (rk !== 0) return rk;
                return nameForSort(a.doc).localeCompare(nameForSort(b.doc));
            }
            if (sortMode === 'earliest') {
                const ek = earliestSortKey(a) - earliestSortKey(b);
                if (ek !== 0) return ek;
                const rk = ratingSortKey(b) - ratingSortKey(a);
                if (rk !== 0) return rk;
                return nameForSort(a.doc).localeCompare(nameForSort(b.doc));
            }

            // Default: rating
            const rk = ratingSortKey(b) - ratingSortKey(a);
            if (rk !== 0) return rk;
            const dk = distanceSortKey(a) - distanceSortKey(b);
            if (dk !== 0) return dk;
            return nameForSort(a.doc).localeCompare(nameForSort(b.doc));
        });
    })();

    const pinDoctors = displayCards
        .map((x) => x.doc)
        .filter((d) => d && d.latitude != null && d.longitude != null)
        .slice(0, 6);

    const pinsLayout = (() => {
        if (!pinDoctors.length) return [];
        const lats = pinDoctors.map((d) => Number(d.latitude));
        const lons = pinDoctors.map((d) => Number(d.longitude));
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const latSpan = maxLat - minLat || 1;
        const lonSpan = maxLon - minLon || 1;

        return pinDoctors.map((d) => {
            const normX = (Number(d.longitude) - minLon) / lonSpan; // 0..1
            const normY = (Number(d.latitude) - minLat) / latSpan; // 0..1
            const left = 20 + normX * 60; // %
            const top = 18 + (1 - normY) * 64; // %
            return { doc: d, left, top };
        });
    })();

    return (
        <div className="min-h-screen bg-surface">
            {/* Sticky Search Bar & Filter Chips */}
            <section className="sticky top-[72px] z-40 bg-surface-container-low border-b border-outline-variant/20 px-8 py-4">
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 bg-surface-container-lowest px-6 py-3 rounded-xl shadow-sm border border-outline-variant/10">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-on-surface">
                                {selectedSpecialtyName ? selectedSpecialtyName : 'All Specialties'}
                            </span>
                        </div>
                        <div className="w-px h-6 bg-outline-variant/30" />
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-on-surface">{district || 'Any District'}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const el = document.getElementById('doctor-search-form');
                                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className="ml-4 text-sm font-bold text-primary hover:underline transition-all"
                        >
                            Edit Search
                        </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                        {district ? (
                            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
                                In {district}
                                <button
                                    type="button"
                                    aria-label="Remove district filter"
                                    className="text-[18px] leading-none cursor-pointer"
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams.toString());
                                        next.delete('district');
                                        commitSearchParams(next);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ) : null}

                        {selectedSpecialtyName ? (
                            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
                                {selectedSpecialtyName}
                                <button
                                    type="button"
                                    aria-label="Remove specialty filter"
                                    className="text-[18px] leading-none cursor-pointer"
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams.toString());
                                        next.delete('specialty');
                                        commitSearchParams(next);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>

            {/* Results Info */}
            <div className="px-8 py-6 max-w-screen-2xl mx-auto flex items-center justify-between gap-2">
                <h1 className="font-headline text-xl font-bold text-on-surface">
                    Showing {displayCards.length} Doctors
                    {district ? ` near ${district}` : ''}
                    {selectedSpecialtyName ? ` (${selectedSpecialtyName})` : ''}
                </h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-on-surface-variant font-medium">Sort by:</span>
                    <select
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-primary cursor-pointer"
                        value={sortMode}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams.toString());
                            next.set('sort', e.target.value);
                            commitSearchParams(next);
                        }}
                    >
                        <option value="rating">Rating</option>
                        <option value="nearest">Nearest</option>
                        <option value="earliest">Earliest Available</option>
                    </select>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8 px-8 max-w-screen-2xl mx-auto mb-20">
                {/* LEFT: Filters Sidebar & Cards */}
                <div className="lg:w-[60%] flex flex-col md:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <aside className="lg:w-[320px] flex-shrink-0 space-y-8 sticky top-48 self-start">
                        {/* Search form (drives existing query params) */}
                        <div id="doctor-search-form" className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-sm">
                            <h3 className="font-headline font-bold text-on-surface mb-4 text-base">Search</h3>
                            <form onSubmit={applyFilters} className="space-y-4">
                                <div>
                                    <label htmlFor="fd-search" className="font-ui mb-1 block text-xs font-medium text-on-surface-variant">
                                        Name or keyword
                                    </label>
                                    <input
                                        id="fd-search"
                                        name="search"
                                        defaultValue={search}
                                        placeholder="e.g. cardiology"
                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-sm focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fd-district" className="font-ui mb-1 block text-xs font-medium text-on-surface-variant">
                                        District / city
                                    </label>
                                    <input
                                        id="fd-district"
                                        name="district"
                                        defaultValue={searchFormDistrictDefault}
                                        placeholder="e.g. Kathmandu"
                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-sm focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fd-specialty" className="font-ui mb-1 block text-xs font-medium text-on-surface-variant">
                                        Specialty
                                    </label>
                                    <select
                                        id="fd-specialty"
                                        name="specialty"
                                        defaultValue={searchFormSpecialtyDefault || specialty}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-sm focus:ring-primary/20"
                                    >
                                        <option value="">All specialties</option>
                                        {specialties.map((sp) => (
                                            <option key={sp.id} value={sp.slug || String(sp.id)}>
                                                {sp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                                >
                                    Apply filters
                                </button>
                            </form>
                        </div>

                        <div>
                            <h3 className="font-headline font-bold text-on-surface mb-4">Distance</h3>
                            <input
                                className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                                max="20"
                                min="1"
                                type="range"
                                value={distanceMaxKm}
                                onChange={(e) => setDistanceMaxKm(Number(e.target.value))}
                            />
                            <div className="flex justify-between mt-2 text-xs font-medium text-on-surface-variant">
                                <span>1km</span>
                                <span>{distanceMaxKm}km</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-headline font-bold text-on-surface mb-4">Gender</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                                        type="checkbox"
                                        checked={genderMale}
                                        onChange={(e) => setGenderMale(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Male</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                                        type="checkbox"
                                        checked={genderFemale}
                                        onChange={(e) => setGenderFemale(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Female</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-headline font-bold text-on-surface mb-4">Fee Range (NPR)</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-sm focus:ring-primary/20"
                                    placeholder="Min"
                                    type="text"
                                    value={feeMin}
                                    onChange={(e) => setFeeMin(e.target.value)}
                                />
                                <input
                                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-2 text-sm focus:ring-primary/20"
                                    placeholder="Max"
                                    type="text"
                                    value={feeMax}
                                    onChange={(e) => setFeeMax(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-headline font-bold text-on-surface mb-4">Hospitals</h3>
                            <div className="space-y-3 max-h-48 overflow-y-auto hide-scrollbar">
                                {hospitalLikeNames.length ? (
                                    hospitalLikeNames.map((n) => (
                                        <label key={n} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                                                type="checkbox"
                                                checked={selectedHospitalKeys.includes(String(n).trim().toLowerCase())}
                                                onChange={(e) => {
                                                    const key = String(n).trim().toLowerCase();
                                                    setSelectedHospitalKeys((prev) => {
                                                        const has = prev.includes(key);
                                                        if (e.target.checked && !has) return [...prev, key];
                                                        if (!e.target.checked && has) return prev.filter((x) => x !== key);
                                                        return prev;
                                                    });
                                                }}
                                            />
                                            <span className="text-sm font-medium group-hover:text-primary transition-colors">{n}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-on-surface-variant font-medium">No clinics loaded yet.</p>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Results Column */}
                    <div className="flex-1 space-y-6">
                        {loading ? (
                            <p className="font-headline py-12 text-center text-on-surface-variant">Loading doctors…</p>
                        ) : error && displayCards.length === 0 ? (
                            <p className="rounded-xl border border-error-container bg-error-container/20 p-6 text-center text-sm text-error">
                                {error}
                            </p>
                        ) : displayCards.length === 0 ? (
                            <p className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-12 text-center text-sm text-on-surface-variant">
                                No doctors match your filters. Try adjusting search or location.
                            </p>
                        ) : (
                            <>
                                {displayCards.map(({ doc, distanceKm }) => (
                                    <div key={doc.id} className="relative">
                                        <DoctorSearchCard doctor={doc} distanceKm={distanceKm} />
                                    </div>
                                ))}

                                <div ref={sentinelRef} className="h-px w-full" aria-hidden />
                                {hasMore ? (
                                    <div className="pt-8 flex justify-center">
                                        <button
                                            type="button"
                                            className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                            onClick={loadMore}
                                            disabled={loadingMore}
                                        >
                                            {loadingMore ? 'Loading more…' : 'Load more doctors'}
                                        </button>
                                    </div>
                                ) : null}
                                {!loading && !loadingMore && displayCards.length > 0 && !hasMore ? (
                                    <p className="py-6 text-center text-xs text-on-surface-variant/80">You’ve reached the end of the list.</p>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT: Map Panel */}
                <div className="lg:w-[40%] hidden lg:block sticky top-48 self-start h-[calc(100vh-220px)] rounded-3xl overflow-hidden border border-outline-variant/20 shadow-xl bg-surface-container-low">
                    <div className="relative w-full h-full">
                        <img
                            className="w-full h-full object-cover"
                            alt=""
                            data-location={district || 'Nepal'}
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO2-fwwPc9v8UDvbViYjTlavf0_rUj0-u1WbB1WoqrhJyKkEZ9g04mhey7n-zsWbwnFsM78AaCJD8lTqonZIcuX7TsCnf_O1asUAImt8sDin1MeFOEJ1EKVD02R6PhPVimKdk0Ol0WwSf78cctt_woHuskHXNy2jbOMnHdu2C8Z1ghT93QrYC3jkDWUsAoE46VvbFWWIlkt-aOpnunGVrhhv--tFTtTcNwYmCQKptL3YVvyW94lcyfASTmBRWmGkAeLVAzNUXZu_Y"
                        />

                        {/* Map Pins */}
                        {pinsLayout.map(({ doc, left, top }) => (
                            <div key={doc.id} className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
                                <div className="bg-primary p-1.5 rounded-full text-on-primary shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
                                    <span className="text-[16px] font-bold" aria-hidden>
                                        +
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Map Overlay Controls */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                            <button className="bg-surface-container-lowest p-3 rounded-2xl shadow-lg hover:bg-slate-50 transition-all" type="button">
                                my_location
                            </button>
                            <div className="bg-surface-container-lowest rounded-2xl shadow-lg flex flex-col overflow-hidden">
                                <button className="p-3 hover:bg-slate-50 transition-all border-b border-outline-variant/10" type="button">
                                    add
                                </button>
                                <button className="p-3 hover:bg-slate-50 transition-all" type="button">
                                    remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface py-20 text-center text-on-surface-variant">Loading…</div>}>
      <DoctorsPageContent />
    </Suspense>
  );
}
