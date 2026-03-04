import {Card, Flex, Heading, Stack, Text} from '@sanity/ui'
import {useCurrentUser} from 'sanity'

export function UserGreetingPane() {
  const currentUser = useCurrentUser()
  const greeting = currentUser?.name ? `Hello, ${currentUser.name}` : 'Hello!'

  return (
    <Card flex={1} padding={5} sizing="border">
      <Flex align="center" justify="center" height="fill">
        <Stack space={4}>
          <Heading size={3} align="center">
            {greeting}
          </Heading>
          <Text size={2} align="center" muted>
            Select a document type from the sidebar to get started.
          </Text>
        </Stack>
      </Flex>
    </Card>
  )
}
