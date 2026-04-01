import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const hn = '/Users/sujan/Projects/personal/HospitalNepal/resources/js/components';

function convertHospitalDetailStitchBody() {
  const src = path.join(hn, 'directory/HospitalDetailStitchBody.jsx');
  const dest = path.join(root, 'src/components/directory/HospitalDetailStitchBody.tsx');
  let s = fs.readFileSync(src, 'utf8');
  s = `// @ts-nocheck\n'use client';\n\n${s}`;
  s = s.replace(
    `import { Link } from 'react-router-dom';
import Stars from '../ui/Stars.jsx';
import HospitalReviewModal from '../reviews/HospitalReviewModal.jsx';
import { directoryReviewsIndexUrl, fetchJson } from '../../api/publicApi.js';`,
    `import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import HospitalReviewModal from '@/components/reviews/HospitalReviewModal';
import { directoryReviewsIndexUrl, fetchJson } from '@/api/publicApi';`,
  );
  s = s.replace(/<Link\s+to=/g, '<Link href=');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, s);
  console.log('Wrote', dest);
}

function convertDoctorSearchCard() {
  const src = path.join(hn, 'doctors/DoctorSearchCard.jsx');
  const dest = path.join(root, 'src/components/doctors/DoctorSearchCard.tsx');
  let s = fs.readFileSync(src, 'utf8');
  s = `// @ts-nocheck\n'use client';\n\n${s}`;
  s = s.replace(`import { Link } from 'react-router-dom';
import Stars from '../ui/Stars.jsx';`, `import Link from 'next/link';
import Stars from '@/components/ui/Stars';`);
  s = s.replace(/<Link\s+to=/g, '<Link href=');
  s = s.replace(
    `export default function DoctorSearchCard({ doctor, distanceKm = null }) {`,
    `export default function DoctorSearchCard({ doctor, distanceKm = null }: { doctor: Record<string, unknown>; distanceKm?: number | null }) {`,
  );
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, s);
  console.log('Wrote', dest);
}

function convertHospitalSearchCard() {
  const src = path.join(hn, 'directory/HospitalSearchCard.jsx');
  const dest = path.join(root, 'src/components/directory/HospitalSearchCard.tsx');
  let s = fs.readFileSync(src, 'utf8');
  s = `// @ts-nocheck\n'use client';\n\n${s}`;
  s = s.replace(`import { Link } from 'react-router-dom';
import Stars from '../ui/Stars.jsx';`, `import Link from 'next/link';
import Stars from '@/components/ui/Stars';`);
  s = s.replace(/<Link\s+to=/g, '<Link href=');
  s = s.replace(
    `export default function HospitalSearchCard({ hospital: h, distanceKm = null }) {`,
    `export default function HospitalSearchCard({ hospital: h, distanceKm = null }: { hospital: Record<string, unknown>; distanceKm?: number | null }) {`,
  );
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, s);
  console.log('Wrote', dest);
}

convertHospitalDetailStitchBody();
convertDoctorSearchCard();
convertHospitalSearchCard();
