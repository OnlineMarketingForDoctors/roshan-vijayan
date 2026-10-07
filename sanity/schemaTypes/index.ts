import siteSettings from './siteSettings'
import procedure from './procedure'
import blogPost from './blogPost'
import blogCategory from './blogCategory'
import review from './review'
import beforeAfterCase from './beforeAfterCase'
import contactPage from './contactPage'
import aboutPage from './aboutPage'
import homePage from './homePage'
import locationsPage from './locationsPage'
import {seo, pageHero, ctaBand, labelledItem, richText, titledItem, statItem, proseTable, htmlEmbed} from './objects'

export const schemaTypes = [
  siteSettings,
  procedure,
  blogPost,
  blogCategory,
  review,
  beforeAfterCase,
  contactPage,
  locationsPage,
  aboutPage,
  homePage,
  // shared objects
  seo,
  pageHero,
  ctaBand,
  labelledItem,
  richText,
  titledItem,
  statItem,
  proseTable,
  htmlEmbed,
]
