import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'author', title: 'Author', type: 'string', initialValue: 'Verified patient'}),
    defineField({name: 'rating', title: 'Rating', type: 'number', initialValue: 5, validation: (r) => r.min(1).max(5)}),
    defineField({name: 'source', title: 'Source', type: 'string', initialValue: 'iWantGreatCare'}),
    defineField({name: 'procedure', title: 'Procedure', type: 'string', description: 'Optional, e.g. Breast Lift'}),
    defineField({name: 'order', title: 'Order', type: 'number', description: 'Lower numbers show first.'}),
  ],
  orderings: [{title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'author', subtitle: 'quote'}},
})
