import {defineType, defineField} from 'sanity'

/**
 * A condition page: what a patient has, rather than what we do about it.
 *
 * It sits beside the procedures rather than inside them — someone searching
 * for the thing troubling them arrives here, and the related procedures are
 * the way out of the page. The fields are deliberately few; a condition is a
 * piece of writing with a hero, not a page of bands like a procedure.
 */
export default defineType({
  name: 'condition',
  title: 'Condition',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'Search'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug',
      options: {source: 'title', maxLength: 96}, validation: (r) => r.required(), group: 'content',
      description: 'The address, under /conditions/.',
    }),
    defineField({
      name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content',
      description: 'The small line above the heading. Optional.',
    }),
    defineField({
      name: 'heroHeading', title: 'Hero heading (H1)', type: 'string', group: 'content',
      description: 'Falls back to the Title if empty.',
    }),
    defineField({name: 'heroPromise', title: 'Hero promise (one line)', type: 'richText', group: 'content'}),
    // The named clinician taking responsibility for the medical content, shown
    // above the article exactly as it is on a procedure page.
    defineField({name: 'medicalReview', title: 'Medically reviewed by', type: 'richText', group: 'content'}),
    defineField({
      name: 'heroImage', title: 'Hero image', type: 'image', options: {hotspot: true}, group: 'content',
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    }),
    defineField({
      name: 'body', title: 'Body', type: 'array', group: 'content',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}, fields: [
          {name: 'alt', title: 'Alt text', type: 'string'},
          {name: 'caption', title: 'Caption', type: 'string'},
        ]},
        {type: 'proseTable'},
        {type: 'htmlEmbed'},
      ],
    }),
    defineField({name: 'whyHeading', title: 'Why choose — heading', type: 'string', group: 'content'}),
    defineField({name: 'whyIntro', title: 'Why choose — intro', type: 'richText', group: 'content'}),
    defineField({
      name: 'whyPoints', title: 'Why choose — points', type: 'array', of: [{type: 'string'}],
      group: 'content',
    }),
    defineField({name: 'ctaHeading', title: 'Closing call to action — heading', type: 'string', group: 'content'}),
    defineField({name: 'ctaBody', title: 'Closing call to action — body', type: 'richText', group: 'content'}),
    defineField({name: 'faqHeading', title: 'FAQ heading', type: 'string', group: 'content'}),
    defineField({
      name: 'faqs', title: 'FAQs', type: 'array', group: 'content',
      // declared here rather than shared, as the procedure pages declare theirs
      of: [{
        type: 'object', name: 'faq',
        fields: [
          {name: 'question', title: 'Question', type: 'string'},
          {name: 'answer', title: 'Answer', type: 'richText'},
        ],
        preview: {select: {title: 'question'}},
      }],
      description: 'Also published as FAQPage structured data, from these same words.',
    }),
    defineField({
      name: 'order', title: 'Order', type: 'number', group: 'content',
      description: 'Lower numbers come first in the menu. Optional.',
    }),
    defineField({name: 'seoTitle', title: 'Meta title', type: 'string', group: 'seo',
      description: 'Leave empty to use the Title.',
      validation: (r) => r.max(70).warning('Over about 60 characters is usually cut short in search results.')}),
    defineField({name: 'seoDescription', title: 'Meta description', type: 'text', rows: 3, group: 'seo',
      validation: (r) => r.max(180).warning('Over about 155 characters is usually cut short in search results.')}),
  ],
  orderings: [{title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'slug.current', media: 'heroImage'}},
})
