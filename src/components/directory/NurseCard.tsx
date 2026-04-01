// @ts-nocheck
'use client';

import Link from 'next/link';
import Stars from '@/components/ui/Stars';

export type NurseCardNurse = Record<string, unknown> & { slug?: string; id?: number | string };

export default function NurseCard({ nurse }: { nurse: NurseCardNurse }) {
    const name = `${nurse.first_name || ''} ${nurse.last_name || ''}`.trim();
    const spec = nurse.specialty?.name || nurse.sub_specialty || 'Registered nurse';
    const photo = nurse.profile_photo_url || null;
    const district = nurse.district || nurse.municipality || '';
    const rating = nurse.average_rating;

    return (
        <article className="flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm transition hover:border-primary-container/30 hover:shadow-md">
            <div className="flex gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-container-high ring-2 ring-surface-container-lowest">
                    {photo ? (
                        <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-container/20 to-surface-container-high text-lg font-semibold text-on-surface-variant">
                            {(nurse.first_name?.[0] || '?') + (nurse.last_name?.[0] || '')}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    {nurse.verification_status === 'approved' ? (
                        <span className="inline-block rounded-md bg-primary-container/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-container">
                            Verified
                        </span>
                    ) : null}
                    <h2 className="font-body truncate text-base font-semibold text-on-surface">
                        <Link href={`/nurses/${nurse.slug}`} className="hover:text-primary-container">
                            {name || 'Nurse'}
                        </Link>
                    </h2>
                    <p className="font-body truncate text-sm text-on-surface-variant">{spec}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {rating != null ? (
                            <>
                                <Stars value={rating} className="h-3.5 w-3.5" />
                                <span className="font-body text-xs font-medium text-on-surface-variant">{Number(rating).toFixed(1)}</span>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
            {district ? (
                <p className="font-body mt-3 text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">{district}</p>
            ) : null}
            <div className="mt-4 flex gap-2">
                <Link href={`/nurses/${nurse.slug}`}
                    className="font-body flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-2 text-center text-sm font-medium text-on-surface hover:border-primary-container/40 hover:text-primary-container"
                >
                    View profile
                </Link>
                <Link href={`/nurses/${nurse.slug}`}
                    className="font-body flex-1 rounded-lg bg-primary-container py-2 text-center text-sm font-semibold text-on-primary hover:brightness-95"
                >
                    Contact
                </Link>
            </div>
        </article>
    );
}
