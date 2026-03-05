import {defineType, defineField} from 'sanity'

export const loveStory = defineType({
  name: 'loveStory',
  title: 'Love Story',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'lyrics',
      title: 'Lyrics',
      type: 'text',
    }),
  ],
})

export const shakeItOff = defineType({
  name: 'shakeItOff',
  title: 'Shake It Off',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'vibe',
      title: 'Vibe',
      type: 'string',
    }),
  ],
})

export const cruelSummer = defineType({
  name: 'cruelSummer',
  title: 'Cruel Summer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'mood',
      title: 'Mood',
      type: 'string',
    }),
  ],
})

export const antiHero = defineType({
  name: 'antiHero',
  title: 'Anti-Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'confession',
      title: 'Confession',
      type: 'text',
    }),
  ],
})

export const allTooWell = defineType({
  name: 'allTooWell',
  title: 'All Too Well',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'memory',
      title: 'Memory',
      type: 'text',
    }),
  ],
})

export const taylorSwiftTypes = [loveStory, shakeItOff, cruelSummer, antiHero, allTooWell]
