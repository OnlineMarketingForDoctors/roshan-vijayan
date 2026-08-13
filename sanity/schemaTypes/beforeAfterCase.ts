import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'beforeAfterCase',
  title: 'Before & After case',
  type: 'document',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (r) => r.required(),
      description: 'Shown under the image, e.g. Bilateral breast reduction · Patient one',
    }),
    defineField({
      name: 'treatment',
      title: 'Treatment',
      type: 'string',
      validation: (r) => r.required(),
      description:
        'Groups cases in the gallery menu, e.g. Arm Lift. Cases sharing a treatment appear together, so two views of one patient belong under the same name.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: ['Breast', 'Body', 'Face', 'Skin & Reconstruction']},
      initialValue: 'Breast',
      description: 'The tab this case appears under on the homepage.',
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before image',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'afterImage',
      title: 'After image',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'beforeLabel',
      title: 'Before label',
      type: 'string',
      description:
        'Only when the first frame is not a plain "before" — e.g. During, for a photograph taken in theatre. Leave empty for Before.',
    }),
    defineField({
      name: 'afterLabel',
      title: 'After label',
      type: 'string',
      description: 'Only when the result is at a stated point, e.g. 1 week after. Leave empty for After.',
    }),
    defineField({
      name: 'procedures',
      title: 'Procedure pages',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'procedure'}]}],
      description:
        'The procedure pages this case appears on. A case can belong to more than one — a skin tumour excision that was also a blepharoplasty belongs on both.',
    }),
    defineField({
      name: 'procedure',
      title: 'Procedure (legacy)',
      type: 'reference',
      to: [{type: 'procedure'}],
      hidden: true,
      description: 'Superseded by Procedure pages; read only when that is empty.',
    }),
    defineField({name: 'order', title: 'Order', type: 'number', description: 'Lower numbers show first.'}),
  ],
  orderings: [{title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'caption', subtitle: 'treatment', media: 'afterImage'}},
})
