import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {blankSpacePlugin} from 'sanity-plugin-blank-space'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Blank Space Dev',
  projectId: 'i2zyueht',
  dataset: 'production',
  plugins: [structureTool(), visionTool(), blankSpacePlugin()],
  schema: {
    types: schemaTypes,
  },
})
