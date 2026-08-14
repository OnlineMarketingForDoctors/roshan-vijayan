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
   both. Vercel redirects the other one to it. Whichever you choose has to
   match `NEXT_PUBLIC_SITE_URL` below exactly, or every canonical tag on the
   site will point at a URL that redirects.

## 2. Set the environment variables

Vercel → Settings → Environment Variables, **Production** scope:

| Variable | Value | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.example.co.uk` | Canonical links, Open Graph URLs, the sitemap. No trailing slash. |
| `NEXT_PUBLIC_SITE_LIVE` | `true` | Removes `noindex` and opens robots.txt to crawlers. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | your Formspree URL | Where enquiries are sent. |

These three are `NEXT_PUBLIC_`, which means they are **baked in at build
time**. Setting them is not enough — you must redeploy afterwards, or the site
keeps serving the old values.

Leave them unset on Preview. Previews then stay `noindex` and describe
themselves by their own Vercel URL, which is what you want.

## 3. Redeploy, then check four things

- `https://<domain>/robots.txt` — should say `Allow: /` and list the sitemap.
  If it still says `Disallow: /`, `NEXT_PUBLIC_SITE_LIVE` did not take.
- `https://<domain>/sitemap.xml` — every URL should start with your domain,
  and it should list the procedure and blog pages, not just the seven static
  ones. (It falls back to static-only if Sanity is unreachable during the
  build.)
- View source on the homepage — `<link rel="canonical">` should be your
  domain, and there should be **no** `<meta name="robots" content="noindex">`.
- Share a page link into WhatsApp or Slack — the preview card should show the
  photograph of Mr Vijayan.

## 4. Submit to Google

Google Search Console → add the domain as a property → submit
`https://<domain>/sitemap.xml`. Nothing gets indexed until step 2 is done, so
do this last.

## 5. Set up the enquiry form

1. Create the form at [formspree.io](https://formspree.io) and set the
   destination inbox.
2. Put its endpoint (`https://formspree.io/f/xxxxxxx`) in
   `NEXT_PUBLIC_FORM_ENDPOINT` and redeploy.
3. Send yourself a test enquiry from `/contact` and confirm it arrives.

Until that variable is set the form shows an error and points people at the
phone number and email address instead — it never silently swallows an
enquiry, but it also cannot accept one, so treat this as a launch blocker.

Two things worth knowing before it goes live:

- Enquiries pass through Formspree's servers. These are patient enquiries
  naming procedures, so check their data processing terms and where data is
  held against your GDPR obligations, and add a privacy note by the form.
- There is no privacy policy page on the site yet.

---

## Still outstanding

**The Sanity revalidation webhook may not be firing.** After the last content
script ran, pages kept serving stale copy for several minutes rather than
updating immediately — which is what the webhook exists to prevent. Check
Sanity → API → Webhooks: there should be one pointing at
`https://<domain>/api/revalidate/` (**with** the trailing slash — the site
redirects without it, and a redirect will break the signature check), with the
secret matching `SANITY_REVALIDATE_SECRET` in Vercel. Without it, edits take up
to five minutes to appear. With it, they are immediate.

**`/studio` is public.** The CMS is served at `https://<domain>/studio` and is
protected only by Sanity login. That is normal, but it will be on the real
domain, and `robots.txt` disallows it so it should not be indexed.

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
