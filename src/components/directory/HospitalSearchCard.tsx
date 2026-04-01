// @ts-nocheck
'use client';

import Link from 'next/link';
import Stars from '@/components/ui/Stars';

function typeLabel(type) {
    const t = String(type || '').trim().toLowerCase();
    const map = {
        private: 'Private',
        government: 'Government',
        community: 'Community',
        poly_clinic: 'Poly Clinic',
        multi_speciality_clinic: 'Multi Speciality Clinic',
        dental_clinic: 'Dental Clinic',
    };
    return map[t] || 'Hospital';
}

function getChips(h) {
    const facilities = Array.isArray(h?.facilities) ? h.facilities : [];
    const chips = facilities.map((x) => String(x)).filter(Boolean).slice(0, 3);
    if (chips.length === 0) return [];
    return chips;
}

function isEmergencyOn(h) {
    const emergencyPhone = h?.emergency_phone != null && String(h.emergency_phone).trim() !== '';
    const traumaCenter = !!h?.is_trauma_center;
    const bedsEmergency = h?.beds_emergency != null ? Number(h.beds_emergency) : null;
    return emergencyPhone || traumaCenter || (bedsEmergency != null && !Number.isNaN(bedsEmergency) && bedsEmergency > 0);
}

function hasInsurance(h) {
    const panels = Array.isArray(h?.insurance_panels) ? h.insurance_panels : [];
    return panels.length > 0;
}

export default function HospitalSearchCard({ hospital: h, distanceKm = null }: { hospital: Record<string, unknown>; distanceKm?: number | null }) {
    const photo = h.profile_photo_url || null;
    const rating = h.average_rating;
    const verified = h.verification_status === 'approved';
    const chips = getChips(h);
    const emergencyOn = isEmergencyOn(h);
    const insuranceOn = hasInsurance(h);

    const locationText = [h.district || h.city, h.city].filter(Boolean).join(', ') || 'Nepal';
    const typeTxt = typeLabel(h.type);
    const feeOrDistance = distanceKm != null ? `${distanceKm} km away` : null;

    return (
        <article className="bg-surface-container-lowest rounded-xl p-5 flex flex-col md:flex-row gap-6 transition-all hover:translate-y-[-2px]">
            <div className="w-full md:w-52 h-40 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
                {photo ? (
                    <img className="w-full h-full object-cover" alt="" src={photo} loading="lazy" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold">
                        {(h.name?.[0] || 'H').toUpperCase()}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-2 gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold font-headline text-on-surface truncate">{h.name}</h3>
                                {verified ? (
                                    <span className="flex items-center gap-1 bg-secondary-container/30 text-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                        <span
                                            className="material-symbols-outlined text-[14px]"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            verified
                                        </span>
                                        Verified
                                    </span>
                                ) : null}
                            </div>

                            <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm" aria-hidden>
                                    location_on
                                </span>
                                <span className="truncate">{locationText}</span>
                            </p>
                        </div>

                        {feeOrDistance ? (
                            <div className="text-right shrink-0">
                                <span className="text-sm font-bold text-primary whitespace-nowrap">{feeOrDistance}</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {chips.length ? (
                            <>
                                {chips.map((c) => (
                                    <span key={c} className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                                        {c}
                                    </span>
                                ))}
                                {Array.isArray(h?.facilities) && h.facilities.length > chips.length ? (
                                    <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                                        +{h.facilities.length - chips.length} more
                                    </span>
                                ) : null}
                            </>
                        ) : (
                            <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                                {typeTxt}
                            </span>
                        )}
                    </div>

                    {rating != null ? (
                        <div className="mt-3 flex items-center gap-2">
                            <Stars value={rating} />
                            <span className="text-xs font-medium text-on-surface-variant">
                                {Number(rating).toFixed(1)}
                            </span>
                            {h.reviews_count != null ? (
                                <span className="text-[10px] text-on-surface-variant/70">({h.reviews_count} reviews)</span>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/10">
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-1 text-secondary font-semibold text-xs">
                            <span className="material-symbols-outlined text-sm" aria-hidden>
                                {String(h.type || '').toLowerCase() === 'government' ? 'account_balance' : 'check_circle'}
                            </span>
                            {typeTxt}
                        </div>

                        {emergencyOn ? (
                            <div className="flex items-center gap-1 text-secondary font-semibold text-xs">
                                <span className="material-symbols-outlined text-sm" aria-hidden>
                                    bolt
                                </span>
                                24/7 Emergency
                            </div>
                        ) : null}

                        {insuranceOn ? (
                            <div className="flex items-center gap-1 text-secondary font-semibold text-xs">
                                <span className="material-symbols-outlined text-sm" aria-hidden>
                                    credit_card
                                </span>
                                Insurance Supported
                            </div>
                        ) : null}
                    </div>

                    <Link href={`/hospitals/${h.slug}`}
                        className="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold transition-transform active:scale-95 shadow-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    );
}

