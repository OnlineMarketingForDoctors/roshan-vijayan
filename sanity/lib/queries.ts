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
export const blogListQuery = groq`*[_type=="blogPost" && defined(publishedAt)]
  | order(featured desc, publishedAt desc){
    _id, title, "slug": slug.current, excerpt, publishedAt, featured,
    coverImage, "plain": pt::text(body)
  }`

export const blogSlugsQuery = groq`*[_type=="blogPost" && defined(slug.current)]{"slug": slug.current}`

export const blogPostQuery = groq`*[_type=="blogPost" && slug.current==$slug][0]{
  title, excerpt, publishedAt, coverImage, body
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
  introHeading, introBody,
  overviewHeading, overviewBody, overviewImage, overviewImageFlip,
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
