import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'practiceName', title: 'Practice name', type: 'string', initialValue: 'RV Plastic Surgery'}),
    defineField({name: 'surgeonName', title: 'Surgeon name', type: 'string', initialValue: 'Mr Roshan Vijayan'}),
    defineField({name: 'credentials', title: 'Credentials', type: 'string', description: 'e.g. MBBS FRCS(Plast)'}),
    defineField({name: 'gmcNumber', title: 'GMC number', type: 'string'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'location',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'address', title: 'Address', type: 'string'},
            {name: 'note', title: 'Note', type: 'string', description: 'Optional, e.g. NHS'},
          ],
          preview: {select: {title: 'name', subtitle: 'address'}},
        },
      ],
    }),
    defineField({name: 'reviewScore', title: 'Review score', type: 'string', description: 'e.g. 5.0'}),
    defineField({name: 'reviewCount', title: 'Review count', type: 'number'}),
    defineField({name: 'reviewSource', title: 'Review source', type: 'string', initialValue: 'iWantGreatCare'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
