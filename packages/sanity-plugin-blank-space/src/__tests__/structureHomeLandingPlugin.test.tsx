import {render} from '@testing-library/react'
import type React from 'react'
import {type ActiveToolLayoutProps} from 'sanity'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import {structureHomeLandingPlugin} from '../structureHomeLandingPlugin'

vi.mock('sanity/router', () => ({
  useRouter: () => ({navigate: vi.fn()}),
  useRouterState: () => ({panes: [[{id: 'existing'}]]}),
}))

function TestComponent() {
  return null
}

function createMockProps(
  toolName: string,
  toolOptions: Record<string, unknown> = {},
): ActiveToolLayoutProps {
  const renderDefault = vi.fn(() => <div data-testid="default-render" />)

  return {
    renderDefault,
    activeTool: {
      name: toolName,
      title: toolName,
      component: () => null,
      options: toolOptions,
    },
  } as unknown as ActiveToolLayoutProps
}

function getPassedProps(props: ActiveToolLayoutProps): ActiveToolLayoutProps {
  return (props.renderDefault as ReturnType<typeof vi.fn>).mock.calls[0][0] as ActiveToolLayoutProps
}

describe('ActiveToolLayoutWithHomeLanding', () => {
  let ActiveToolLayout: (props: ActiveToolLayoutProps) => React.JSX.Element

  beforeEach(() => {
    const plugin = structureHomeLandingPlugin({component: TestComponent})
    ActiveToolLayout = plugin.studio!.components!.activeToolLayout as typeof ActiveToolLayout
  })

  it('wraps the structure resolver and passes modified tool to renderDefault', () => {
    const props = createMockProps('structure')

    render(<ActiveToolLayout {...props} />)

    expect(props.renderDefault).toHaveBeenCalledTimes(1)
    expect(typeof getPassedProps(props).activeTool.options.structure).toBe('function')
  })

  it('preserves the original tool for non-structure tools', () => {
    const props = createMockProps('vision', {someOption: true})

    render(<ActiveToolLayout {...props} />)

    expect(props.renderDefault).toHaveBeenCalledTimes(1)
    expect(getPassedProps(props).activeTool.options).toEqual({someOption: true})
  })

  it('wraps an existing structure resolver', () => {
    const originalResolver = vi.fn()
    const props = createMockProps('structure', {structure: originalResolver})

    render(<ActiveToolLayout {...props} />)

    const wrappedResolver = getPassedProps(props).activeTool.options.structure
    expect(typeof wrappedResolver).toBe('function')
    expect(wrappedResolver).not.toBe(originalResolver)
  })
})
