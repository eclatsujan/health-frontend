import Link from 'next/link';
import Stars from '@/components/ui/Stars';

export type CollegeCardCollege = {
  slug: string;
  name?: string | null;
  city?: string | null;
  district?: string | null;
  average_rating?: number | null;
};

type CollegeCardProps = {
  college: CollegeCardCollege;
};

export default function CollegeCard({ college: c }: CollegeCardProps) {
  const rating = c.average_rating;
  const initial = (c.name?.[0] || 'C').toUpperCase();

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-slate-200 text-lg font-bold text-slate-700">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-ui truncate text-base font-semibold text-slate-900">
            <Link href={`/colleges/${c.slug}`} className="hover:text-[#0d9488]">
              {c.name || 'College'}
            </Link>
          </h2>
          <p className="font-ui truncate text-sm text-slate-600">
            {c.city || c.district || 'Nepal'}
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
      {c.district ? (
        <p className="font-ui mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {c.district}
        </p>
      ) : null}
      <div className="mt-4">
        <Link
          href={`/colleges/${c.slug}`}
          className="font-ui block w-full rounded-lg bg-[#0d9488] py-2 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
