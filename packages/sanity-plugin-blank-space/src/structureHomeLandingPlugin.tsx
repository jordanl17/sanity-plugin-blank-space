import {useMemo} from 'react'
import {type ActiveToolLayoutProps, definePlugin} from 'sanity'
import type {StructureResolver} from 'sanity/structure'

import {
  createWrappedResolver,
  DEFAULT_HOME_PANE_ID,
  DEFAULT_HOME_PANE_TITLE,
} from './createWrappedResolver'
import {StructureHomeRedirector} from './StructureHomeRedirector'
import type {StructureHomeLandingPluginOptions} from './types'

/** @public */
export const structureHomeLandingPlugin = definePlugin<StructureHomeLandingPluginOptions>(
  (options) => {
    const {component: HomeComponent, paneId: configuredPaneId, title: configuredTitle} = options
    const resolvedPaneId = configuredPaneId ?? DEFAULT_HOME_PANE_ID
    const resolvedTitle = configuredTitle ?? DEFAULT_HOME_PANE_TITLE

    function ActiveToolLayoutWithHomeLanding(props: ActiveToolLayoutProps) {
      const {renderDefault, activeTool} = props
      const isStructureTool = activeTool.name === 'structure'

      const originalResolver = isStructureTool
        ? (activeTool.options as {structure?: StructureResolver} | undefined)?.structure
        : undefined

      const wrappedResolver = useMemo(
        () =>
          isStructureTool
            ? createWrappedResolver(originalResolver, HomeComponent, resolvedPaneId, resolvedTitle)
            : undefined,
        [originalResolver, isStructureTool],
      )

      const modifiedTool = useMemo(() => {
        if (!wrappedResolver) return activeTool

        return {
          ...activeTool,
          options: {
            ...activeTool.options,
            structure: wrappedResolver,
          },
        }
      }, [activeTool, wrappedResolver])

      return (
        <StructureHomeRedirector toolName={activeTool.name} paneId={resolvedPaneId}>
          {renderDefault({...props, activeTool: modifiedTool})}
        </StructureHomeRedirector>
      )
    }

    return {
      name: 'structure-home-landing',
      studio: {
        components: {
          activeToolLayout: ActiveToolLayoutWithHomeLanding,
        },
      },
    }
  },
)
