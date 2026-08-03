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
    _id, caption, category, beforeImage, afterImage
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

export const procedureSlugsQuery = groq`*[_type=="procedure" && defined(slug.current)]{"slug": slug.current}`

export const procedureQuery = groq`*[_type=="procedure" && slug.current==$slug][0]{
  title, category, surgical, heroPromise, benefits,
  showResults, showOverview, showGlance, showCandidates, showTechniques,
  showProcedure, showRecovery, showRisks, showSurgeon, showWhy, showCost, showFaqs, showRelated,
  overviewHeading, overviewBody, overviewImage,
  atAGlance[]{icon, label, value},
  candidatesIntro, candidates, candidatesOutro, candidatesImage,
  techniquesIntro, techniquesImage, techniques[]{name, tier, description},
  procedureHeading, procedureBody, procedureImage,
  recovery[]{stage, description},
  risksIntro, risks[]{title, description},
  surgeonQuote,
  costFrom, costIntro, costIncludes,
  faqs[]{question, answer},
  related[]->{title, "slug": slug.current, heroPromise},
  seoTitle, seoDescription
}`
