import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'beforeAfterCase',
  title: 'Before & After case',
  type: 'document',
  fields: [
    defineField({name: 'caption', title: 'Caption', type: 'string', validation: (r) => r.required(), description: 'e.g. 5 weeks after bilateral auto-augmentation mastopexy'}),
    defineField({name: 'category', title: 'Category', type: 'string', options: {list: ['Breast', 'Body', 'Face']}, initialValue: 'Breast'}),
    defineField({name: 'beforeImage', title: 'Before image', type: 'image', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({name: 'afterImage', title: 'After image', type: 'image', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({name: 'procedure', title: 'Procedure', type: 'reference', to: [{type: 'procedure'}], description: 'Optional link to a procedure.'}),
    defineField({name: 'order', title: 'Order', type: 'number', description: 'Lower numbers show first.'}),
  ],
  orderings: [{title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'caption', subtitle: 'category', media: 'afterImage'}},
})
