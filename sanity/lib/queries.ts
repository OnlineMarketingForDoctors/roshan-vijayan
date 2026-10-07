import {groq} from 'next-sanity'

/* ---- Global ---- */
export const siteSettingsQuery = groq`*[_type=="siteSettings"][0]{
  practiceName, surgeonName, credentials, gmcNumber, phone, email,
  reviewScore, reviewCount, reviewSource,
  locations[]{name, address, note}
}`

/* ---- Reviews ---- */
export const reviewsQuery = groq`*[_type=="review" && defined(quote)]
  | order(order asc, _createdAt asc){
    _id, quote, author, rating, source, procedure
  }`

/* ---- Before & After ---- */
export const beforeAfterQuery = groq`*[_type=="beforeAfterCase" && defined(beforeImage) && defined(afterImage)]
  | order(order asc, _createdAt asc){
    _id, caption, treatment, category, beforeImage, afterImage, beforeLabel, afterLabel,
    "procedureSlugs": array::compact(
      procedures[]->slug.current + [procedure->slug.current]
    )
  }`

/* ---- Blog ---- */
/*
 * Category reads through coalesce for the length of the migration: it was a
 * string on the post and is now a reference to a blogCategory, and this returns
 * the name either way. Dereferencing a string yields null rather than an error,
 * so the old shape falls through to itself. Everything downstream still receives
 * a plain name and none of it had to change.
 */
export const blogListQuery = groq`*[_type=="blogPost" && defined(publishedAt)]
  | order(featured desc, publishedAt desc){
    _id, title, "slug": slug.current, excerpt, publishedAt, featured, "category": coalesce(category->title, category),
    coverImage, "plain": pt::text(body)
  }`

/** Category names with their post counts, for the journal sidebar. */
export const blogCategoriesQuery = groq`*[_type=="blogPost" && defined(category)]{"category": coalesce(category->title, category)}`

export const blogSlugsQuery = groq`*[_type=="blogPost" && defined(slug.current)]{"slug": slug.current}`

/**
 * Titles and slugs only, for the human sitemap. blogListQuery would do, but it
 * carries the plain text of every article — several megabytes to render a list
 * of links.
 */
export const blogIndexQuery = groq`*[_type=="blogPost" && defined(slug.current)]
  | order(title asc){
    _id, title, "slug": slug.current, "category": coalesce(category->title, category), excerpt
  }`

export const blogPostQuery = groq`*[_type=="blogPost" && slug.current==$slug][0]{
  title, excerpt, publishedAt, coverImage, body, seoTitle, seoDescription, "category": coalesce(category->title, category)
}`

/**
 * Other posts to read next: same category first, then anything recent, never
 * the post being read. Asking for more than are shown leaves room to drop the
 * current one without coming up short.
 */
export const relatedPostsQuery = groq`{
  "sameCategory": *[_type=="blogPost" && defined(publishedAt) && coalesce(category->title, category)==$category && slug.current!=$slug]
    | order(publishedAt desc)[0...6]{title, "slug": slug.current, publishedAt, coverImage, "category": coalesce(category->title, category)},
  "recent": *[_type=="blogPost" && defined(publishedAt) && slug.current!=$slug]
    | order(publishedAt desc)[0...6]{title, "slug": slug.current, publishedAt, coverImage, "category": coalesce(category->title, category)}
}`

/* ---- Procedures ---- */
export const procedureListQuery = groq`*[_type=="procedure" && defined(slug.current)]
  | order(title asc){
    _id, title, "slug": slug.current, category, surgical, heroPromise, overviewImage
  }`

export const procedureSlugsQuery = groq`*[_type=="procedure" && defined(slug.current)]{"slug": slug.current, category}`

export const procedureQuery = groq`*[_type=="procedure" && slug.current==$slug][0]{
  title, category, surgical, heroHeading, heroImage, heroImageFlip, heroPromise, heroBullets,
  showIntro, showResults, showOverview, showGlance, showConditions, showBenefits,
  showCandidates, showTechniques, showProcedure, showJourney, showRecovery,
  showRisks, showSurgeon, showWhy, showCost, showFaqs, showRelated,
  medicalReview,
  introHeading, introBody,
  overviewHeading, overviewBody, overviewOutro, overviewImage, overviewImageFlip,
  glanceHeading, atAGlance[]{icon, label, value},
  conditionsHeading, conditionsIntro, conditions,
  benefitsHeading, benefitsIntro, benefitsList, benefitsImage, benefitsImageFlip,
  candidatesHeading, candidatesIntro, candidates, candidatesOutro, candidatesImage, candidatesImageFlip,
  techniquesHeading, techniquesIntro, techniquesImage, techniquesImageFlip, techniques[]{name, tier, description},
  procedureHeading, procedureBody, procedureImage, procedureImageFlip,
  journeyHeading, journeyIntro, journey[]{stage, description},
  recoveryHeading, recoveryIntro, recovery[]{stage, description},
  risksHeading, risksIntro, risks,
  surgeonHeading, surgeonBody,
  whyHeading, whyIntro, whyPoints,
  costHeading, costIntro, costLead, costFrom, costIncludes,
  faqHeading, faqs[]{question, answer},
  related[]->{title, "slug": slug.current, category, heroPromise},
  ctaHeading, ctaBody,
  seoTitle, seoDescription
}`

/* ---- Editable pages ---- */
const HERO = `eyebrow, headingTop, headingEm, body, imageAlt, ctaLabel, ctaHref, "imageUrl": image.asset->url, "imageUrlNarrow": imageNarrow.asset->url`
const BAND = `eyebrow, heading, body, ctaLabel, ctaHref, "imageUrl": image.asset->url`

export const contactPageQuery = groq`*[_type=="contactPage"][0]{
  seo, hero{${HERO}},
  enquiryEyebrow, enquiryHeadingTop, enquiryHeadingEm, enquiryBody,
  enquiryMeta[]{label, value},
  locationsEyebrow, locationsHeading, locationsBody,
  locationsSummary[]{label, value}, locationsLinkLabel
}`

export const locationsPageQuery = groq`*[_type=="locationsPage"][0]{
  seo, hero{${HERO}},
  cards[]{name, tag, address, description, mapUrl, "imageUrl": image.asset->url},
  closing{${BAND}}
}`

export const aboutPageQuery = groq`*[_type=="aboutPage"][0]{
  seo, hero{${HERO}, ctaSecondaryLabel, ctaSecondaryHref},
  profileEyebrow, profileHeadingTop, profileHeadingBottom, profileBody,
  credentials, gmcLine, "profileImageUrl": profileImage.asset->url,
  ethosEyebrow, ethosQuote, ethosBody,
  stats[]{value, label},
  interestEyebrow, interestHeadingTop, interestHeadingBottom, interestBody,
  interestLinkLabel, "interestImageUrl": interestImage.asset->url,
  differenceEyebrow, differenceHeading, differenceItems[]{title, body},
  closing{${BAND}}
}`

export const homePageQuery = groq`*[_type=="homePage"][0]{
  seo,
  heroEyebrow, heroHeadingTop, heroHeadingEm, heroHeadingBottom, heroBody,
  heroCtaLabel, heroLinkLabel, heroImageAlt, "heroImageUrl": heroImage.asset->url,
  "heroImageUrlNarrow": heroImageNarrow.asset->url, usps,
  philEyebrow, philQuote, philBody, philLinkLabel, "philImageUrl": philImage.asset->url,
  resultsEyebrow, resultsHeadingTop, resultsHeadingEm, resultsBody,
  servicesEyebrow, servicesHeadingTop, servicesHeadingEm, servicesBody, servicesLinkLabel,
  diffEyebrow, diffHeadingA, diffHeadingEm1, diffHeadingB, diffHeadingEm2,
  diffItems[]{title, body}, "diffImageUrl": diffImage.asset->url,
  aboutEyebrow, aboutHeadingTop, aboutHeadingEm, aboutBody, aboutCredentials, aboutGmcLine,
  "aboutImageUrl": aboutImage.asset->url, aboutStatValue, aboutStatLabel,
  accredMembershipsLabel, accredInsurersLabel,
  journeyEyebrow, journeyHeading, journeySteps[]{title, body},
  locationsEyebrow, locationsHeadingTop, locationsHeadingEm,
  locationItems[]{label, value}, "locationsImageUrl": locationsImage.asset->url,
  contactEyebrow, contactHeadingTop, contactHeadingEm, contactBody, contactMeta[]{label, value}
}`
