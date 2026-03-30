import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = '/Users/sujan/Projects/personal/HospitalNepal/resources/js/pages/HospitalDetailPage.jsx';
const dest = path.join(root, 'src/components/pages/HospitalDetailView.tsx');

let s = fs.readFileSync(src, 'utf8');
s = `'use client';\n// @ts-nocheck\n\n` + s;

s = s.replace(
  `import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Stars from '../components/ui/Stars.jsx';
import { hospitalBySlugUrl } from '../api/publicApi.js';
import { usePublicSlugResource } from '../hooks/usePublicSlugResource.js';`,
  `import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { hospitalBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';`,
);

const oldBlock = [
  'export default function HospitalDetailPage() {',
  '    const { slug } = useParams();',
  '    const { data: h, loading, notFound, loadError } = usePublicSlugResource(hospitalBySlugUrl(slug));',
  '',
  '    useEffect(() => {',
  '        if (h?.name) {',
  "            document.title = `${h.name} — ${window.__APP_NAME__ || 'MediHub'}`;",
  '        }',
  '        return () => {',
  "            document.title = window.__APP_NAME__ || 'MediHub';",
  '        };',
  '    }, [h]);',
].join('\n');

const newBlock = [
  'export default function HospitalDetailView({ slug }: { slug: string }) {',
  '    const appName = useAppName();',
  '    const { data: h, loading, notFound, loadError } = usePublicSlugResource(hospitalBySlugUrl(slug));',
  '',
  '    useEffect(() => {',
  '        if (h?.name) {',
  '            document.title = `${h.name} — ${appName}`;',
  '        }',
  '        return () => {',
  '            document.title = appName;',
  '        };',
  '    }, [h, appName]);',
].join('\n');

s = s.replace(oldBlock, newBlock);
s = s.replace(/<Link to=/g, '<Link href=');

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, s);
console.log('Wrote', dest);
