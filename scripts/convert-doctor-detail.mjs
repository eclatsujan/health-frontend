import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const src = '/Users/sujan/Projects/personal/HospitalNepal/resources/js/pages/DoctorDetailPage.jsx';
const dest = path.join(root, 'src/components/pages/DoctorDetailView.tsx');

let s = fs.readFileSync(src, 'utf8');

s = s.replace(
  `import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewModal from '../components/reviews/ReviewModal.jsx';
import Stars from '../components/ui/Stars.jsx';
import { doctorBySlugUrl, doctorConnectUrl, doctorReviewsIndexUrl, fetchJson, postJson } from '../api/publicApi.js';
import { doctorProfileFallback } from '../data/doctorProfileCopy.js';`,
  `'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import ReviewModal from '@/components/reviews/ReviewModal';
import Stars from '@/components/ui/Stars';
import { doctorBySlugUrl, doctorConnectUrl, doctorReviewsIndexUrl, fetchJson, postJson, type HttpError } from '@/api/publicApi';
import { doctorProfileFallback } from '@/data/doctorProfileCopy';
import { useAppName } from '@/hooks/useAppName';`,
);

s = s.replace(
  `const LANG_LABELS = { ne: 'Nepali', en: 'English', hi: 'Hindi', np: 'Nepali' };

function formatLanguages(langs) {`,
  `const LANG_LABELS: Record<string, string> = { ne: 'Nepali', en: 'English', hi: 'Hindi', np: 'Nepali' };

function formatLanguages(langs: unknown): string | null {`,
);

s = s.replace(`function formatVisitingHours(v) {`, `function formatVisitingHours(v: unknown): string | null {`);

s = s.replace(
  `export default function DoctorDetailPage() {
    const { slug } = useParams();`,
  `export default function DoctorDetailView({ slug }: { slug: string }) {
    const appName = useAppName();`,
);

s = s.replace(
  `    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loadError, setLoadError] = useState(null);`,
  `    const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);`,
);

s = s.replace(
  `    const [connectFormError, setConnectFormError] = useState(null);
    const [connectFieldErrors, setConnectFieldErrors] = useState({});`,
  `    const [connectFormError, setConnectFormError] = useState<string | null>(null);
    const [connectFieldErrors, setConnectFieldErrors] = useState<Record<string, string[] | string>>({});`,
);

s = s.replace(`    const [reviewsList, setReviewsList] = useState([]);`, `    const [reviewsList, setReviewsList] = useState<Record<string, unknown>[]>([]);`);

s = s.replace(`    function connectFieldError(field) {`, `    function connectFieldError(field: string) {`);

s = s.replace(`    async function handleConnectSubmit(e) {`, `    async function handleConnectSubmit(e: FormEvent) {`);

s = s.replace(
  `        const payload = {
            name: connectName.trim(),
            phone: connectPhone.trim(),
        };
        const em = connectEmail.trim();
        if (em) payload.email = em;
        const msg = connectMessage.trim();
        if (msg) payload.message = msg;
        if (connectPreferredDate) payload.preferred_date = connectPreferredDate;
        try {
            await postJson(doctorConnectUrl(slug), payload);`,
  `        const payload: Record<string, unknown> = {
            name: connectName.trim(),
            phone: connectPhone.trim(),
        };
        const em = connectEmail.trim();
        if (em) payload.email = em;
        const msg = connectMessage.trim();
        if (msg) payload.message = msg;
        if (connectPreferredDate) payload.preferred_date = connectPreferredDate;
        try {
            await postJson(doctorConnectUrl(slug), payload);`,
);

s = s.replace(
  `        } catch (err) {
            setConnectStatus('idle');
            if (err.status === 422 && err.errors) {
                setConnectFieldErrors(err.errors);
            } else {
                setConnectFormError(err.message || 'Could not send your request. Please try again.');
            }
        }`,
  `        } catch (err: unknown) {
            setConnectStatus('idle');
            const e = err as HttpError;
            if (e.status === 422 && e.errors) {
                setConnectFieldErrors(e.errors);
            } else {
                setConnectFormError(e.message || 'Could not send your request. Please try again.');
            }
        }`,
);

s = s.replace(
  `        fetchJson(doctorBySlugUrl(slug))
            .then((json) => setDoc(json.data))
            .catch(() => {});
        fetchJson(doctorReviewsIndexUrl(slug, { per_page: 30 }))
            .then((json) => setReviewsList(json.data || []))`,
  `        fetchJson<{ data: Record<string, unknown> }>(doctorBySlugUrl(slug))
            .then((json) => setDoc(json.data))
            .catch(() => {});
        fetchJson<{ data: Record<string, unknown>[] }>(doctorReviewsIndexUrl(slug, { per_page: 30 }))
            .then((json) => setReviewsList(json.data || []))`,
);

s = s.replace(
  `        fetchJson(doctorBySlugUrl(slug))
            .then((json) => {
                if (!cancelled) {
                    setDoc(json.data);
                }
            })
            .catch((e) => {
                if (cancelled) return;
                if (e.status === 404) setNotFound(true);
                else setLoadError(e.message || 'Could not load profile');
                setDoc(null);
            })`,
  `        fetchJson<{ data: Record<string, unknown> }>(doctorBySlugUrl(slug))
            .then((json) => {
                if (!cancelled) {
                    setDoc(json.data);
                }
            })
            .catch((e: unknown) => {
                if (cancelled) return;
                const err = e as HttpError;
                if (err.status === 404) setNotFound(true);
                else setLoadError(err.message || 'Could not load profile');
                setDoc(null);
            })`,
);

s = s.replace(
  `        fetchJson(doctorReviewsIndexUrl(slug, { per_page: 30 }))
            .then((json) => {
                if (!cancelled) setReviewsList(json.data || []);
            })
            .catch(() => {
                if (!cancelled) setReviewsList([]);
            })`,
  `        fetchJson<{ data: Record<string, unknown>[] }>(doctorReviewsIndexUrl(slug, { per_page: 30 }))
            .then((json) => {
                if (!cancelled) setReviewsList(json.data || []);
            })
            .catch(() => {
                if (!cancelled) setReviewsList([]);
            })`,
);

const oldTitleBlock = [
  '    useEffect(() => {',
  '        if (doc?.first_name) {',
  "            const name = `${doc.first_name} ${doc.last_name || ''}`.trim();",
  "            document.title = `${name} — ${window.__APP_NAME__ || 'MediHub'}`;",
  '        }',
  '        return () => {',
  "            document.title = window.__APP_NAME__ || 'MediHub';",
  '        };',
  '    }, [doc]);',
].join('\n');

const newTitleBlock = [
  '    useEffect(() => {',
  '        if (doc && typeof doc.first_name === \'string\') {',
  "            const name = `${doc.first_name} ${String(doc.last_name ?? '')}`.trim();",
  '            document.title = `${name} — ${appName}`;',
  '        }',
  '        return () => {',
  '            document.title = appName;',
  '        };',
  '    }, [doc, appName]);',
].join('\n');

s = s.replace(oldTitleBlock, newTitleBlock);

s = s.replace(/<Link to=/g, '<Link href=');

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, s);
console.log('Wrote', dest);
