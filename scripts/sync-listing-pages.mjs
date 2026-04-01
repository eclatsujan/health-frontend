import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hnPages = '/Users/sujan/Projects/personal/HospitalNepal/resources/js/pages';
const hw = path.join(__dirname, '..');

let doctors = fs.readFileSync(path.join(hnPages, 'DoctorsPage.jsx'), 'utf8');
doctors = doctors.replace(
  `import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorSearchCard from '../components/doctors/DoctorSearchCard.jsx';
import { doctorsIndexUrl, fetchJson, specialtiesIndexUrl } from '../api/publicApi.js';
import { useInfiniteResourceList } from '../hooks/useInfiniteResourceList.js';`,
  `// @ts-nocheck
'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DoctorSearchCard from '@/components/doctors/DoctorSearchCard';
import { doctorsIndexUrl, fetchJson, specialtiesIndexUrl } from '@/api/publicApi';
import { useInfiniteResourceList } from '@/hooks/useInfiniteResourceList';`,
  );
doctors = doctors.replace(
  `export default function DoctorsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [specialties, setSpecialties] = useState([]);`,
  `function DoctorsPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const commitSearchParams = (next: URLSearchParams) => {
        const q = next.toString();
        router.replace(q ? \`\${pathname}?\${q}\` : pathname);
    };
    const [specialties, setSpecialties] = useState([]);`,
  );
doctors = doctors.replace(/const next = new URLSearchParams\(searchParams\);/g, 'const next = new URLSearchParams(searchParams.toString());');
doctors = doctors.replace(/setSearchParams\(next\)/g, 'commitSearchParams(next)');
doctors += `

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface py-20 text-center text-on-surface-variant">Loading…</div>}>
      <DoctorsPageContent />
    </Suspense>
  );
}
`;

let hospitals = fs.readFileSync(path.join(hnPages, 'HospitalsPage.jsx'), 'utf8');
hospitals = hospitals.replace(
  `import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HospitalSearchCard from '../components/directory/HospitalSearchCard.jsx';
import { hospitalsIndexUrl } from '../api/publicApi.js';
import { useInfiniteResourceList } from '../hooks/useInfiniteResourceList.js';`,
  `// @ts-nocheck
'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import HospitalSearchCard from '@/components/directory/HospitalSearchCard';
import { hospitalsIndexUrl } from '@/api/publicApi';
import { useInfiniteResourceList } from '@/hooks/useInfiniteResourceList';`,
  );
hospitals = hospitals.replace(
  `export default function HospitalsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || searchParams.get('q') || '';`,
  `function HospitalsPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const commitSearchParams = (next: URLSearchParams) => {
        const q = next.toString();
        router.replace(q ? \`\${pathname}?\${q}\` : pathname);
    };

    const search = searchParams.get('search') || searchParams.get('q') || '';`,
  );
hospitals = hospitals.replace(/const next = new URLSearchParams\(searchParams\);/g, 'const next = new URLSearchParams(searchParams.toString());');
hospitals = hospitals.replace(/setSearchParams\(next\)/g, 'commitSearchParams(next)');
hospitals += `

export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface py-20 text-center text-on-surface-variant">Loading…</div>}>
      <HospitalsPageContent />
    </Suspense>
  );
}
`;

const outDoctors = path.join(hw, 'src/app/(site)/doctors/page.tsx');
const outHospitals = path.join(hw, 'src/app/(site)/hospitals/page.tsx');
fs.writeFileSync(outDoctors, doctors);
fs.writeFileSync(outHospitals, hospitals);
console.log('Wrote', outDoctors, outHospitals);
