/** Shared home directory preview limits and mapping (server ISR + client TanStack Query). */

export const DOCTOR_LIMIT = 5;
export const HOSPITAL_LIMIT = 5;
export const DIRECTORY_FETCH_LIMIT = 10;

function normalizeName(first: unknown, last: unknown) {
  return `${first || ''} ${last || ''}`.trim();
}

export function formatRating(val: unknown) {
  if (val == null || val === '') return '—';
  const n = Number(val);
  if (Number.isNaN(n)) return '—';
  return n.toFixed(1);
}

function typeLabel(type: unknown) {
  const t = String(type || '')
    .trim()
    .toLowerCase();
  const map: Record<string, string> = {
    private: 'Private',
    government: 'Government',
    community: 'Community',
    poly_clinic: 'Poly Clinic',
    multi_speciality_clinic: 'Multi Speciality Clinic',
    dental_clinic: 'Dental Clinic',
  };
  return map[t] || 'Hospital';
}

export function hospitalCoverFromType(type: unknown) {
  const t = String(type || '')
    .trim()
    .toLowerCase();
  const map: Record<string, string> = {
    government: 'from-cyan-600/70 to-slate-800/90',
    private: 'from-teal-600/80 to-slate-800/90',
    multi_speciality_clinic: 'from-emerald-600/70 to-slate-800/90',
    dental_clinic: 'from-indigo-600/70 to-slate-800/90',
    poly_clinic: 'from-sky-600/70 to-slate-800/90',
    community: 'from-lime-600/70 to-slate-800/90',
  };
  return map[t] || 'from-slate-600/70 to-slate-800/90';
}

function isEmergencyOn(h: Record<string, unknown>) {
  const emergencyPhone =
    h?.emergency_phone != null && String(h.emergency_phone).trim() !== '';
  const traumaCenter = !!h?.is_trauma_center;
  const bedsEmergency =
    h?.beds_emergency != null ? Number(h.beds_emergency) : null;
  return (
    emergencyPhone ||
    traumaCenter ||
    (bedsEmergency != null && !Number.isNaN(bedsEmergency) && bedsEmergency > 0)
  );
}

export type HomeDoctorCard = {
  key: string;
  slug?: string;
  name: string;
  role: string;
  city: string;
  tag: string;
  rating: string;
};

export type HomeHospitalCard = {
  key: string;
  slug?: string;
  name: string;
  role: string;
  city: string;
  badge: string;
  cover: string;
};

function mapDoctor(d: Record<string, unknown>): HomeDoctorCard {
  const name = normalizeName(d?.first_name, d?.last_name) || 'Doctor';
  const specialty =
    (d?.specialty as { name?: string } | undefined)?.name ||
    (Array.isArray(d?.specialties)
      ? (d.specialties as { name?: string }[])?.[0]?.name
      : null) ||
    (d?.sub_specialty as string) ||
    'Specialist';
  const placeLine = d?.clinic_name
    ? `${specialty} · ${d.clinic_name}`
    : specialty;
  const city = (d?.district || d?.municipality || '') as string;
  const verified = d?.verification_status === 'approved';
  const rating = formatRating(d?.average_rating);
  return {
    key: (d?.slug as string) || name,
    slug: d?.slug as string | undefined,
    name,
    role: placeLine,
    city,
    tag: verified ? 'Verified' : 'Pending',
    rating,
  };
}

function mapHospital(h: Record<string, unknown>): HomeHospitalCard {
  const name = (h?.name as string) || 'Hospital';
  const typeTxt = typeLabel(h?.type);
  const emergencyOn = isEmergencyOn(h);
  const role = emergencyOn ? `${typeTxt} · Emergency` : `${typeTxt}`;
  const city = (h?.city || h?.district || '') as string;
  const verified = h?.verification_status === 'approved';
  const cover = hospitalCoverFromType(h?.type);
  return {
    key: (h?.slug as string) || name,
    slug: h?.slug as string | undefined,
    name,
    role,
    city,
    badge: verified ? 'Verified' : 'Partner',
    cover,
  };
}

export function processRawDoctorsForHome(raw: unknown[]): HomeDoctorCard[] {
  const docs = raw as Record<string, unknown>[];
  return [...docs]
    .sort(
      (a, b) => Number(b?.average_rating ?? 0) - Number(a?.average_rating ?? 0),
    )
    .slice(0, DOCTOR_LIMIT)
    .map(mapDoctor);
}

export function processRawHospitalsForHome(raw: unknown[]): HomeHospitalCard[] {
  const hosps = raw as Record<string, unknown>[];
  return [...hosps]
    .sort(
      (a, b) => Number(b?.average_rating ?? 0) - Number(a?.average_rating ?? 0),
    )
    .slice(0, HOSPITAL_LIMIT)
    .map(mapHospital);
}
