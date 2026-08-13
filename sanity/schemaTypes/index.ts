import siteSettings from './siteSettings'
import procedure from './procedure'
import blogPost from './blogPost'
import review from './review'
import beforeAfterCase from './beforeAfterCase'
import contactPage from './contactPage'
import locationsPage from './locationsPage'
import {seo, pageHero, ctaBand, labelledItem} from './objects'

export const schemaTypes = [
  siteSettings,
  procedure,
  blogPost,
  review,
  beforeAfterCase,
  contactPage,
  locationsPage,
  // shared objects
  seo,
  pageHero,
  ctaBand,
  labelledItem,
]
