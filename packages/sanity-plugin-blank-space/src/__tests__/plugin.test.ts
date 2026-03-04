import {describe, expect, it} from 'vitest'

import {blankSpacePlugin} from '../index'

describe('blankSpacePlugin', () => {
  it('should return a plugin definition', () => {
    const plugin = blankSpacePlugin()
    expect(plugin.name).toBe('sanity-plugin-blank-space')
  })
})
