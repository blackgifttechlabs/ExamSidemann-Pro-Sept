export interface AppFeature {
  id: string;
  title: string;
  category: string;
  path: string;
  description: string;
  keywords: string[];
}

export const APP_FEATURES: AppFeature[] = [
  {
    id: 'ai-chat',
    title: 'Sidemann AI Chat',
    category: 'AI Tools',
    path: '/chat',
    description: 'Interactive AI study assistant supporting syllabus questions, exam prep, and step-by-step topic explanations.',
    keywords: ['ai', 'chat', 'ask', 'question', 'teacher', 'tutor', 'sidemann', 'help', 'explain']
  },
  {
    id: 'code-agent',
    title: 'Black-Tonet AI Code Workspace',
    category: 'AI Tools',
    path: '/code-agent',
    description: 'Autonomous coding agent workspace for web development, debugging, and code generation.',
    keywords: ['code', 'workspace', 'agent', 'programming', 'javascript', 'react', 'python', 'developer', 'black tonet']
  },
  {
    id: 'iq-trainer',
    title: 'IQ & Cognitive Trainer',
    category: 'Games & Drills',
    path: '/iq-trainer',
    description: 'Cognitive brain training puzzles, logic speed tests, spatial reasoning, and mental arithmetic games.',
    keywords: ['iq', 'brain', 'logic', 'puzzles', 'trainer', 'spatial', 'reasoning', 'memory', 'test']
  },
  {
    id: 'practicals-all',
    title: 'Virtual Science & Tech Labs',
    category: 'Practicals',
    path: '/practicals/all',
    description: 'Interactive virtual lab experiments for Secondary (O & A Level) Physics, Chemistry, Biology, and Polytechnic studies.',
    keywords: ['lab', 'practicals', 'virtual lab', 'experiments', 'physics', 'chemistry', 'biology', 'science', 'simulations']
  },
  {
    id: 'technical-drawing',
    title: 'Technical Drawing Studio',
    category: 'Practicals',
    path: '/practicals/polytechnic/drawing',
    description: 'Interactive CAD-style drawing studio for orthographic projection, isometric views, geometric construction, and drafting.',
    keywords: ['drawing', 'technical drawing', 'cad', 'drafting', 'orthographic', 'isometric', 'geometry', 'polytechnic']
  },
  {
    id: 'fabrication-drawing',
    title: 'Fabrication Engineering Studio',
    category: 'Practicals',
    path: '/practicals/polytechnic/fabrication',
    description: 'Engineering fabrication studio for sheet metal development, welding symbols, structural layout, and blue-print reading.',
    keywords: ['fabrication', 'engineering', 'welding', 'sheet metal', 'blueprints', 'structural', 'polytechnic']
  },
  {
    id: 'sql-practice',
    title: 'Interactive SQL Practice Lab',
    category: 'Practicals',
    path: '/sql-practice',
    description: 'In-browser relational database query terminal with AlaSQL engine for practicing SELECT, JOIN, GROUP BY, and data modeling.',
    keywords: ['sql', 'database', 'query', 'relational', 'alasql', 'database administration', 'tables', 'data']
  },
  {
    id: 'webdev-ide',
    title: 'WebDev Live IDE & Preview',
    category: 'Practicals',
    path: '/practicals/tools/webdev',
    description: 'Full-featured frontend code editor with HTML, CSS, JavaScript, and React live preview sandbox.',
    keywords: ['webdev', 'html', 'css', 'javascript', 'react', 'ide', 'frontend', 'editor', 'preview']
  },
  {
    id: 'csharp-lab',
    title: 'C# .NET Browser Console & Lab',
    category: 'Practicals',
    path: '/practicals/tools/csharp',
    description: 'WebAssembly C# console execution environment for practicing Object-Oriented Programming (OOP).',
    keywords: ['c#', 'csharp', '.net', 'oop', 'object oriented', 'programming', 'console']
  },
  {
    id: 'linux-terminal',
    title: 'Interactive Linux Web Terminal',
    category: 'Practicals',
    path: '/practicals/tools/linux',
    description: 'Virtual bash shell emulator for practicing Linux command line administration, permissions, file systems, and scripting.',
    keywords: ['linux', 'terminal', 'bash', 'shell', 'commands', 'operating systems', 'cli']
  },
  {
    id: 'courses-overview',
    title: 'Syllabus & Course Catalog',
    category: 'Academics',
    path: '/courses',
    description: 'Comprehensive registry of ZJC, O Level, A Level, and Polytechnic NC/ND syllabi, subjects, and learning outcomes.',
    keywords: ['courses', 'syllabus', 'subjects', 'curriculum', 'learning outcomes', 'zjc', 'olevel', 'alevel', 'polytechnic']
  },
  {
    id: 'library',
    title: 'Compact Resource Library',
    category: 'Academics',
    path: '/library',
    description: 'Digital textbook repository, study guides, topic summaries, and downloadable PDF study notes.',
    keywords: ['library', 'books', 'textbooks', 'notes', 'study guides', 'pdf', 'resources']
  },
  {
    id: 'past-papers',
    title: 'Past Papers & Marking Schemes',
    category: 'Academics',
    path: '/past-papers',
    description: 'Comprehensive repository of previous ZIMSEC and national exam question papers with answer keys and guides.',
    keywords: ['past papers', 'exam papers', 'zimsec', 'questions', 'marking scheme', 'revision', 'exams']
  },
  {
    id: 'ecd-journey',
    title: 'ECD Early Childhood Learning',
    category: 'ECD',
    path: '/ecd/journey',
    description: 'Gamified early childhood development learning journey with phonics, sight words, counting games, and interactive voice.',
    keywords: ['ecd', 'kids', 'early childhood', 'phonics', 'maths', 'reading', 'letters', 'counting', 'games']
  },
  {
    id: 'school-directory',
    title: 'Zimbabwe School Directory',
    category: 'Schools',
    path: '/schools',
    description: 'Search and discover primary, secondary, board, and day schools across all provinces in Zimbabwe.',
    keywords: ['schools', 'directory', 'zimbabwe', 'finder', 'high schools', 'colleges', 'provinces']
  },
  {
    id: 'educational-news',
    title: 'Education & Exam News',
    category: 'Community',
    path: '/news',
    description: 'Latest national curriculum updates, examination dates, registration deadlines, and academic news.',
    keywords: ['news', 'updates', 'zimsec news', 'articles', 'curriculum updates', 'education']
  },
  {
    id: 'dashboard',
    title: 'Student & Teacher Dashboard',
    category: 'Account',
    path: '/dashboard',
    description: 'Personalized learning progress tracker, saved notes, study streak counters, and upcoming assignments.',
    keywords: ['dashboard', 'home', 'progress', 'streak', 'saved notes', 'teacher dashboard']
  },
  {
    id: 'pricing',
    title: 'Subscription & Pricing Plans',
    category: 'Account',
    path: '/pricing',
    description: 'Overview of free access tiers, premium unlimited AI tokens, and school institutional plans.',
    keywords: ['pricing', 'subscription', 'plans', 'premium', 'payment', 'tokens']
  }
];

export const getAppKnowledgeSummary = (): string => {
  return [
    '--- EXAM SIDEMANN PLATFORM FEATURES & PAGE DIRECTORY ---',
    'When students ask where to find a tool or feature, or when suggesting relevant platform features, provide a markdown link using these exact relative URLs:',
    ...APP_FEATURES.map(f => `- **${f.title}** (\`${f.path}\`): ${f.description}`),
    '--- END PLATFORM DIRECTORY ---'
  ].join('\n');
};
