// @ts-nocheck
'use client';

import Link from 'next/link';
import Stars from '@/components/ui/Stars';

function formatFeeNpr(doc) {
    const min = doc?.consultation_fee_min;
    const max = doc?.consultation_fee_max;
    if (min == null || min === '') return null;
    const nMin = Number(min);
    const nMax = max == null || max === '' ? null : Number(max);
    if (nMax != null && !Number.isNaN(nMax) && nMax > nMin) return `NPR ${nMin} - ${nMax}`;
    if (!Number.isNaN(nMin)) return `NPR ${nMin}`;
    return null;
}

export default function DoctorSearchCard({ doctor, distanceKm = null }: { doctor: Record<string, unknown>; distanceKm?: number | null }) {
    const name = `${doctor?.first_name || ''} ${doctor?.last_name || ''}`.trim() || 'Doctor';
    const photo = doctor?.profile_photo_url || null;

    const specialty =
        doctor?.specialty?.name ||
        (Array.isArray(doctor?.specialties) ? doctor.specialties[0]?.name : null) ||
        doctor?.sub_specialty ||
        'Specialist';

    const rating = doctor?.average_rating;
    const reviewsCount = doctor?.reviews_count;
    const district = doctor?.district || doctor?.municipality || '';

    const verified = doctor?.verification_status === 'approved';
    const feeLine = formatFeeNpr(doctor);

    const teleconsult = !!doctor?.teleconsult_available || !!doctor?.is_online;
    const availabilityLabel = teleconsult ? 'Instant Consult Available' : 'Appointment Available';

    // Index endpoint does not always load hospitals; fall back to clinic info.
    const placeLine =
        doctor?.clinic_name ||
        (Array.isArray(doctor?.hospitals) && doctor.hospitals[0]?.name) ||
        district ||
        '';

    const slug = doctor?.slug;

    return (
        <article className="bg-surface-container-lowest rounded-2xl p-6 transition-all hover:translate-y-[-2px] hover:shadow-lg group">
            <div className="flex gap-6">
                <div className="relative flex-shrink-0">
                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-surface-container-high object-cover">
                        {photo ? (
                            <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-fixed-dim/25 to-surface-container-high text-on-surface font-bold">
                                {(doctor?.first_name?.[0] || '?') + (doctor?.last_name?.[0] || '')}
                            </div>
                        )}
                    </div>

                    {verified ? (
                        <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                            Verified
                        </div>
                    ) : null}
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                            <h2 className="font-headline text-lg font-bold text-on-surface truncate">{name}</h2>
                            <p className="text-sm text-on-surface-variant font-medium truncate">
                                {specialty}
                            </p>
                        </div>

                        {rating != null ? (
                            <div className="flex items-center gap-2 bg-secondary-container/30 px-2 py-1 rounded-lg shrink-0">
                                <Stars value={rating} />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-bold text-on-secondary-container">{Number(rating).toFixed(1)}</span>
                                    {reviewsCount != null ? (
                                        <span className="text-[10px] text-on-secondary-container/70">({Number(reviewsCount)} reviews)</span>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-sm text-on-surface-variant font-medium">
                        {placeLine ? (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                                    apartment
                                </span>
                                <span>{placeLine}</span>
                            </div>
                        ) : null}

                        {distanceKm != null ? (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                                    location_on
                                </span>
                                <span>{distanceKm} km away</span>
                            </div>
                        ) : null}

                        {feeLine ? (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                                    payments
                                </span>
                                <span>{feeLine}</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {availabilityLabel}
                        </span>
                        <Link href={slug ? `/doctors/${slug}` : '/doctors'}
                            className="bg-gradient-to-br from-primary-container to-secondary text-on-primary px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all"
                        >
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

