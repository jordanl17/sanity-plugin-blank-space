import {type ReactNode, useEffect} from 'react'
import {useRouter, useRouterState} from 'sanity/router'

/**
 * Detects when the structure tool has no panes selected (empty right-hand area)
 * and auto-navigates to the configured pane. This component is rendered
 * inside the tool's RouteScope, so useRouter/useRouterState are tool-scoped.
 */
export function StructureHomeRedirector({
  children,
  toolName,
  paneId,
}: {
  children: ReactNode
  toolName: string
  paneId: string
}) {
  const {navigate} = useRouter()
  const routerState = useRouterState()

  const panes = routerState?.panes as Array<Array<{id: string}>> | undefined
  const hasPanes = panes && panes.length > 0
  const isStructureTool = toolName === 'structure'
  const isResolvingIntent = typeof routerState?.intent === 'string'

  useEffect(() => {
    if (isStructureTool && !hasPanes && !isResolvingIntent) {
      navigate({panes: [[{id: paneId}]]}, {replace: true})
    }
  }, [isStructureTool, hasPanes, isResolvingIntent, navigate, paneId])

  return <>{children}</>
}
