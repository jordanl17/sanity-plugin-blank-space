import {defineConfig} from 'sanity'
import {describe, expect, it} from 'vitest'

import {structureHomeLandingPlugin} from '../../index'

function TestComponent() {
  return null
}

interface PluginEntry {
  name: string
  studio?: {components?: {activeToolLayout?: unknown}}
}

function getPlugins(...pluginArgs: Parameters<typeof structureHomeLandingPlugin>): PluginEntry[] {
  const config = defineConfig({
    name: 'test',
    projectId: 'test-project',
    dataset: 'test-dataset',
    plugins: [structureHomeLandingPlugin(...pluginArgs)],
  })

  const workspace = Array.isArray(config) ? config[0] : config
  return workspace.plugins as PluginEntry[]
}

function findHomeLandingPlugin(
  ...pluginArgs: Parameters<typeof structureHomeLandingPlugin>
): PluginEntry | undefined {
  return getPlugins(...pluginArgs).find((plugin) => plugin.name === 'structure-home-landing')
}

describe('plugin registration (integration)', () => {
  it('registers activeToolLayout via defineConfig', () => {
    const pluginEntry = findHomeLandingPlugin({component: TestComponent})

    expect(pluginEntry).toBeDefined()
    expect(typeof pluginEntry?.studio?.components?.activeToolLayout).toBe('function')
  })

  it('works alongside other plugins in defineConfig', () => {
    const pluginNames = getPlugins({component: TestComponent}).map((plugin) => plugin.name)

    expect(pluginNames).toContain('structure-home-landing')
  })

  it('registers with custom paneId and title options via defineConfig', () => {
    const pluginEntry = findHomeLandingPlugin({
      component: TestComponent,
      paneId: 'dashboard',
      title: 'My Dashboard',
    })

    expect(pluginEntry).toBeDefined()
    expect(typeof pluginEntry?.studio?.components?.activeToolLayout).toBe('function')
  })
})
