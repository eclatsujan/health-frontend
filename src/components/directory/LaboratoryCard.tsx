import Link from 'next/link';
import Stars from '@/components/ui/Stars';

export type LaboratoryCardLab = {
  slug: string;
  name?: string | null;
  city?: string | null;
  district?: string | null;
  phone?: string | null;
  parent?: { name?: string | null };
  average_rating?: number | null;
};

type LaboratoryCardProps = {
  laboratory: LaboratoryCardLab;
};

export default function LaboratoryCard({
  laboratory: lab,
}: LaboratoryCardProps) {
  const rating = lab.average_rating;
  const initial = (lab.name?.[0] || 'L').toUpperCase();

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-slate-200 text-lg font-bold text-slate-700">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          {lab.parent?.name ? (
            <p className="font-ui truncate text-[11px] font-medium text-slate-500">
              {lab.parent.name}
            </p>
          ) : null}
          <h2 className="font-ui truncate text-base font-semibold text-slate-900">
            <Link href={`/labs/${lab.slug}`} className="hover:text-[#0d9488]">
              {lab.name || 'Laboratory'}
            </Link>
          </h2>
          <p className="font-ui truncate text-sm text-slate-600">
            {lab.city || lab.district || 'Nepal'}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {rating != null ? (
              <>
                <Stars value={rating} className="h-3.5 w-3.5" />
                <span className="font-ui text-xs font-medium text-slate-500">
                  {Number(rating).toFixed(1)}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {lab.district ? (
        <p className="font-ui mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {lab.district}
        </p>
      ) : null}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/labs/${lab.slug}`}
          className="font-ui flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-sm font-medium text-slate-700 hover:border-[#0d9488]/40 hover:text-[#0d9488]"
        >
          View
        </Link>
        {lab.phone ? (
          <a
            href={`tel:${lab.phone}`}
            className="font-ui flex-1 rounded-lg bg-[#0d9488] py-2 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
          >
            Call
          </a>
        ) : (
          <Link
            href={`/labs/${lab.slug}`}
            className="font-ui flex-1 rounded-lg bg-[#0d9488] py-2 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
          >
            Details
          </Link>
        )}
      </div>
    </article>
  );
}
