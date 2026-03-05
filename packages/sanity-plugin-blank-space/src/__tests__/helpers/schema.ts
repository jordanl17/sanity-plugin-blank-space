interface MockSchemaTypeOverrides {
  name: string
  title: string
  icon: () => null
  type: {name: string}
}

export interface MockSchemaType {
  name: string
  title: string | undefined
  icon: (() => null) | undefined
  type: {name: string}
  jsonType: string
}

export function createMockSchemaType(
  overrides: Partial<MockSchemaTypeOverrides> = {},
): MockSchemaType {
  return {
    name: overrides.name ?? 'untitled',
    title: overrides.title,
    icon: overrides.icon,
    type: overrides.type ?? {name: 'document'},
    jsonType: 'object',
  }
}

export interface MockSchema {
  getTypeNames: () => string[]
  get: (name: string) => MockSchemaType | undefined
}

export function createMockSchema(types: MockSchemaType[]): MockSchema {
  const typeMap = new Map(types.map((schemaType) => [schemaType.name, schemaType]))
  return {
    getTypeNames: () => Array.from(typeMap.keys()),
    get: (name: string) => typeMap.get(name),
  }
}
