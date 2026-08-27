# Going live

Everything that can be done before the domain exists is done. This is the
ordered list of what happens once you have one, and the handful of decisions
still outstanding.

The site is already in production on Vercel — the project `roshan-vijayan-2`
builds the `nextjs-rebuild` branch and serves it at
`roshan-vijayan-2.vercel.app`. Pointing a domain at it is a settings change,
not a deployment. **Merging into `main` is not required to go live** (see
_Retiring the old site_, last).

---

## 1. Point the domain at the site

1. Vercel → project **roshan-vijayan-2** → Settings → Domains → add the domain.
2. Follow the DNS records Vercel gives you at the registrar.
3. Pick the canonical host — `www.example.co.uk` **or** `example.co.uk`, not
   both. The site is built for the apex, `vijayan.co.uk`, so add
   `www.vijayan.co.uk` to the project as well and set it to **redirect** to the
   apex — Vercel then answers www at the edge with a 308 and never serves a
   second copy of the site there. `next.config.ts` carries the same redirect as
   a fallback, for the case where www reaches the application directly.

   Vercel redirects http to https by itself once a domain is attached; there is
   nothing to configure for that.

## 2. Set the environment variables

Vercel → Settings → Environment Variables, **Production** scope:

**Neither of these is normally needed.** A production deployment already
resolves to `https://vijayan.co.uk` and already invites indexing; a preview
already describes itself by its own Vercel URL and already refuses indexing.
Both follow from `VERCEL_ENV`, in `lib/site.ts`. Set one of these only to
override that:

| Variable | Value | What it overrides |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.example.co.uk` | The domain in canonical links, Open Graph URLs, the JSON-LD identifiers, both sitemaps and llms.txt. No trailing slash. |
| `NEXT_PUBLIC_SITE_LIVE` | `false` | Pulls production back out of the index — `noindex` on every page and `Disallow: /` in robots.txt — without a code change. `true` forces the opposite. |

Both are `NEXT_PUBLIC_`, which means they are **baked in at build time**.
Setting them is not enough — you must redeploy afterwards, or the site keeps
serving the old values.

## 3. Redeploy, then check five things

- `https://<domain>/robots.txt` — should say `Allow: /` and list the sitemap.
  If it still says `Disallow: /`, the deployment is not a Production one, or
  `NEXT_PUBLIC_SITE_LIVE` is set to `false`.
- `https://<domain>/sitemap.xml` — every URL should start with your domain,
  and it should list the procedure and blog pages, not just the seven static
  ones. (It falls back to static-only if Sanity is unreachable during the
  build.)
- View source on the homepage — `<link rel="canonical">` should be your
  domain, and the robots tag should read `index, follow`.
- View source on any inner page — `<link rel="canonical">` and
  `<meta property="og:url">` should both be that page's own URL, not the
  homepage's.
- Share a page link into WhatsApp or Slack — the preview card should show the
  photograph of Mr Vijayan.
- `https://<domain>/llms.txt` — a plain-text summary of the site for language
  models, built from Sanity like the sitemap. Every link in it should start
  with your domain.

## 3b. The old site's URLs

Every address the previous site published is redirected, permanently, in
`lib/legacyRedirects.ts` — 141 journal posts that moved from the root to
`/blog/`, `about-me`, `thank-you`, and the four procedure category pages that
are now bands on `/procedures/`. The nineteen procedure pages kept their exact
URLs and need nothing.

Spot-check a few after go-live: `/benefits-of-abdominoplasty/` should land on
`/blog/benefits-of-abdominoplasty/`, and `/about-me/` on `/about/`.

## 3c. Cookies and consent

Google Tag Manager is not in the page. It is loaded by
`components/CookieConsent.tsx`, and only once a visitor has accepted the
banner — refuse it, or ignore it, and nothing is requested from Google at all.
Consent Mode signals are pushed before Tag Manager loads, so a consent-aware
tag never runs ahead of the answer.

The choice is kept in the visitor's own browser for a year and is never sent
to us. **Cookie settings**, at the foot of every page, brings the banner back.

Two consequences worth knowing:

- Analytics will show fewer sessions than before, because visitors who decline
  are genuinely not counted. That is the point of asking.
- The Tag Manager noscript fallback has been removed. It fired tags for
  visitors with JavaScript disabled, who by definition cannot be asked first.

If you add tags to the container — a Meta Pixel, call tracking, LinkedIn —
add them to the table in `/cookies-policy/` too, and set them to respect
Consent Mode inside Tag Manager.

## 4. Submit to Google

Google Search Console → add the domain as a property → submit
`https://<domain>/sitemap.xml`. Nothing gets indexed until the domain is
serving a Production deployment, so do this last.

## 5. Check the enquiry form

The form on `/contact` and the homepage is embedded from LeadConnector, so
there is nothing to configure in the site and no environment variable to set.
Two things to confirm in LeadConnector itself:

1. The destination inbox for submissions.
2. The post-submission redirect, which should point at
   `https://<domain>/thank-you-contact/`. That page exists and is deliberately
   `noindex` and absent from both sitemaps.

Then send yourself a test enquiry from `/contact` and confirm it arrives and
that you land on the thank-you page.

## 6. The footer credit mark

The footer reads "Powered by Online Marketing For Doctors". The logo sits
beside it as soon as the artwork is in the repository: save it as
`public/images/logos/omd.svg` (`.webp` and `.png` also work) and redeploy.
Until then the credit shows as text alone.

Two things worth knowing before it goes live:

- Enquiries pass through LeadConnector's servers. These are patient enquiries
  naming procedures, so check their data processing terms and where data is
  held against your GDPR obligations, and add a privacy note by the form.
- There is no privacy policy page on the site yet.

---

## Still outstanding

**The Sanity revalidation webhook works — but its URL needs changing at
go-live.** It is verified: Vercel's runtime logs show it returning 200 for
each document a content script patched. It currently points at
`https://roshan-vijayan-2.vercel.app/api/revalidate/`, so update it to the
real domain in Sanity → API → Webhooks. Keep the **trailing slash**: the site
308-redirects without it, and a redirect breaks the signature check.

Worth knowing rather than fixing: revalidation marks pages stale, it does not
rebuild them. So the first page view after an edit still shows the old copy,
and the one after that is correct. That is normal, not a fault — check twice
before concluding an edit has not landed.

To inspect deliveries, Vercel → Logs, filtered to `/api/revalidate`, shows
every call with its status code. 401 means the secret in the webhook and
`SANITY_REVALIDATE_SECRET` in Vercel have diverged; changing that variable
needs a redeploy before it takes effect.

**`/studio` is public.** The CMS is served at `https://<domain>/studio` and is
protected only by Sanity login. That is normal, but it will be on the real
domain, and `robots.txt` disallows it so it should not be indexed.

**The blog covers are generated, not the originals.** All 141 posts imported
with their text, category and excerpt, and all 141 carry a cover. None of the
194 original images could be fetched over the network: the old host answers
image requests with a SiteGround bot-challenge page (HTTP 202 and HTML, never
the file), so this is not something a retry fixes.

The 53 tables and charts that sit inside the articles — across 28 posts — are
the real ones. They were recovered from a copy of the originals and are back in
place, which matters because they carry clinical and pricing figures that must
never be recreated from a description.

The 141 covers are a different case. They were generated to a brief rather than
migrated, each one written from what the original cover showed, so a post about
arm-lift recovery gets an arm-lift photograph rather than a stock abstraction.
They read correctly and are consistent with the rest of the site; they are just
not the pictures the old blog used.

To put the originals back, get `wp-content/uploads` off SiteGround by File
Manager or FTP, put it in `content/uploads/`, and re-run
`scripts/import-blog.ts --force`. It reads the local folder in preference to the
network and leaves a generated cover in place wherever an original still cannot
be found, so nothing is lost by running it.

**No analytics.** Nothing is measuring traffic. Vercel Analytics is one switch
in the dashboard; Google Analytics needs a tag adding.

**No privacy policy or cookie notice.** Needed before collecting enquiries.

**The old Vercel project.** `roshan-vijayan` still exists and builds `main`,
which is the old prototype. Its builds fail on every push. Once the domain is
live on `roshan-vijayan-2`, delete it so nobody points a domain at the wrong
one.

---

## Retiring the old site

`main` and `nextjs-rebuild` hold two different projects. `main` is the old
static prototype (`site/`, `studio/`, `api/`, `serve.py`, `vercel.json`);
`nextjs-rebuild` is this application. They are 61 commits apart one way and 9
the other.

None of this affects go-live. Do it when you want the repository tidy.

**Before merging, preserve the original photographs.** These exist only on
`main` and a merge would delete them:

- `site/images/Mr Roshan 3.jpeg`, `Mr Roshan 4.png`, `Mr Roshan 5.png`
- `site/images/hero 2.png`
- `Assets/` — including the before-and-after set

The copies under `public/images/` are compressed and resized for the web; they
are not substitutes for the originals. Download them, or move them to a branch
or storage that is not being merged away, and only then merge.

Nothing else on `main` is worth keeping — `/studio` is served by the
application itself now (`app/studio/[[...tool]]`), so the old `vercel.json`
rewrites are obsolete.
