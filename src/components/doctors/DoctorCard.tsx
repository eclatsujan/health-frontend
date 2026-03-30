import Link from 'next/link';
import Stars from '@/components/ui/Stars';

export type DoctorCardDoctor = {
  slug: string;
  first_name?: string | null;
  last_name?: string | null;
  specialties?: { name?: string; slug?: string }[];
  specialty?: { name?: string; slug?: string };
  sub_specialty?: string | null;
  profile_photo_url?: string | null;
  district?: string | null;
  municipality?: string | null;
  average_rating?: number | null;
  verification_status?: string;
};

type DoctorCardProps = {
  doctor: DoctorCardDoctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const name = `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim();
  const firstSpec = Array.isArray(doctor.specialties)
    ? doctor.specialties[0]
    : null;
  const specName =
    firstSpec?.name ||
    doctor.specialty?.name ||
    doctor.sub_specialty ||
    'Specialist';
  const specSlug = firstSpec?.slug || doctor.specialty?.slug;
  const slug = doctor.slug;
  const photo = doctor.profile_photo_url || null;
  const district = doctor.district || doctor.municipality || '';
  const rating = doctor.average_rating;

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
              {(doctor.first_name?.[0] || '?') + (doctor.last_name?.[0] || '')}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {doctor.verification_status === 'approved' ? (
            <span className="inline-block rounded-md bg-[#0d9488]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0f766e]">
              Verified
            </span>
          ) : null}
          <h2 className="font-ui truncate text-base font-semibold text-slate-900">
            <Link href={`/doctors/${slug}`} className="hover:text-[#0d9488]">
              {name || 'Doctor'}
            </Link>
          </h2>
          <p className="font-ui truncate text-sm text-slate-600">
            {specSlug ? (
              <Link
                href={`/specialties/${specSlug}`}
                className="hover:text-[#0d9488] hover:underline"
              >
                {specName}
              </Link>
            ) : (
              specName
            )}
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
      {district ? (
        <p className="font-ui mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {district}
        </p>
      ) : null}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/doctors/${slug}`}
          className="font-ui flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-sm font-medium text-slate-700 hover:border-[#0d9488]/40 hover:text-[#0d9488]"
        >
          View profile
        </Link>
        <Link
          href={`/doctors/${slug}`}
          className="font-ui flex-1 rounded-lg bg-[#0d9488] py-2 text-center text-sm font-semibold text-white hover:bg-[#0f766e]"
        >
          Book
        </Link>
      </div>
    </article>
  );
}
