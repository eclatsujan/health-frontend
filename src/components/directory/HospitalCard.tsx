import Link from 'next/link';
import Stars from '@/components/ui/Stars';

export type HospitalCardHospital = {
  slug: string;
  name?: string | null;
  type?: string | null;
  city?: string | null;
  district?: string | null;
  phone?: string | null;
  profile_photo_url?: string | null;
  is_partner?: boolean;
  average_rating?: number | null;
};

type HospitalCardProps = {
  hospital: HospitalCardHospital;
};

export default function HospitalCard({ hospital: h }: HospitalCardProps) {
  const photo = h.profile_photo_url || null;
  const rating = h.average_rating;

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-2 ring-white">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600/20 to-slate-200 text-lg font-bold text-slate-600">
              {(h.name?.[0] || 'H').toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {h.is_partner ? (
            <span className="inline-block rounded-md bg-[#0d9488]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0f766e]">
              Partner
            </span>
          ) : null}
          <h2 className="font-ui truncate text-base font-semibold text-slate-900">
            <Link
              href={`/hospitals/${h.slug}`}
              className="hover:text-[#0d9488]"
            >
              {h.name || 'Hospital'}
            </Link>
          </h2>
          <p className="font-ui truncate text-sm text-slate-600">
            {h.type || 'Hospital'} · {h.city || h.district || 'Nepal'}
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
      {h.district ? (
        <p className="font-ui mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {h.district}
        </p>
      ) : null}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/hospitals/${h.slug}`}
          className="font-ui flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-sm font-medium text-slate-700 hover:border-[#0d9488]/40 hover:text-[#0d9488]"
        >
          View
        </Link>
        {h.phone ? (
          <a
            href={`tel:${h.phone}`}
            className="font-ui flex-1 rounded-lg bg-[#0d9488] py-2 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
          >
            Call
          </a>
        ) : (
          <Link
            href={`/hospitals/${h.slug}`}
            className="font-ui flex-1 rounded-lg bg-[#0d9488] py-2 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
          >
            Details
          </Link>
        )}
      </div>
    </article>
  );
}
