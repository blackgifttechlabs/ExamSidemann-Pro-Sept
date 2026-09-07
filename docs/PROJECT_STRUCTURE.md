# Project structure and routing

## Where files belong

- `src/features/<feature>/`: feature pages, components, and feature-specific helpers.
  Courses retain their level/course/subject folders; practicals retain their
  existing subject and tool hierarchy. Related dashboards, schools, tutorials,
  resources, authentication, billing, and community pages live together.
- `src/components/layout/`: navigation and shared page layout.
- `src/components/ui/` and `src/components/icons/`: reusable presentation code.
- `src/seo/`: `RouteSeo` and `SeoHead`.
- `src/data/`: shared curriculum constants, source catalogues, school registries,
  and generated data. Generated JSON files are written here by build scripts.
- `src/services/`, `src/contexts/`, `src/utils/`, `src/lib/`: shared infrastructure.
- `scripts/`: supported build and data utilities. Run these from the repository root.
- `scripts/archive/`: retained historical migration scripts, including the old
  `app/` and `workspace/` tooling. These are not application entry points or build
  steps; review their assumptions before manually reusing them.
- `tests/manual/`: diagnostic scripts. The former `test-err.tsx` is a component
  example in `docs/examples/AccordionItem.tsx`.
- `docs/previews/`: visual references, including the video catalogue preview.
- `config/local/`: local provider JSON configuration, excluded from Git and Vercel.

Use `@/` for imports relative to `src/`, or relative imports within a feature.
Vite and TypeScript resolve the alias to the same directory.

## Public URLs are independent of source folders

`src/main.tsx` mounts `BrowserRouter`; `src/app/App.tsx` owns the main route tree.
Nested course routes are in `src/features/courses/LearningOutcomeRoutes.tsx` and
`DynamicModuleViewer.tsx`. Moving a source file requires updating its imports,
including `React.lazy` imports; it does not require changing its public URL.

Navigation lives in `src/components/layout/` and individual feature components.
Preserve existing route paths, parameters, redirects, and hash/query handling
when moving files. `src/utils/siteUrl.ts` controls URL canonicalization.

Leave public assets under `public/` unless all consumers are deliberately updated.
For example, `public/images/...` continues to be requested as `/images/...`.
Keep Vercel endpoints in `api/` because their filesystem paths are API routes.

## SEO and sitemap generation

The production build runs these steps in order:

1. `scripts/generateLearningOutcomeTitles.mjs` scans `src/features/courses/` and
   writes learning outcome titles and feed notes to `src/data/`.
2. `scripts/generatePracticalTopicSeo.mjs` reads the practicals catalogue and
   writes practical topic metadata to `src/data/`.
3. Vite bundles `index.html`, which loads `src/main.tsx`.
4. `scripts/generateSeo.mjs` reads `src/data/` and course availability, then emits
   route HTML, canonical metadata, structured data, and sitemap files in `dist/`.
5. `scripts/generateServiceWorker.mjs` generates the offline asset manifest.

Do not hand-edit generated sitemap files or change canonical URLs to include
`src/` or `features/`. For a new public page, add its React route, navigation entry,
and appropriate static or catalogue metadata, then run `npm run verify`.

Host redirects and SPA fallbacks remain in `vercel.json` and `public/_redirects`.
`public/robots.txt` retains the sitemap location and private-area exclusions.
`npm run seo:verify` checks generated metadata, sitemap coverage, and redirect
contracts. `npm run structure:verify` checks all local source imports, including
lazy-loaded modules, even if the production route tree does not currently use them.
