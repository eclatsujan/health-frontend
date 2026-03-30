import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function convert({
  srcName,
  outName,
  apiImport,
  slugCall,
  titleLines,
}) {
  const src = path.join('/Users/sujan/Projects/personal/HospitalNepal/resources/js/pages', `${srcName}.jsx`);
  const dest = path.join(root, 'src/components/pages', `${outName}.tsx`);
  let s = fs.readFileSync(src, 'utf8');
  s = `'use client';\n// @ts-nocheck\n\n` + s;
  s = s.replace(
    `import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Stars from '../components/ui/Stars.jsx';
import { ${apiImport} } from '../api/publicApi.js';
import { usePublicSlugResource } from '../hooks/usePublicSlugResource.js';`,
    `import { useEffect } from 'react';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { ${apiImport} } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';`,
  );
  s = s.replace(
    `export default function ${srcName}() {
    const { slug } = useParams();
    const { data: ${titleLines.varName}, loading, notFound, loadError } = usePublicSlugResource(${slugCall});

    useEffect(() => {
        if (${titleLines.ifCondition}) {
            document.title = \`${titleLines.titleTemplate}\`;
        }
        return () => {
            document.title = window.__APP_NAME__ || 'MediHub';
        };
    }, [${titleLines.dep}]);`,
    `export default function ${outName}({ slug }: { slug: string }) {
    const appName = useAppName();
    const { data: ${titleLines.varName}, loading, notFound, loadError } = usePublicSlugResource(${slugCall});

    useEffect(() => {
        if (${titleLines.ifCondition}) {
            document.title = \`${titleLines.newTitle}\`;
        }
        return () => {
            document.title = appName;
        };
    }, [${titleLines.newDep}]);`,
  );
  s = s.replace(/<Link to=/g, '<Link href=');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, s);
  console.log('Wrote', dest);
}

convert({
  srcName: 'LaboratoryDetailPage',
  outName: 'LaboratoryDetailView',
  apiImport: 'laboratoryBySlugUrl',
  slugCall: 'laboratoryBySlugUrl(slug)',
  titleLines: {
    varName: 'lab',
    ifCondition: 'lab?.name',
    titleTemplate: '${lab.name} — ${window.__APP_NAME__ || \'MediHub\'}',
    newTitle: '${lab.name} — ${appName}',
    dep: 'lab',
    newDep: 'lab, appName',
  },
});

convert({
  srcName: 'PharmacyDetailPage',
  outName: 'PharmacyDetailView',
  apiImport: 'pharmacyBySlugUrl',
  slugCall: 'pharmacyBySlugUrl(slug)',
  titleLines: {
    varName: 'p',
    ifCondition: 'p?.name',
    titleTemplate: '${p.name} — ${window.__APP_NAME__ || \'MediHub\'}',
    newTitle: '${p.name} — ${appName}',
    dep: 'p',
    newDep: 'p, appName',
  },
});

convert({
  srcName: 'CollegeDetailPage',
  outName: 'CollegeDetailView',
  apiImport: 'collegeBySlugUrl',
  slugCall: 'collegeBySlugUrl(slug)',
  titleLines: {
    varName: 'c',
    ifCondition: 'c?.name',
    titleTemplate: '${c.name} — ${window.__APP_NAME__ || \'MediHub\'}',
    newTitle: '${c.name} — ${appName}',
    dep: 'c',
    newDep: 'c, appName',
  },
});
