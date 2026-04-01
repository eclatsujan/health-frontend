import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hn = '/Users/sujan/Projects/personal/HospitalNepal/resources/js/pages';
const hw = path.join(__dirname, '..');

/**
 * Convert a Laravel SPA page (react-router) toward Next.js App Router patterns.
 * Output is still // @ts-nocheck — tighten types later.
 */
export function portPageContent(raw) {
  let s = raw;

  s = s.replace(
    /import \{ Link, useParams \} from 'react-router-dom';/g,
    "import Link from 'next/link';\nimport { useParams } from 'next/navigation'",
  );
  s = s.replace(
    /import \{ useParams, Link \} from 'react-router-dom';/g,
    "import Link from 'next/link';\nimport { useParams } from 'next/navigation'",
  );
  s = s.replace(/import \{ Link \} from 'react-router-dom';/g, "import Link from 'next/link'");
  s = s.replace(/import \{ NavLink \} from 'react-router-dom';/g, "import { NavLink } from '@/components/ui/NavLink'");
  s = s.replace(/<NavLink\s+to=/g, '<NavLink href=');

  s = s.replace(/import \{ useNavigate(?:,\s*[^}]+)?\} from 'react-router-dom';/g, "import { useRouter } from 'next/navigation'");
  s = s.replace(/import \{ useParams(?:,\s*[^}]+)?\} from 'react-router-dom';/g, "import { useParams } from 'next/navigation'");
  s = s.replace(/import \{ useLocation(?:,\s*[^}]+)?\} from 'react-router-dom';/g, "import { usePathname } from 'next/navigation'");

  s = s.replace(/\bconst navigate = useNavigate\(\);/g, 'const router = useRouter();');
  s = s.replace(/\bnavigate\(/g, 'router.push(');

  s = s.replace(/<Link\s+to=/g, '<Link href=');

  s = s.replace(/from '\.\.\/components\//g, "from '@/components/");
  s = s.replace(/from '\.\.\/\.\.\/components\//g, "from '@/components/");
  s = s.replace(/from '\.\.\/hooks\//g, "from '@/hooks/");
  s = s.replace(/from '\.\.\/\.\.\/hooks\//g, "from '@/hooks/");
  s = s.replace(/from '\.\.\/api\//g, "from '@/api/");
  s = s.replace(/from '\.\.\/\.\.\/api\//g, "from '@/api/");
  s = s.replace(/publicApi\.js'/g, "publicApi'");
  s = s.replace(/useInfiniteResourceList\.js'/g, "useInfiniteResourceList'");
  s = s.replace(/usePublicSlugResource\.js'/g, "usePublicSlugResource'");
  s = s.replace(/\.jsx'/g, "'");

  // useLocation().pathname -> usePathname()
  s = s.replace(/\bconst \{ pathname \} = useLocation\(\)/g, 'const pathname = usePathname()');
  s = s.replace(/\bconst location = useLocation\(\)/g, 'const pathname = usePathname()');
  s = s.replace(/\blocation\.pathname\b/g, 'pathname');

  return s;
}

function needsClient(s) {
  return (
    /useState|useEffect|useMemo|useCallback|useRef|useRouter|useParams|usePathname|useSearchParams|onSubmit|onClick/.test(s) ||
    /export default function/.test(s)
  );
}

// Map: [sourcePage.jsx, dest under src/]
const jobs = [
  ['EmergencyPage.jsx', 'src/app/(site)/emergency/page.tsx'],
  ['UserLoginPage.jsx', 'src/app/(site)/login/page.tsx'],
  ['AdminLoginPage.jsx', 'src/app/(site)/admin/login/page.tsx'],
  ['RegisterPage.jsx', 'src/app/(site)/register/page.tsx'],
  ['RegisterSuccessPage.jsx', 'src/app/(site)/register/success/page.tsx'],
  ['RegisterFailurePage.jsx', 'src/app/(site)/register/failure/page.tsx'],
];

for (const [file, relDest] of jobs) {
  const src = path.join(hn, file);
  if (!fs.existsSync(src)) {
    console.warn('skip missing', src);
    continue;
  }
  let body = fs.readFileSync(src, 'utf8');
  body = portPageContent(body);
  const client = needsClient(body);
  const header = `// @ts-nocheck\n${client ? "'use client';\n\n" : ''}`;
  const out = path.join(hw, relDest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, header + body);
  console.log('wrote', relDest);
}

console.log('done batch 1');
