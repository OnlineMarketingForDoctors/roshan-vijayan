# RV Plastic Surgery — Sanity Studio

The content editor (CMS) for the RV Plastic Surgery website.

- **Project ID:** `xtpxp7mw`
- **Dataset:** `production`

The website itself is a static site in `../site` and is unaffected by this folder.
This Studio is a separate app that deploys to its own `*.sanity.studio` address.

## Content models

- **Site Settings** — practice name, phone, email, locations, review summary (global, one document)
- **Procedures** — full service-page content: hero, at-a-glance, candidates, techniques, the procedure, recovery, risks, cost, FAQs, related
- **Blog posts** — title, slug, excerpt, cover image, body, date
- **Reviews** — patient testimonials
- **Before & After** — case images + caption + category

## Your setup steps (run locally, one time)

You need a free Sanity account (the project is already created).

```bash
cd studio
npm install
npx sanity login        # opens a browser to authenticate
npm run dev             # runs the Studio locally at http://localhost:3333
```

Deploy the hosted Studio so the team can edit from anywhere:

```bash
npm run deploy          # first run: confirm the hostname "rv-plastic-surgery"
# → editor lives at https://rv-plastic-surgery.sanity.studio
```

## Make the website able to read the content (one time)

The live site reads published content from Sanity in the browser, so two settings
in **manage.sanity.io → project `xtpxp7mw`** are needed:

1. **API → CORS origins →** add (no credentials needed):
   - `https://roshan-vijayan.vercel.app`
   - `http://localhost:4321` (local preview)
2. **API → Dataset `production` →** ensure it is **Public** (read-only public is normal
   for a marketing site). If you prefer to keep it private, tell me and we'll use a
   read token instead.

Once that's done, seed a little content (a couple of reviews, a before/after case,
a blog post, the Breast Lift procedure) and let me know — I'll wire each live page
to render it, progressively, so nothing breaks in the meantime.
