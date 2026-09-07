import fs from 'fs';
import path from 'path';

const pages = [
  'src/features/about/ContactPage.tsx',
  'src/features/about/AboutPage.tsx',
  'src/features/about/PrivacyPolicy.tsx',
  'src/features/about/TermsOfService.tsx'
];

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');

  // Add useNavigate import
  if (!content.includes('useNavigate')) {
    content = "import { useNavigate } from 'react-router-dom';\n" + content;
  }
  
  // Add ArrowLeft import if missing
  if (!content.includes('ArrowLeft')) {
    if (content.includes('import { ')) {
      content = content.replace('import { ', 'import { ArrowLeft, ');
    } else {
      content = "import { ArrowLeft } from 'lucide-react';\n" + content;
    }
  }

  // Set component width to full and add 30px lateral padding
  content = content.replace(/sm:px-6 lg:px-8/g, 'md:px-[30px]');
  content = content.replace(/max-w-7xl mx-auto|max-w-4xl mx-auto/g, 'w-full');
  
  if (!content.includes('navigate(-1)')) {
    // Add navigate hook inside the component
    content = content.replace(/(export const \w+: React\.FC = \(\) => {)/, "$1\n  const navigate = useNavigate();\n");
    
    // Add back button HTML
    const backBtn = `\n        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>\n`;
        
    // Insert back button inside the w-full div
    content = content.replace(/(<div className="w-full(?!.*w-full)[^>]*>)/, `$1${backBtn}`);
  }

  fs.writeFileSync(p, content, 'utf8');
  console.log('Updated', p);
}
