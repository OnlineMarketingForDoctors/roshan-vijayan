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
      type: 'reference',
      to: [{type: 'blogCategory'}],
      description: 'Groups the post in the journal and drives the related posts shown beside it.',
    }),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime', initialValue: () => new Date().toISOString()}),
    // Falls back to the title and the excerpt, which is what the pages used
    // before these existed, so an empty field changes nothing.
    defineField({
      name: 'seoTitle',
      title: 'Meta title',
      type: 'string',
      description: 'The browser tab and the search result heading. Leave empty to use the Title.',
      validation: (r) => r.max(70).warning('Over about 60 characters is usually cut short in search results.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'The search result summary. Leave empty to use the Excerpt.',
      validation: (r) => r.max(180).warning('Over about 155 characters is usually cut short in search results.'),
    }),
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
        {type: 'htmlEmbed'},
      ],
    }),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'category.title', media: 'coverImage'}},
})
