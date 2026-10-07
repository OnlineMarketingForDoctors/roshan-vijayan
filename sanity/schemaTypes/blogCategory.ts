import {defineType, defineField} from 'sanity'

/**
 * A journal category, as a document rather than a value in a list.
 *
 * It was a string chosen from options hard-coded in this file, so adding or
 * renaming one meant a code change and a deploy. As documents they are the
 * editor's to create, rename and remove, and a rename reaches every post at
 * once because the posts point at the category rather than repeating its name.
 */
export default defineType({
  name: 'blogCategory',
  title: 'Blog category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
      description: 'Shown as the filter on the journal, and beside each post.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers come first in the filter. Optional.',
    }),
  ],
  orderings: [{title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'order'}},
})
