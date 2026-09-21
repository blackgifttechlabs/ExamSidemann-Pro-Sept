# ExamSidemann Pro

A React and TypeScript learning platform built with Vite.

## Development

```sh
npm ci
npm run dev
```

The development server uses `http://localhost:5173`. Set `VITE_DEV_PORT` or
`VITE_DEV_HOST` to override it. Keep local environment settings in `.env`.

## Project layout

```text
src/
  main.tsx            React entry point and BrowserRouter
  app/App.tsx         Application shell and route definitions
  features/           Pages and components grouped by product feature
  components/         Shared layout, icons, and UI components
  seo/                Route metadata and document head components
  contexts/           Shared React providers
  data/               Curriculum, catalogues, registries, and generated SEO data
  services/           Authentication, storage, analytics, and API integrations
  lib/                Reusable audio and narration code
  utils/              Shared helpers, canonical URLs, and SEO utilities
api/                  Vercel serverless endpoints; paths determine API URLs
functions/            Separately deployed Firebase Cloud Functions
public/               Static assets served at their existing URLs
scripts/              Build, data generation, and verification tools
  archive/            Historical one-off maintenance scripts
tests/manual/        Manual diagnostic scripts
config/local/         Ignored local provider configuration
docs/                Deployment guides, examples, and visual references
```

See [the structure guide](docs/PROJECT_STRUCTURE.md) for placement rules and
routing/SEO maintenance.

## Build and verification

```sh
npm run structure:verify  # Resolve every local import, including lazy pages
npm run lint              # TypeScript check
npm run build             # Bundle, generate SEO pages/sitemaps, and build the service worker
npm run seo:verify        # Check generated SEO output after building
npm run verify            # Structure, build, and SEO checks together
```

`npm run preview` serves the production build locally. Vercel and Netlify use
`dist/` as the deployment output. Firebase configuration and host configuration
files stay at the repository root for their deployment tools.

### C++ and C# practice

C++ defaults to a small browser practice interpreter. C# uses a real Roslyn
compiler and .NET WebAssembly runtime in a Web Worker, including methods, arrays,
classes, and live Console.ReadLine/ReadKey input. Neither default requires Judge0.
The black output console opens over the editor, and the AI tutor stays beside it.

See [browser C# setup and limits](browser-csharp/README.md) for rebuilding the
bundled runtime, supported browser requirements, and platform restrictions.
Set `VITE_CPP_RUN_API_URL` or `VITE_CSHARP_RUN_API_URL` only when deliberately
using a separate compiler endpoint instead of browser execution.

Run C++ interpreter checks with `node tests/runner/practiceInterpreter.test.mjs`.
Run real browser C# checks with `node tests/runner/browserCSharp.test.mjs`.
Made with love by the blackgift
