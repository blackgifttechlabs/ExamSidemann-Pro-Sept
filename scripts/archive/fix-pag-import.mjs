import fs from 'fs';

const pages = [
  'src/features/about/ContactPage.tsx',
  'src/features/about/AboutPage.tsx',
  'src/features/about/PrivacyPolicy.tsx',
  'src/features/about/TermsOfService.tsx'
];

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');

  // Fix wrong import from 'react-router-dom'
  if (content.includes("import { ArrowLeft, useNavigate } from 'react-router-dom'")) {
    content = content.replace(
      "import { ArrowLeft, useNavigate } from 'react-router-dom'",
      "import { useNavigate } from 'react-router-dom';\nimport { ArrowLeft } from 'lucide-react'"
    );
  }

  // Also check if any other file got a bad import
  if (content.match(/import \{ ArrowLeft(?:, [^}]+)?\} from 'react-router-dom'/)) {
     content = content.replace(
      /import \{ ArrowLeft, ([^}]+)\} from 'react-router-dom'/,
      "import { $1 } from 'react-router-dom';\nimport { ArrowLeft } from 'lucide-react'"
    );
  }
  
  fs.writeFileSync(p, content, 'utf8');
  console.log('Fixed imports in', p);
}
