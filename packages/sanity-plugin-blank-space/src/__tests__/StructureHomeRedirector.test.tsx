import {render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import {StructureHomeRedirector} from '../StructureHomeRedirector'

const mockNavigate = vi.fn()
const mockRouterState: Record<string, unknown> = {}

vi.mock('sanity/router', () => ({
  useRouter: () => ({navigate: mockNavigate}),
  useRouterState: () => mockRouterState,
}))

function setRouterState(state: Record<string, unknown>) {
  Object.keys(mockRouterState).forEach((key) => {
    delete mockRouterState[key]
  })
  Object.assign(mockRouterState, state)
}

describe('StructureHomeRedirector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setRouterState({})
  })

  it('navigates to default home pane when no panes are present on structure tool', () => {
    setRouterState({panes: undefined, intent: undefined})

    render(
      <StructureHomeRedirector toolName="structure" paneId="__home__">
        <div>child content</div>
      </StructureHomeRedirector>,
    )

    expect(mockNavigate).toHaveBeenCalledWith({panes: [[{id: '__home__'}]]}, {replace: true})
  })

  it('navigates to custom pane ID when configured', () => {
    setRouterState({panes: undefined, intent: undefined})

    render(
      <StructureHomeRedirector toolName="structure" paneId="custom-dashboard">
        <div>child content</div>
      </StructureHomeRedirector>,
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      {panes: [[{id: 'custom-dashboard'}]]},
      {replace: true},
    )
  })

  it('skips navigation when panes are present', () => {
    setRouterState({panes: [[{id: 'some-doc'}]], intent: undefined})

    render(
      <StructureHomeRedirector toolName="structure" paneId="__home__">
        <div>child content</div>
      </StructureHomeRedirector>,
    )

    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })

  it('skips navigation during intent resolution', () => {
    setRouterState({panes: undefined, intent: 'edit'})

    render(
      <StructureHomeRedirector toolName="structure" paneId="__home__">
        <div>child content</div>
      </StructureHomeRedirector>,
    )

    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })

  it('skips navigation for non-structure tools', () => {
    setRouterState({panes: undefined, intent: undefined})

    render(
      <StructureHomeRedirector toolName="vision" paneId="__home__">
        <div>child content</div>
      </StructureHomeRedirector>,
    )

    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })

  it('renders children', () => {
    setRouterState({panes: [[{id: 'some-doc'}]]})

    render(
      <StructureHomeRedirector toolName="structure" paneId="__home__">
        <div>expected child content</div>
      </StructureHomeRedirector>,
    )

    expect(screen.getByText('expected child content')).toBeDefined()
  })
})
