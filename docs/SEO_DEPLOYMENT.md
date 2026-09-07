# Exam Sidemann SEO deployment checklist

The application now generates crawlable HTML pages and an XML sitemap during `npm run build`. Complete these external steps after deploying the `dist` directory.

## Keyword vocabulary

Learners search for the same page in many ways: `hexco it notes`, `nc it csm notes pdf`,
`zimsec o level shona past papers`, `records management archiving notes`. All of those
phrasings come from one place, `src/data/seoKeywords.ts`, which holds:

- **Board names** — ZIMSEC and HEXCO, short and registered forms.
- **Level aliases** — `Form 4` is also `Form Four`, `O Level`, `Ordinary Level`, `Grade 11`.
- **Programme aliases** — `NC Information Technology` is also `NC IT`, `HEXCO IT`.
- **Subject abbreviations** — `CSM`, `OOP`, `DAA`, `FRS`, `RIM`, `Maths`.
- **Resource words** — notes, revision notes, past papers, question papers, syllabus, practicals.

That vocabulary reaches a page four ways: the `<title>`, the meta description, the
visible "Also known as" and "People also search for" blocks, and the schema
`keywords` / `alternateName` fields. Because the individual aliases are all present,
search engines match query combinations the build never enumerated.

`scripts/generateSeo.mjs` and the runtime `SeoHead` both call the same builders
(`courseSeoFor`, `subjectSeoFor`, `outcomeSeoFor`, `paperSeoFor`, `experimentSeoFor`).
**Change a title format in `src/data/seoKeywords.ts`, never in one of the two callers** —
if they drift, the crawled title stops matching the rendered one.

The meta keywords tag is deliberately capped at 32 phrases. Google ignores it and Bing
treats a stuffed one as a spam signal, so it is a courtesy to smaller engines, not the
mechanism that makes pages findable.

### Adding a new subject or programme

If a new subject's common search term differs from its registered name, add it to
`SUBJECT_ALIASES` (or `PROGRAMME_ALIASES` for a whole course) in `src/data/seoKeywords.ts`.
Without an entry the page still works, it just only answers for its formal name.

## Google Search Console

1. Add and verify the `examsidemann.com` Domain property.
2. Submit `https://www.examsidemann.com/sitemap.xml` under **Indexing → Sitemaps**.
3. Inspect `https://www.examsidemann.com/` and request indexing after the new build is live.
4. After adding or changing course content, deploy a fresh build and resubmit the
   same sitemap URL. The build automatically includes every published course,
   subject, and learning-outcome URL; individual outcome sitemaps are not needed.
5. Inspect the important sitelink candidates:
   - `https://www.examsidemann.com/courses/`
   - `https://www.examsidemann.com/past-papers/`
   - `https://www.examsidemann.com/syllabi/`
   - `https://www.examsidemann.com/library/`
   - `https://www.examsidemann.com/tutorials/`
   - `https://www.examsidemann.com/practicals/`
   - `https://www.examsidemann.com/about/`
   - `https://www.examsidemann.com/contact/`
6. Monitor **Page indexing**, **Core Web Vitals**, and **Enhancements** after Google recrawls the site.

## Domain migration

Google currently has pages from `examsidemann.org` in its index. If `.com` replaces `.org`, configure permanent server-side `301` redirects from every old `.org` URL to its closest `.com` equivalent. Keep the redirects active for at least one year and use Search Console's change-of-address workflow where available.

Do not remove the old domain or return blanket 404 responses during migration. A page-to-page redirect map preserves substantially more search equity than redirecting every old URL to the new home page.

## Validation

Run `npm run seo:verify` after a build. It fails on a missing canonical, a missing
keyword vocabulary, a missing FAQ block, or a duplicate title on any content page.

It **warns** about school profiles that share a title. Those are duplicate or
truncated rows in `src/data/schoolRegistry` (two records for one school, or a name cut
short) and the fix is to deduplicate the registry, not to change the title format.
Do not invent a school's full name to break the tie.

- Open `/robots.txt` and confirm it references the production sitemap.
- Open `/sitemap.xml` and confirm it returns XML with absolute `.com` URLs.
- Validate the home-page JSON-LD with Schema Markup Validator.
- Test representative pages with Google's Rich Results Test and URL Inspection.
- Confirm `/favicon-48.png`, `/app-icon-512.png`, and `/exam-sidemann-social-preview.png` return `200`.
- Confirm the canonical host redirects `examsidemann.com` to `www.examsidemann.com`.

Google generates sitelinks automatically. The crawlable footer links, unique page titles and headings, canonical URLs, sitemap, and internal page hierarchy make the preferred pages clear, but no markup can force a particular sitelink layout.
