import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'Search listing'},
  ],
  fields: [
    defineField({name: 'seo', title: 'Search listing', type: 'seo', group: 'seo'}),
    defineField({name: 'hero', title: 'Hero', type: 'pageHero', group: 'content'}),

    defineField({name: 'enquiryEyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({name: 'enquiryHeadingTop', title: 'Heading, first line', type: 'string', group: 'content'}),
    defineField({name: 'enquiryHeadingEm', title: 'Heading, italic line', type: 'string', group: 'content'}),
    defineField({name: 'enquiryBody', title: 'Body', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'enquiryMeta',
      title: 'Contact details',
      type: 'array',
      of: [{type: 'labelledItem'}],
      description: 'Shown beside the form, e.g. Call · 01727 221799.',
      group: 'content',
    }),

    defineField({name: 'locationsEyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({name: 'locationsHeading', title: 'Heading', type: 'string', group: 'content'}),
    defineField({name: 'locationsBody', title: 'Body', type: 'string', group: 'content'}),
    defineField({
      name: 'locationsSummary',
      title: 'Locations shown',
      type: 'array',
      of: [{type: 'labelledItem'}],
      description: 'Label is the setting, value is the address.',
      group: 'content',
    }),
    defineField({name: 'locationsLinkLabel', title: 'Link label', type: 'string', group: 'content'}),
  ],
  preview: {prepare: () => ({title: 'Contact page'})},
})
