import Link from 'next/link';
import Stars from '@/components/ui/Stars';

export type NurseCardNurse = {
  slug: string;
  first_name?: string | null;
  last_name?: string | null;
  specialty?: { name?: string };
  sub_specialty?: string | null;
  profile_photo_url?: string | null;
  district?: string | null;
  municipality?: string | null;
  average_rating?: number | null;
  verification_status?: string;
};

type NurseCardProps = {
  nurse: NurseCardNurse;
};

export default function NurseCard({ nurse }: NurseCardProps) {
  const name = `${nurse.first_name || ''} ${nurse.last_name || ''}`.trim();
  const spec =
    nurse.specialty?.name || nurse.sub_specialty || 'Registered nurse';
  const photo = nurse.profile_photo_url || null;
  const district = nurse.district || nurse.municipality || '';
  const rating = nurse.average_rating;

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d9488]/20 to-slate-200 text-lg font-semibold text-slate-600">
              {(nurse.first_name?.[0] || '?') + (nurse.last_name?.[0] || '')}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {nurse.verification_status === 'approved' ? (
            <span className="inline-block rounded-md bg-[#0d9488]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0f766e]">
              Verified
            </span>
          ) : null}
          <h2 className="font-ui truncate text-base font-semibold text-slate-900">
            <Link
              href={`/nurses/${nurse.slug}`}
              className="hover:text-[#0d9488]"
            >
              {name || 'Nurse'}
            </Link>
          </h2>
          <p className="font-ui truncate text-sm text-slate-600">{spec}</p>
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
      {district ? (
        <p className="font-ui mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {district}
        </p>
      ) : null}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/nurses/${nurse.slug}`}
          className="font-ui flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-sm font-medium text-slate-700 hover:border-[#0d9488]/40 hover:text-[#0d9488]"
        >
          View profile
        </Link>
        <Link
          href={`/nurses/${nurse.slug}`}
          className="font-ui flex-1 rounded-lg bg-[#0d9488] py-2 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
        >
          Contact
        </Link>
      </div>
    </article>
  );
}
