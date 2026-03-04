import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {structureHomeLandingPlugin} from 'sanity-plugin-blank-space'
import {WelcomePane} from './components/WelcomePane'
import {UserGreetingPane} from './components/UserGreetingPane'
import {schemaTypes} from './schemaTypes'

const sharedConfig = {
  projectId: 'i2zyueht',
  dataset: 'production',
  schema: {
    types: schemaTypes,
  },
} as const

export default [
  defineConfig({
    ...sharedConfig,
    name: 'default',
    title: 'Default Home',
    basePath: '/default',
    plugins: [structureTool(), structureHomeLandingPlugin({component: WelcomePane})],
  }),
  defineConfig({
    ...sharedConfig,
    name: 'greeting',
    title: 'User Greeting',
    basePath: '/greeting',
    plugins: [
      structureTool(),
      visionTool(),
      structureHomeLandingPlugin({component: UserGreetingPane, title: 'Hello There'}),
    ],
  }),
]
