import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (r) => r.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, description: 'Short summary shown on the blog listing.'}),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    }),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', initialValue: () => new Date().toISOString()}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}, fields: [{name: 'alt', title: 'Alt text', type: 'string'}]},
      ],
    }),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'coverImage'}},
})
