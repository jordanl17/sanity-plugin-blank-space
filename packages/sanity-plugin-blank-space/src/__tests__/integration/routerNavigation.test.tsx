/**
 * Integration test for StructureHomeRedirector using the real RouterProvider
 * and route factory from sanity/router, rather than mocked hooks.
 *
 * Limitation: The real router encodes state to a URL path via router.encode(),
 * but the structure tool's `panes` key uses internal transforms we cannot
 * reproduce here. The "navigates on empty panes" test therefore asserts that
 * navigation was attempted by catching the expected encoding error.
 */
import {render, screen} from '@testing-library/react'
import {Component, type ReactNode} from 'react'
import {route, RouterProvider} from 'sanity/router'
import {describe, expect, it, vi} from 'vitest'

import {StructureHomeRedirector} from '../../StructureHomeRedirector'

interface ErrorBoundaryProps {
  children: ReactNode
  onError: (error: Error) => void
}

class ErrorBoundary extends Component<ErrorBoundaryProps, {hasError: boolean}> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(): {hasError: boolean} {
    return {hasError: true}
  }

  componentDidCatch(error: Error): void {
    this.props.onError(error)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

function createRouterWrapper(
  state: Record<string, unknown>,
  onNavigate: (opts: {path: string; replace?: boolean}) => void,
) {
  const router = route.create({path: '/'})

  return function RouterWrapper({children}: {children: ReactNode}) {
    return (
      <RouterProvider router={router} state={state} onNavigate={onNavigate}>
        {children}
      </RouterProvider>
    )
  }
}

describe('StructureHomeRedirector with real RouterProvider (integration)', () => {
  it('attempts navigation when structure tool has no panes selected', () => {
    const onNavigate = vi.fn()
    const router = route.create({path: '/'})
    const capturedErrors: Error[] = []

    render(
      <RouterProvider
        router={router}
        state={{panes: undefined, intent: undefined}}
        onNavigate={onNavigate}
      >
        <ErrorBoundary onError={(error) => capturedErrors.push(error)}>
          <StructureHomeRedirector toolName="structure" paneId="__home__">
            <div>child content</div>
          </StructureHomeRedirector>
        </ErrorBoundary>
      </RouterProvider>,
    )

    // Our minimal route definition cannot encode the `panes` key, so the
    // navigation attempt throws - confirming the component detected empty
    // panes and called navigate.
    expect(capturedErrors.length).toBeGreaterThan(0)
    expect(capturedErrors[0].message).toContain('panes')
  })

  it('renders children without navigating when panes are present', () => {
    const onNavigate = vi.fn()
    const wrapper = createRouterWrapper(
      {panes: [[{id: 'some-doc'}]], intent: undefined},
      onNavigate,
    )

    render(
      <StructureHomeRedirector toolName="structure" paneId="__home__">
        <div>visible child</div>
      </StructureHomeRedirector>,
      {wrapper},
    )

    expect(screen.getByText('visible child')).toBeDefined()
    expect(onNavigate).toHaveBeenCalledTimes(0)
  })

  it('does not navigate during intent resolution', () => {
    const onNavigate = vi.fn()
    const wrapper = createRouterWrapper({panes: undefined, intent: 'edit'}, onNavigate)

    render(
      <StructureHomeRedirector toolName="structure" paneId="__home__">
        <div>intent content</div>
      </StructureHomeRedirector>,
      {wrapper},
    )

    expect(onNavigate).toHaveBeenCalledTimes(0)
  })

  it('does not navigate for non-structure tools', () => {
    const onNavigate = vi.fn()
    const wrapper = createRouterWrapper({panes: undefined, intent: undefined}, onNavigate)

    render(
      <StructureHomeRedirector toolName="vision" paneId="__home__">
        <div>vision content</div>
      </StructureHomeRedirector>,
      {wrapper},
    )

    expect(onNavigate).toHaveBeenCalledTimes(0)
  })
})
