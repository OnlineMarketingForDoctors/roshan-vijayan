import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'locationsPage',
  title: 'Locations page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'Search listing'},
  ],
  fields: [
    defineField({name: 'seo', title: 'Search listing', type: 'seo', group: 'seo'}),
    defineField({name: 'hero', title: 'Hero', type: 'pageHero', group: 'content'}),
    defineField({
      name: 'cards',
      title: 'Locations',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'locationCard',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'tag', title: 'Tag', type: 'string', description: 'e.g. Private · Main Practice'}),
            defineField({name: 'address', title: 'Address', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({name: 'mapUrl', title: 'Directions link', type: 'url'}),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Leave empty to keep the image currently on the page.',
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'tag', media: 'image'}},
        },
      ],
    }),
    defineField({name: 'closing', title: 'Closing band', type: 'ctaBand', group: 'content'}),
  ],
  preview: {prepare: () => ({title: 'Locations page'})},
})
