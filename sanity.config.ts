'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {apiVersion, dataset, projectId} from './sanity/env'
import {schemaTypes} from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'RV Plastic Surgery',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            // one document each, edited in place rather than listed
            S.listItem()
              .title('Homepage')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('About page')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Contact page')
              .id('contactPage')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
            S.listItem()
              .title('Locations page')
              .id('locationsPage')
              .child(S.document().schemaType('locationsPage').documentId('locationsPage')),
            S.divider(),
            S.documentTypeListItem('procedure').title('Procedures'),
            S.documentTypeListItem('blogPost').title('Blog posts'),
            S.documentTypeListItem('review').title('Reviews'),
            S.documentTypeListItem('beforeAfterCase').title('Before & After'),
          ]),
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) =>
      prev.filter((t) => !['siteSettings', 'contactPage', 'locationsPage', 'aboutPage', 'homePage'].includes(t.schemaType)),
  },
})
