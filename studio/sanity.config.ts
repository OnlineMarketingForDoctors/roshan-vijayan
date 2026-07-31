import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'RV Plastic Surgery',

  projectId: 'xtpxp7mw',
  dataset: 'production',

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
            S.documentTypeListItem('procedure').title('Procedures'),
            S.documentTypeListItem('blogPost').title('Blog posts'),
            S.documentTypeListItem('review').title('Reviews'),
            S.documentTypeListItem('beforeAfterCase').title('Before & After'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Site Settings is a singleton — hide it from the global "create new" menu.
    templates: (prev) => prev.filter((t) => t.schemaType !== 'siteSettings'),
  },
})
