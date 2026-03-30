import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const configs = [
  {
    name: 'NurseDetailPage',
    out: 'NurseDetailView',
    importPath: "import { nurseBySlugUrl } from '../api/publicApi.js';",
    newImport: "import { nurseBySlugUrl } from '@/api/publicApi';",
    slugUrl: 'nurseBySlugUrl(slug)',
    back: '/nurses',
    titleEffect: (lines) =>
      lines.replace(
        /useEffect\(\(\) => \{[\s\S]*?\}, \[n\]\);/,
        [
          '    useEffect(() => {',
          '        if (n?.first_name) {',
          "            document.title = `${n.first_name} ${n.last_name || ''} — ${appName}`;",
          '        }',
          '        return () => {',
          '            document.title = appName;',
          '        };',
          '    }, [n, appName]);',
        ].join('\n'),
      ),
  },
];

// Manual one-offs: run per file with inline config below
