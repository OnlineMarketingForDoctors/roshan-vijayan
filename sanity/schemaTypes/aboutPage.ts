import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'Search listing'},
  ],
  fields: [
    defineField({name: 'seo', title: 'Search listing', type: 'seo', group: 'seo'}),
    defineField({name: 'hero', title: 'Hero', type: 'pageHero', group: 'content'}),

    // "An artist's eye, a doctor's honesty" — a two line heading, no italics
    defineField({name: 'profileEyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({name: 'profileHeadingTop', title: 'Heading, first line', type: 'string', group: 'content'}),
    defineField({name: 'profileHeadingBottom', title: 'Heading, second line', type: 'string', group: 'content'}),
    defineField({name: 'profileBody', title: 'Body', type: 'richText', group: 'content'}),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    }),
    defineField({name: 'gmcLine', title: 'GMC line', type: 'string', group: 'content'}),
    defineField({
      name: 'profileImage',
      title: 'Portrait',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
      group: 'content',
    }),

    defineField({name: 'ethosEyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({name: 'ethosQuote', title: 'Quote', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'ethosBody', title: 'Body', type: 'text', rows: 4, group: 'content'}),

    defineField({
      name: 'stats',
      title: 'Figures',
      type: 'array',
      of: [{type: 'statItem'}],
      group: 'content',
    }),

    defineField({name: 'interestEyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({name: 'interestHeadingTop', title: 'Heading, first line', type: 'string', group: 'content'}),
    defineField({name: 'interestHeadingBottom', title: 'Heading, second line', type: 'string', group: 'content'}),
    defineField({name: 'interestBody', title: 'Body', type: 'richText', group: 'content'}),
    defineField({name: 'interestLinkLabel', title: 'Link label', type: 'string', group: 'content'}),
    defineField({
      name: 'interestImage',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
      group: 'content',
    }),

    defineField({name: 'differenceEyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({name: 'differenceHeading', title: 'Heading', type: 'string', group: 'content'}),
    defineField({
      name: 'differenceItems',
      title: 'Points',
      type: 'array',
      of: [{type: 'titledItem'}],
      group: 'content',
    }),

    defineField({name: 'closing', title: 'Closing band', type: 'ctaBand', group: 'content'}),
  ],
  preview: {prepare: () => ({title: 'About page'})},
})
