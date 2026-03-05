import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {structureHomeLandingPlugin} from 'sanity-plugin-blank-space'
import {WelcomePane} from './components/WelcomePane'
import {UserGreetingPane} from './components/UserGreetingPane'
import {PopularTypesPane} from './components/PopularTypesPane'
import {BlankSpacePane} from './components/BlankSpacePane'
import {schemaTypes, taylorSwiftSchemaTypes} from './schemaTypes'

const sharedConfig = {
  projectId: 'i2zyueht',
  dataset: 'production',
  schema: {
    types: schemaTypes,
  },
  releases: {enabled: false},
  scheduledDrafts: {enabled: false},
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
  defineConfig({
    ...sharedConfig,
    name: 'popular',
    title: 'Popular Types',
    basePath: '/popular',
    plugins: [
      structureTool(),
      structureHomeLandingPlugin({component: PopularTypesPane, title: 'Popular Types'}),
    ],
  }),
  defineConfig({
    ...sharedConfig,
    name: 'taylorSwift',
    title: 'Blank Space',
    basePath: '/blank-space',
    schema: {
      types: taylorSwiftSchemaTypes,
    },
    plugins: [
      structureTool(),
      structureHomeLandingPlugin({
        component: BlankSpacePane,
        title: 'Blank Space',
      }),
    ],
  }),
]
