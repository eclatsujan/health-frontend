import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = '/Users/sujan/Projects/personal/HospitalNepal/resources/js/pages/LaboratoryDetailPage.jsx';
const dest = path.join(root, 'src/components/pages/LaboratoryDetailView.tsx');

let s = fs.readFileSync(src, 'utf8');
s = `'use client';\n// @ts-nocheck\n\n` + s;

s = s.replace(
  `import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Stars from '../components/ui/Stars.jsx';
import { laboratoryBySlugUrl } from '../api/publicApi.js';
import { usePublicSlugResource } from '../hooks/usePublicSlugResource.js';`,
  `import { useEffect } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { laboratoryBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';`,
);

const oldBlock = [
  'export default function LaboratoryDetailPage() {',
  '    const { slug } = useParams();',
  '    const { data: lab, loading, notFound, loadError } = usePublicSlugResource(laboratoryBySlugUrl(slug));',
  '',
  '    useEffect(() => {',
  '        if (lab?.name) {',
  "            document.title = `${lab.name} — ${window.__APP_NAME__ || 'MediHub'}`;",
  '        }',
  '        return () => {',
  "            document.title = window.__APP_NAME__ || 'MediHub';",
  '        };',
  '    }, [lab]);',
].join('\n');

const newBlock = [
  'export default function LaboratoryDetailView({ slug }: { slug: string }) {',
  '    const appName = useAppName();',
  '    const { data: lab, loading, notFound, loadError } = usePublicSlugResource(laboratoryBySlugUrl(slug));',
  '',
  '    useEffect(() => {',
  '        if (lab?.name) {',
  '            document.title = `${lab.name} — ${appName}`;',
  '        }',
  '        return () => {',
  '            document.title = appName;',
  '        };',
  '    }, [lab, appName]);',
].join('\n');

s = s.replace(oldBlock, newBlock);
s = s.replace(/<Link to=/g, '<Link href=');

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, s);
console.log('Wrote', dest);
