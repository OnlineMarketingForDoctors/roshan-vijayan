import {defineType, defineField} from 'sanity'

/**
 * Shared pieces of the page layouts. Headings are split in two because the
 * design sets the second half in italic serif: "Request a" / "consultation."
 * renders as one heading with the second line emphasised.
 */

export const seo = defineType({
  name: 'seo',
  title: 'Search listing',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Browser title', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      validation: (r) => r.max(180).warning('Search engines usually cut off around 160 characters.'),
    }),
  ],
})

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Page hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', description: 'Small label above the heading.'}),
    defineField({name: 'headingTop', title: 'Heading, first line', type: 'string'}),
    defineField({name: 'headingEm', title: 'Heading, italic line', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
    }),
    defineField({
      name: 'imageNarrow',
      title: 'Background image, phone',
      type: 'image',
      options: {hotspot: true},
      description:
        'Optional. A phone crops the sides off the background image, which can cut the subject in half or hide them behind the header buttons. Set a version framed for a narrow screen here and it will be used below 860px. Leave empty to use the same image everywhere.',
    }),
    defineField({name: 'imageAlt', title: 'Image description', type: 'string'}),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string'}),
    defineField({name: 'ctaHref', title: 'Button link', type: 'string'}),
    defineField({name: 'ctaSecondaryLabel', title: 'Second link label', type: 'string'}),
    defineField({name: 'ctaSecondaryHref', title: 'Second link', type: 'string'}),
  ],
  preview: {select: {title: 'headingTop', subtitle: 'eyebrow', media: 'image'}},
})

export const ctaBand = defineType({
  name: 'ctaBand',
  title: 'Closing band',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 2}),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string'}),
    defineField({name: 'ctaHref', title: 'Button link', type: 'string'}),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
    }),
  ],
  preview: {select: {title: 'heading', subtitle: 'eyebrow', media: 'image'}},
})

export const labelledItem = defineType({
  name: 'labelledItem',
  title: 'Labelled item',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'value', title: 'Value', type: 'string'}),
  ],
  preview: {select: {title: 'value', subtitle: 'label'}},
})

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}], lists: []}],
})

export const titledItem = defineType({
  name: 'titledItem',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export const statItem = defineType({
  name: 'statItem',
  title: 'Statistic',
  type: 'object',
  fields: [
    defineField({name: 'value', title: 'Figure', type: 'string', description: 'e.g. 18 or 1,000s'}),
    defineField({name: 'label', title: 'Label', type: 'string'}),
  ],
  preview: {select: {title: 'value', subtitle: 'label'}},
})
