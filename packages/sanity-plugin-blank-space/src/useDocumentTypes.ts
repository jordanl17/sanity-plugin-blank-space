import {type ComponentType, useMemo} from 'react'
import {isDocumentSchemaType, useSchema} from 'sanity'

/** Simplified representation of a Sanity document type from the schema. @public */
export interface DocumentTypeInfo {
  name: string
  title: string
  icon?: ComponentType
}

/**
 * Returns the user-defined document types from the Studio schema,
 * excluding internal Sanity types (`sanity.*` prefix).
 * @public
 */
export function useDocumentTypes(): DocumentTypeInfo[] {
  const schema = useSchema()

  return useMemo(() => {
    return schema.getTypeNames().reduce<DocumentTypeInfo[]>((result, typeName) => {
      const schemaType = schema.get(typeName)
      if (schemaType && isDocumentSchemaType(schemaType) && !typeName.startsWith('sanity.')) {
        result.push({
          name: schemaType.name,
          title: schemaType.title ?? schemaType.name,
          icon: schemaType.icon,
        })
      }
      return result
    }, [])
  }, [schema])
}
