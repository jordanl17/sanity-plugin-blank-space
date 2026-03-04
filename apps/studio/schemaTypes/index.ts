import {defineType, defineField} from 'sanity'

const testDocument = defineType({
  name: 'testDocument',
  title: 'Test Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})

export const schemaTypes = [testDocument]
