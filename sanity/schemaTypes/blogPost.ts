import {defineType, defineField} from 'sanity'
import {GenerateImageInput} from '../components/GenerateImageInput'

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
      components: {input: GenerateImageInput},
      options: {
        hotspot: true,
        generate: {
          size: '2048x1536', label: 'blog-cover', needLabel: 'the Title / excerpt',
          contentFields: ['title', 'excerpt'],
          scene: 'An elegant, editorial lifestyle or still-life scene evoking the article theme — soft, refined and calm',
        },
      },
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Groups the post in the journal and drives the related posts shown beside it.',
      options: {
        list: [
          {title: 'Body Lift Surgery', value: 'Body Lift Surgery'},
          {title: 'Breast Contouring Surgery', value: 'Breast Contouring Surgery'},
          {title: 'Minor Surgical Procedures', value: 'Minor Surgical Procedures'},
        ],
      },
    }),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', initialValue: () => new Date().toISOString()}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', title: 'Alt text', type: 'string'},
            {name: 'caption', title: 'Caption', type: 'string', description: 'Shown under the image.'},
          ],
        },
      ],
    }),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'category', media: 'coverImage'}},
})
