// @ts-nocheck
'use client';

import Link from 'next/link';
import Stars from '@/components/ui/Stars';

export type LaboratoryCardLab = Record<string, unknown> & { slug?: string; id?: number | string };

export default function LaboratoryCard({ laboratory: lab }: { laboratory: LaboratoryCardLab }) {
    const rating = lab.average_rating;
    const initial = (lab.name?.[0] || 'L').toUpperCase();

    return (
        <article className="flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm transition hover:border-primary-container/30 hover:shadow-md">
            <div className="flex gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-surface-container-high text-lg font-bold text-on-surface">
                    {initial}
                </div>
                <div className="min-w-0 flex-1">
                    {lab.parent?.name ? (
                        <p className="font-body truncate text-[11px] font-medium text-on-surface-variant">{lab.parent.name}</p>
                    ) : null}
                    <h2 className="font-body truncate text-base font-semibold text-on-surface">
                        <Link href={`/labs/${lab.slug}`} className="hover:text-primary-container">
                            {lab.name || 'Laboratory'}
                        </Link>
                    </h2>
                    <p className="font-body truncate text-sm text-on-surface-variant">{lab.city || lab.district || 'Nepal'}</p>
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
            {lab.district ? (
                <p className="font-body mt-3 text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">{lab.district}</p>
            ) : null}
            <div className="mt-4 flex gap-2">
                <Link href={`/labs/${lab.slug}`}
                    className="font-body flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-2 text-center text-sm font-medium text-on-surface hover:border-primary-container/40 hover:text-primary-container"
                >
                    View
                </Link>
                {lab.phone ? (
                    <a
                        href={`tel:${lab.phone}`}
                        className="font-body flex-1 rounded-lg bg-primary-container py-2 text-center text-sm font-semibold text-on-primary hover:brightness-95"
                    >
                        Call
                    </a>
                ) : (
                    <Link href={`/labs/${lab.slug}`}
                        className="font-body flex-1 rounded-lg bg-primary-container py-2 text-center text-sm font-semibold text-on-primary hover:brightness-95"
                    >
                        Details
                    </Link>
                )}
            </div>
        </article>
    );
}
