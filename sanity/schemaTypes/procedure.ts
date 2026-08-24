import {defineType, defineField} from 'sanity'
import {GenerateImageInput} from '../components/GenerateImageInput'

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
    defineField({name: 'title', title: 'Title (short — used in nav & headings)', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'category', title: 'Category', type: 'string', options: {list: ['Body', 'Face', 'Skin', 'Other']}, initialValue: 'Body', group: 'content'}),
    defineField({name: 'surgical', title: 'Surgical procedure', type: 'boolean', initialValue: true, description: 'Off for in-clinic / non-surgical treatments.', group: 'content'}),

    // ---- Hero ----
    defineField({name: 'heroHeading', title: 'Hero heading (H1)', type: 'string', description: 'Falls back to Title if empty.', group: 'content'}),
    defineField({
      name: 'heroImage', title: 'Hero image', type: 'image', fields: [{name: 'alt', title: 'Alt text', type: 'string', description: 'Describes the picture for screen readers and search engines.'}], group: 'content',
      components: {input: GenerateImageInput},
      options: {
        hotspot: true,
        generate: {
          size: '2048x1152', label: 'hero', needLabel: 'the Hero heading / promise',
          contentFields: ['title', 'heroHeading', 'heroPromise'],
          scene: 'A serene woman in soft ivory silk by a tall window in a calm minimal interior — wide cinematic editorial portrait with generous negative space for text',
        },
      },
    }),
    defineField({name: 'heroImageFlip', title: 'Hero image — mirror horizontally', type: 'boolean', initialValue: false, options: {layout: 'switch'}, description: 'Flips the image so the subject faces the text.', group: 'content'}),
    defineField({name: 'heroPromise', title: 'Hero promise (one line)', type: 'richText', group: 'content'}),
    defineField({name: 'heroBullets', title: 'Hero bullets', type: 'array', of: [{type: 'string'}], group: 'content'}),

    // ---- Intro ----
    // A named clinician taking responsibility for the medical content, shown
    // above the article. Rich text so the GMC number can carry a link.
    defineField({name: 'medicalReview', title: 'Medically reviewed by', type: 'richText', group: 'content'}),

    defineField({name: 'showIntro', title: "Show 'Intro' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'introHeading', title: 'Intro heading', type: 'string', group: 'content'}),
    defineField({name: 'introBody', title: 'Intro body', type: 'array', of: [{type: 'block'}], group: 'content'}),

    // ---- Before & After ----
    defineField({name: 'showResults', title: "Show 'Before & After' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),

    // ---- Overview ----
    defineField({name: 'showOverview', title: "Show 'Overview' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'overviewHeading', title: 'Overview heading', type: 'string', group: 'content'}),
    defineField({name: 'overviewBody', title: 'Overview body', type: 'array', of: [{type: 'block'}], group: 'content'}),
    defineField({
      name: 'overviewImage', title: 'Overview image', type: 'image', fields: [{name: 'alt', title: 'Alt text', type: 'string', description: 'Describes the picture for screen readers and search engines.'}, {name: 'caption', title: 'Caption', type: 'string', description: 'Shown under the image.'}], group: 'content',
      components: {input: GenerateImageInput},
      options: {
        hotspot: true,
        generate: {
          size: '1536x2048', label: 'overview', needLabel: 'the Overview heading / body',
          contentFields: ['title', 'overviewHeading', 'overviewBody'],
          scene: 'A poised, elegant woman in a calm, softly lit interior — refined editorial lifestyle portrait, understated and natural',
        },
      },
    }),
    defineField({name: 'overviewImageFlip', title: 'Overview image — mirror horizontally', type: 'boolean', initialValue: false, options: {layout: 'switch'}, description: 'Flips the image so the subject faces the text.', group: 'content'}),

    // ---- At a glance ----
    defineField({name: 'showGlance', title: "Show 'At a glance' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'glanceHeading', title: 'At a glance heading', type: 'string', description: "Falls back to '<Title> at a glance'.", group: 'content'}),
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

    // ---- What it addresses ----
    defineField({name: 'showConditions', title: "Show 'What it addresses' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'conditionsHeading', title: 'What it addresses — heading', type: 'string', group: 'content'}),
    defineField({name: 'conditionsIntro', title: 'What it addresses — intro', type: 'richText', group: 'content'}),
    defineField({name: 'conditions', title: 'What it addresses — list', type: 'array', of: [{type: 'string'}], group: 'content'}),

    // ---- Benefits ----
    defineField({name: 'showBenefits', title: "Show 'Benefits' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'benefitsHeading', title: 'Benefits heading', type: 'string', group: 'content'}),
    defineField({name: 'benefitsIntro', title: 'Benefits intro', type: 'richText', group: 'content'}),
    defineField({name: 'benefitsList', title: 'Benefits list', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({
      name: 'benefitsImage', title: 'Benefits image', type: 'image', fields: [{name: 'alt', title: 'Alt text', type: 'string', description: 'Describes the picture for screen readers and search engines.'}, {name: 'caption', title: 'Caption', type: 'string', description: 'Shown under the image.'}], group: 'content',
      components: {input: GenerateImageInput},
      options: {
        hotspot: true,
        generate: {
          size: '1536x2048', label: 'benefits', needLabel: 'the Benefits heading / list',
          contentFields: ['title', 'benefitsHeading', 'benefitsIntro'],
          scene: 'A serene woman draped in soft ivory silk in warm natural light — refined editorial portrait conveying poise and quiet confidence',
        },
      },
    }),
    defineField({name: 'benefitsImageFlip', title: 'Benefits image — mirror horizontally', type: 'boolean', initialValue: false, options: {layout: 'switch'}, description: 'Flips the image so the subject faces the text.', group: 'content'}),

    // ---- Candidates ----
    defineField({name: 'showCandidates', title: "Show 'Who may consider' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'candidatesHeading', title: 'Candidates heading', type: 'string', description: "Falls back to 'Who may consider <title>?'.", group: 'content'}),
    defineField({name: 'candidatesIntro', title: 'Candidates intro', type: 'richText', group: 'content'}),
    defineField({name: 'candidates', title: 'Good-candidate signs', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'candidatesOutro', title: 'Candidates outro', type: 'richText', group: 'content'}),
    defineField({
      name: 'candidatesImage', title: 'Candidates image', type: 'image', fields: [{name: 'alt', title: 'Alt text', type: 'string', description: 'Describes the picture for screen readers and search engines.'}, {name: 'caption', title: 'Caption', type: 'string', description: 'Shown under the image.'}], group: 'content',
      components: {input: GenerateImageInput},
      options: {
        hotspot: true,
        generate: {
          size: '1536x2048', label: 'candidates', needLabel: 'the Candidates intro / list',
          contentFields: ['title', 'candidatesIntro', 'candidates'],
          scene: 'A confident, natural woman by a window in soft daylight — serene editorial portrait, calm and reassuring',
        },
      },
    }),
    defineField({name: 'candidatesImageFlip', title: 'Candidates image — mirror horizontally', type: 'boolean', initialValue: false, options: {layout: 'switch'}, description: 'Flips the image so the subject faces the text.', group: 'content'}),

    // ---- Techniques / procedure types ----
    defineField({name: 'showTechniques', title: "Show 'Techniques' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'techniquesHeading', title: 'Techniques heading', type: 'string', description: "Falls back to 'Techniques'.", group: 'content'}),
    defineField({name: 'techniquesIntro', title: 'Techniques intro', type: 'richText', group: 'content'}),
    defineField({
      name: 'techniquesImage', title: 'Techniques image / diagram', type: 'image',
      fields: [{name: 'alt', title: 'Alt text', type: 'string', description: 'Describes the picture for screen readers and search engines.'}, {name: 'caption', title: 'Caption', type: 'string', description: 'Shown under the image.'}],
      options: {hotspot: true}, group: 'content',
    }),
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
            {name: 'description', title: 'Description', type: 'richText'},
          ],
          preview: {select: {title: 'name', subtitle: 'tier'}},
        },
      ],
    }),
    defineField({name: 'techniquesImageFlip', title: 'Techniques image — mirror horizontally', type: 'boolean', initialValue: false, options: {layout: 'switch'}, description: 'Flips the image so the subject faces the text.', group: 'content'}),

    // ---- The procedure ----
    defineField({name: 'showProcedure', title: "Show 'What happens during surgery' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'procedureHeading', title: 'Procedure heading', type: 'string', group: 'content'}),
    defineField({name: 'procedureBody', title: 'Procedure body', type: 'array', of: [{type: 'block'}], group: 'content'}),
    defineField({
      name: 'procedureImage', title: 'Procedure background image', type: 'image', group: 'content',
      components: {input: GenerateImageInput},
      options: {
        hotspot: true,
        generate: {
          size: '2048x1152', label: 'procedure', needLabel: 'the Procedure heading / body',
          contentFields: ['title', 'procedureHeading', 'procedureBody'],
          scene: 'A calm, luxurious private clinic interior with warm light and no people — soft, reassuring, high-end wide establishing shot',
        },
      },
    }),
    defineField({name: 'procedureImageFlip', title: 'Procedure image — mirror horizontally', type: 'boolean', initialValue: false, options: {layout: 'switch'}, description: 'Flips the image so the subject faces the text.', group: 'content'}),

    // ---- Treatment journey ----
    defineField({name: 'showJourney', title: "Show 'Treatment journey' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'journeyHeading', title: 'Journey heading', type: 'string', group: 'content'}),
    defineField({name: 'journeyIntro', title: 'Journey intro', type: 'richText', group: 'content'}),
    defineField({
      name: 'journey',
      title: 'Journey stages',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'journeyStage',
          fields: [
            {name: 'stage', title: 'Stage', type: 'string'},
            {name: 'description', title: 'Description', type: 'richText'},
          ],
          preview: {select: {title: 'stage', subtitle: 'description'}},
        },
      ],
    }),

    // ---- Recovery timeline ----
    defineField({name: 'showRecovery', title: "Show 'Recovery' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'recoveryHeading', title: 'Recovery heading', type: 'string', group: 'content'}),
    defineField({name: 'recoveryIntro', title: 'Recovery intro', type: 'richText', group: 'content'}),
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
            {name: 'description', title: 'Description', type: 'richText'},
          ],
          preview: {select: {title: 'stage', subtitle: 'description'}},
        },
      ],
    }),

    // ---- Risks ----
    defineField({name: 'showRisks', title: "Show 'Risks' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'risksHeading', title: 'Risks heading', type: 'string', group: 'content'}),
    defineField({name: 'risksIntro', title: 'Risks intro', type: 'richText', group: 'content'}),
    defineField({name: 'risks', title: 'Risks', type: 'array', of: [{type: 'string'}], group: 'content'}),

    // ---- Surgeon ----
    defineField({name: 'showSurgeon', title: "Show 'Meet your surgeon' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'surgeonHeading', title: 'Surgeon heading', type: 'string', group: 'content'}),
    defineField({name: 'surgeonBody', title: 'Surgeon body', type: 'array', of: [{type: 'block'}], group: 'content'}),

    // ---- Why choose us ----
    defineField({name: 'showWhy', title: "Show 'Why choose us' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'whyHeading', title: 'Why choose us — heading', type: 'string', group: 'content'}),
    defineField({name: 'whyIntro', title: 'Why choose us — intro', type: 'richText', group: 'content'}),
    defineField({name: 'whyPoints', title: 'Why choose us — points', type: 'array', of: [{type: 'string'}], group: 'content'}),

    // ---- Cost ----
    defineField({name: 'showCost', title: "Show 'Cost' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'costHeading', title: 'Cost heading', type: 'string', description: "Falls back to '<Title> cost'.", group: 'content'}),
    defineField({name: 'costIntro', title: 'Cost intro', type: 'richText', group: 'content'}),
    defineField({name: 'costLead', title: 'Cost lead (above the figure)', type: 'richText', group: 'content'}),
    defineField({name: 'costFrom', title: 'Cost (from)', type: 'string', description: 'e.g. from £6,500', group: 'content'}),
    defineField({name: 'costIncludes', title: 'Fee includes', type: 'array', of: [{type: 'string'}], group: 'content'}),

    // ---- FAQs ----
    defineField({name: 'showFaqs', title: "Show 'FAQs' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'faqHeading', title: 'FAQ heading', type: 'string', group: 'content'}),
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
            {name: 'answer', title: 'Answer', type: 'richText'},
          ],
          preview: {select: {title: 'question'}},
        },
      ],
    }),

    // ---- Related ----
    defineField({name: 'showRelated', title: "Show 'Related procedures' section", type: 'boolean', initialValue: true, options: {layout: 'switch'}, group: 'content'}),
    defineField({name: 'related', title: 'Related procedures', type: 'array', of: [{type: 'reference', to: [{type: 'procedure'}]}], group: 'content'}),

    // ---- Closing CTA ----
    defineField({name: 'ctaHeading', title: 'Closing CTA heading', type: 'string', group: 'content'}),
    defineField({name: 'ctaBody', title: 'Closing CTA body', type: 'richText', group: 'content'}),

    // ---- SEO ----
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 2, group: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'category'}},
})
