import React from 'react';
import { Code, Layout, Palette, CheckCircle2, Youtube } from 'lucide-react';

// Video placeholder component - just change the embedUrl prop
const VideoPlaceholder: React.FC<{ embedUrl: string }> = ({ embedUrl }) => {
  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10">
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-black/30 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Youtube size={18} className="text-[#ff7400]" />
        <span>Watch this video to learn more about the topic</span>
      </div>
    </div>
  );
};

export const HtmlCssBasics: React.FC = () => {
  return (
    <div className="animate-fade-in text-left">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Code size={14} />
          HTML & CSS
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          Introduction to HTML & CSS
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          The building blocks of the web. Learn how to structure your content with HTML and style it beautifully with CSS.
        </p>
      </div>

      <div className="prose prose-purple dark:prose-invert max-w-none">
        {/* Subtopics with video placeholders after each */}
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <Layout className="text-purple-500" />
          What is HTML?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the structure and meaning of web content. HTML uses tags to mark up text content, creating elements that form the building blocks of all websites.
        </p>
        
        <div className="bg-gray-50 dark:bg-black/50 rounded-xl p-4 border border-gray-200 dark:border-white/10 mb-8 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800 dark:text-gray-200">
{`<!DOCTYPE html>
<html>
<head>
  <title>My First Webpage</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a paragraph of text.</p>
  <a href="https://example.com">This is a link</a>
  <img src="image.jpg" alt="Description">
</body>
</html>`}
          </pre>
        </div>

        {/* Video Placeholder for HTML Introduction */}
        <VideoPlaceholder embedUrl="https://www.youtube.com/embed/VIDEO_ID_HERE" />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <Palette className="text-purple-500" />
          What is CSS?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of a document written in HTML. CSS describes how elements should be rendered on screen, on paper, in speech, or on other media. It controls layout, colors, fonts, and responsive behavior.
        </p>

        <div className="bg-gray-50 dark:bg-black/50 rounded-xl p-4 border border-gray-200 dark:border-white/10 mb-8 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800 dark:text-gray-200">
{`/* CSS Selectors and Properties */
body {
  font-family: 'Inter', sans-serif;
  background-color: #f4f4f9;
  color: #333;
  line-height: 1.6;
}

h1 {
  color: #6b21a8;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Class selector */
.btn-primary {
  background-color: #6b21a8;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #4c1d95;
}`}
          </pre>
        </div>

        {/* Video Placeholder for CSS Introduction */}
        <VideoPlaceholder embedUrl="https://www.youtube.com/embed/VIDEO_ID_HERE" />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <Code className="text-purple-500" />
          How HTML & CSS Work Together
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          HTML and CSS work in harmony to create beautiful, functional websites. HTML provides the structure and content (like the skeleton and organs of a body), while CSS adds styling and layout (like the skin, clothes, and makeup). Together, they form the foundation of every website you visit.
        </p>

        <div className="bg-gray-50 dark:bg-black/50 rounded-xl p-4 border border-gray-200 dark:border-white/10 mb-8 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800 dark:text-gray-200">
{`<!-- HTML Structure -->
<div class="card">
  <h2>Welcome to My Site</h2>
  <p>This content is structured with HTML</p>
  <button class="btn">Click Me</button>
</div>

/* CSS Styling */
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn {
  background: #6b21a8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn:hover {
  background: #4c1d95;
}`}
          </pre>
        </div>

        {/* Video Placeholder for HTML & CSS Working Together */}
        <VideoPlaceholder embedUrl="https://www.youtube.com/embed/VIDEO_ID_HERE" />

        <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl p-6 border border-purple-100 dark:border-purple-500/20 mt-10">
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4">
            Key Takeaways
          </h3>
          <ul className="space-y-3">
            {[
              'HTML provides the structure (the skeleton) of your webpage.',
              'CSS provides the styling (the skin and clothes) for visual presentation.',
              'Tags enclose content to give it meaning (e.g., <h1>, <p>, <div>).',
              'CSS uses selectors to target HTML elements and apply styles.',
              'The combination of HTML and CSS creates the foundation for all modern websites.',
              'Always use semantic HTML for better accessibility and SEO.',
              'CSS can be applied inline, internally, or externally via stylesheets.'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-purple-800 dark:text-purple-200">
                <CheckCircle2 className="text-purple-500 shrink-0 mt-0.5" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Final Video Placeholder for Key Takeaways */}
        <VideoPlaceholder embedUrl="https://www.youtube.com/embed/VIDEO_ID_HERE" />
      </div>
    </div>
  );
};