import {defineType, defineField} from 'sanity'

const GLANCE_ICONS = ['clock', 'briefcase', 'home', 'droplet', 'walk', 'activity', 'heart', 'moon', 'check', 'navigation', 'shield', 'chat', 'clipboard']

export default defineType({
  name: 'procedure',
  title: 'Procedure',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---- Identity ----
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'category', title: 'Category', type: 'string', options: {list: ['Body', 'Face', 'Skin', 'Other']}, initialValue: 'Body', group: 'content'}),
    defineField({name: 'surgical', title: 'Surgical procedure', type: 'boolean', initialValue: true, description: 'Off for in-clinic / non-surgical treatments.', group: 'content'}),

    // ---- Before & After (section visibility) ----
    defineField({name: 'showResults', title: "Show 'Before & After' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),

    // ---- Hero ----
    defineField({name: 'heroPromise', title: 'Hero promise (one line)', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'benefits', title: 'Key benefits', type: 'array', of: [{type: 'string'}], group: 'content'}),

    // ---- Overview ----
    defineField({name: 'showOverview', title: "Show 'Overview' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'overviewHeading', title: 'Overview heading', type: 'string', group: 'content'}),
    defineField({name: 'overviewBody', title: 'Overview body', type: 'array', of: [{type: 'block'}], group: 'content'}),
    defineField({name: 'overviewImage', title: 'Overview image', type: 'image', options: {hotspot: true}, group: 'content'}),

    // ---- At a glance ----
    defineField({name: 'showGlance', title: "Show 'At a glance' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({
      name: 'atAGlance',
      title: 'At a glance',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'glanceItem',
          fields: [
            {name: 'icon', title: 'Icon', type: 'string', options: {list: GLANCE_ICONS}},
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'value', title: 'Value', type: 'string'},
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        },
      ],
    }),

    // ---- Candidates ----
    defineField({name: 'showCandidates', title: "Show 'Who may consider' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'candidatesIntro', title: 'Candidates intro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'candidates', title: 'Good-candidate signs', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'candidatesOutro', title: 'Candidates outro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'candidatesImage', title: 'Candidates image', type: 'image', options: {hotspot: true}, group: 'content'}),

    // ---- Techniques ----
    defineField({name: 'showTechniques', title: "Show 'Techniques' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'techniquesIntro', title: 'Techniques intro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'techniquesImage', title: 'Techniques image / diagram', type: 'image', options: {hotspot: true}, group: 'content'}),
    defineField({
      name: 'techniques',
      title: 'Techniques',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'technique',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'tier', title: 'Tier', type: 'string', description: 'e.g. mild sagging'},
            {name: 'description', title: 'Description', type: 'text', rows: 2},
          ],
          preview: {select: {title: 'name', subtitle: 'tier'}},
        },
      ],
    }),

    // ---- The procedure ----
    defineField({name: 'showProcedure', title: "Show 'What happens during surgery' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'procedureHeading', title: 'Procedure heading', type: 'string', group: 'content'}),
    defineField({name: 'procedureBody', title: 'Procedure body', type: 'array', of: [{type: 'block'}], group: 'content'}),
    defineField({name: 'procedureImage', title: 'Procedure background image', type: 'image', options: {hotspot: true}, group: 'content'}),

    // ---- Recovery ----
    defineField({name: 'showRecovery', title: "Show 'Recovery' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({
      name: 'recovery',
      title: 'Recovery timeline',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'recoveryStage',
          fields: [
            {name: 'stage', title: 'Stage', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 2},
          ],
          preview: {select: {title: 'stage', subtitle: 'description'}},
        },
      ],
    }),

    // ---- Risks ----
    defineField({name: 'showRisks', title: "Show 'Risks' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'risksIntro', title: 'Risks intro', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'risks',
      title: 'Risks',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'risk',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 2},
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        },
      ],
    }),

    // ---- Surgeon ----
    defineField({name: 'showSurgeon', title: "Show 'Meet your surgeon' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'surgeonQuote', title: 'Surgeon quote', type: 'text', rows: 3, group: 'content'}),

    // ---- Why choose us ----
    defineField({name: 'showWhy', title: "Show 'Why choose us' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),

    // ---- Cost ----
    defineField({name: 'showCost', title: "Show 'Cost' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'costFrom', title: 'Cost (from)', type: 'string', description: 'e.g. from £6,500', group: 'content'}),
    defineField({name: 'costIntro', title: 'Cost intro', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'costIncludes', title: 'Fee includes', type: 'array', of: [{type: 'string'}], group: 'content'}),

    // ---- FAQs ----
    defineField({name: 'showFaqs', title: "Show 'FAQs' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            {name: 'question', title: 'Question', type: 'string'},
            {name: 'answer', title: 'Answer', type: 'text', rows: 3},
          ],
          preview: {select: {title: 'question'}},
        },
      ],
    }),

    // ---- Related ----
    defineField({name: 'showRelated', title: "Show 'Related procedures' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'related', title: 'Related procedures', type: 'array', of: [{type: 'reference', to: [{type: 'procedure'}]}], group: 'content'}),

    // ---- SEO ----
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 2, group: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'category'}},
})
