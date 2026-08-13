import {defineType, defineField} from 'sanity'

/**
 * The homepage, section by section, in the order it renders. Reviews, before &
 * after cases and the procedure carousel are their own documents and are not
 * repeated here.
 */
export default defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'middle', title: 'Sections'},
    {name: 'closing', title: 'Journey & contact'},
    {name: 'seo', title: 'Search listing'},
  ],
  fields: [
    defineField({name: 'seo', title: 'Search listing', type: 'seo', group: 'seo'}),

    /* hero */
    defineField({name: 'heroEyebrow', title: 'Eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadingTop', title: 'Heading, first line', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadingEm', title: 'Heading, italic line', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadingBottom', title: 'Heading, last line', type: 'string', group: 'hero'}),
    defineField({name: 'heroBody', title: 'Body', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroCtaLabel', title: 'Button label', type: 'string', group: 'hero'}),
    defineField({name: 'heroLinkLabel', title: 'Second link label', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
      group: 'hero',
    }),
    defineField({name: 'heroImageAlt', title: 'Image description', type: 'string', group: 'hero'}),
    defineField({
      name: 'usps',
      title: 'Points under the hero',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Numbered automatically, in this order.',
      group: 'hero',
    }),

    /* philosophy */
    defineField({name: 'philEyebrow', title: 'Eyebrow', type: 'string', group: 'middle'}),
    defineField({name: 'philQuote', title: 'Quote', type: 'text', rows: 3, group: 'middle'}),
    defineField({name: 'philBody', title: 'Body', type: 'richText', group: 'middle'}),
    defineField({name: 'philLinkLabel', title: 'Link label', type: 'string', group: 'middle'}),
    defineField({
      name: 'philImage',
      title: 'Portrait',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
      group: 'middle',
    }),

    /* results */
    defineField({name: 'resultsEyebrow', title: 'Eyebrow', type: 'string', group: 'middle'}),
    defineField({name: 'resultsHeadingTop', title: 'Heading, first part', type: 'string', group: 'middle'}),
    defineField({name: 'resultsHeadingEm', title: 'Heading, italic part', type: 'string', group: 'middle'}),
    defineField({name: 'resultsBody', title: 'Body', type: 'text', rows: 3, group: 'middle'}),

    /* services */
    defineField({name: 'servicesEyebrow', title: 'Eyebrow', type: 'string', group: 'middle'}),
    defineField({name: 'servicesHeadingTop', title: 'Heading, first line', type: 'string', group: 'middle'}),
    defineField({name: 'servicesHeadingEm', title: 'Heading, italic line', type: 'string', group: 'middle'}),
    defineField({name: 'servicesBody', title: 'Body', type: 'text', rows: 4, group: 'middle'}),
    defineField({name: 'servicesLinkLabel', title: 'Link label', type: 'string', group: 'middle'}),

    /* the difference — the heading sets two words in italic */
    defineField({name: 'diffEyebrow', title: 'Eyebrow', type: 'string', group: 'middle'}),
    defineField({name: 'diffHeadingA', title: 'Heading, part 1', type: 'string', group: 'middle'}),
    defineField({name: 'diffHeadingEm1', title: 'Heading, italic 1', type: 'string', group: 'middle'}),
    defineField({name: 'diffHeadingB', title: 'Heading, part 2', type: 'string', group: 'middle'}),
    defineField({name: 'diffHeadingEm2', title: 'Heading, italic 2', type: 'string', group: 'middle'}),
    defineField({
      name: 'diffItems',
      title: 'Points',
      type: 'array',
      of: [{type: 'titledItem'}],
      group: 'middle',
    }),
    defineField({
      name: 'diffImage',
      title: 'Photograph',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
      group: 'middle',
    }),

    /* about strip */
    defineField({name: 'aboutEyebrow', title: 'Eyebrow', type: 'string', group: 'middle'}),
    defineField({name: 'aboutHeadingTop', title: 'Heading, first line', type: 'string', group: 'middle'}),
    defineField({name: 'aboutHeadingEm', title: 'Heading, italic line', type: 'string', group: 'middle'}),
    defineField({name: 'aboutBody', title: 'Body', type: 'richText', group: 'middle'}),
    defineField({
      name: 'aboutCredentials',
      title: 'Credentials',
      type: 'array',
      of: [{type: 'string'}],
      group: 'middle',
    }),
    defineField({name: 'aboutGmcLine', title: 'GMC line', type: 'string', group: 'middle'}),
    defineField({
      name: 'aboutImage',
      title: 'Photograph',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
      group: 'middle',
    }),
    defineField({name: 'aboutStatValue', title: 'Figure', type: 'string', group: 'middle'}),
    defineField({name: 'aboutStatLabel', title: 'Figure label', type: 'string', group: 'middle'}),

    /* accreditations — the logos themselves stay in the repository */
    defineField({name: 'accredMembershipsLabel', title: 'Memberships label', type: 'string', group: 'middle'}),
    defineField({name: 'accredInsurersLabel', title: 'Insurers label', type: 'string', group: 'middle'}),

    /* journey */
    defineField({name: 'journeyEyebrow', title: 'Eyebrow', type: 'string', group: 'closing'}),
    defineField({name: 'journeyHeading', title: 'Heading', type: 'string', group: 'closing'}),
    defineField({
      name: 'journeySteps',
      title: 'Steps',
      type: 'array',
      of: [{type: 'titledItem'}],
      description: 'Numbered automatically, in this order.',
      group: 'closing',
    }),

    /* locations strip */
    defineField({name: 'locationsEyebrow', title: 'Eyebrow', type: 'string', group: 'closing'}),
    defineField({name: 'locationsHeadingTop', title: 'Heading, first part', type: 'string', group: 'closing'}),
    defineField({name: 'locationsHeadingEm', title: 'Heading, italic part', type: 'string', group: 'closing'}),
    defineField({
      name: 'locationItems',
      title: 'Locations',
      type: 'array',
      of: [{type: 'labelledItem'}],
      description: 'Label is the setting, value is the address.',
      group: 'closing',
    }),
    defineField({
      name: 'locationsImage',
      title: 'Photograph',
      type: 'image',
      options: {hotspot: true},
      description: 'Leave empty to keep the image currently on the page.',
      group: 'closing',
    }),

    /* contact */
    defineField({name: 'contactEyebrow', title: 'Eyebrow', type: 'string', group: 'closing'}),
    defineField({name: 'contactHeadingTop', title: 'Heading, first line', type: 'string', group: 'closing'}),
    defineField({name: 'contactHeadingEm', title: 'Heading, italic line', type: 'string', group: 'closing'}),
    defineField({name: 'contactBody', title: 'Body', type: 'text', rows: 3, group: 'closing'}),
    defineField({
      name: 'contactMeta',
      title: 'Contact details',
      type: 'array',
      of: [{type: 'labelledItem'}],
      group: 'closing',
    }),
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})
