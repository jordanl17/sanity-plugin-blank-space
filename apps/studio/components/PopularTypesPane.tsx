import {type ReactNode} from 'react'
import {AddIcon} from '@sanity/icons'
import {Badge, Button, Card, Flex, Heading, Spinner, Stack, Text} from '@sanity/ui'
import {useIntentLink} from 'sanity/router'
import {usePopularDocumentTypes} from 'sanity-plugin-blank-space'

function CenteredPane({children}: {children: ReactNode}) {
  return (
    <Card flex={1} padding={5} sizing="border">
      <Flex align="center" justify="center" height="fill">
        {children}
      </Flex>
    </Card>
  )
}

function DocumentTypeCard({
  documentType,
}: {
  documentType: ReturnType<typeof usePopularDocumentTypes>['data'][number]
}) {
  const {onClick, href} = useIntentLink({intent: 'create', params: {type: documentType.name}})

  return (
    <Card padding={3} radius={2} border>
      <Flex align="center" gap={3}>
        {documentType.icon && (
          <Text size={2}>
            <documentType.icon />
          </Text>
        )}
        <Stack space={2} flex={1}>
          <Text size={2} weight="semibold">
            {documentType.title}
          </Text>
        </Stack>
        <Badge tone="primary">{documentType.documentCount}</Badge>
        <Button
          as="a"
          href={href}
          onClick={onClick}
          icon={AddIcon}
          mode="ghost"
          padding={2}
          tone="primary"
        />
      </Flex>
    </Card>
  )
}

export function PopularTypesPane() {
  const {data, isLoading, error} = usePopularDocumentTypes()

  if (isLoading) {
    return (
      <CenteredPane>
        <Spinner muted />
      </CenteredPane>
    )
  }

  if (error) {
    return (
      <CenteredPane>
        <Stack space={4}>
          <Heading size={3} align="center">
            Something went wrong
          </Heading>
          <Text size={2} align="center" muted>
            {error.message}
          </Text>
        </Stack>
      </CenteredPane>
    )
  }

  return (
    <Card flex={1} padding={5} sizing="border">
      <Stack space={5}>
        <Heading size={3}>Popular Document Types</Heading>
        <Stack space={3}>
          {data.map((documentType) => (
            <DocumentTypeCard key={documentType.name} documentType={documentType} />
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
