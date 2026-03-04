import {definePlugin} from 'sanity'

import type {BlankSpacePluginConfig} from './types'

/** @public */
export const blankSpacePlugin = definePlugin<BlankSpacePluginConfig | void>((_config) => {
  return {
    name: 'sanity-plugin-blank-space',
  }
})
