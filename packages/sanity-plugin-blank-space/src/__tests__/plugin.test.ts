import {describe, expect, it} from 'vitest'

import {structureHomeLandingPlugin} from '../index'

function TestComponent() {
  return null
}

describe('structureHomeLandingPlugin', () => {
  it('should return the correct plugin name', () => {
    const plugin = structureHomeLandingPlugin({component: TestComponent})
    expect(plugin.name).toBe('structure-home-landing')
  })

  it('should register an activeToolLayout component in studio.components', () => {
    const plugin = structureHomeLandingPlugin({component: TestComponent})
    expect(plugin.studio?.components?.activeToolLayout).toBeDefined()
    expect(typeof plugin.studio?.components?.activeToolLayout).toBe('function')
  })

  it('should accept optional paneId and title options', () => {
    const plugin = structureHomeLandingPlugin({
      component: TestComponent,
      paneId: 'custom-home',
      title: 'Dashboard',
    })
    expect(plugin.name).toBe('structure-home-landing')
    expect(plugin.studio?.components?.activeToolLayout).toBeDefined()
  })
})
