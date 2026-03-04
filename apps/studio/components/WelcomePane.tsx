import {Card, Flex, Heading, Stack, Text} from '@sanity/ui'

export function WelcomePane() {
  return (
    <Card flex={1} padding={5} sizing="border">
      <Flex align="center" justify="center" height="fill">
        <Stack space={4}>
          <Heading size={3} align="center">
            Welcome to the Studio
          </Heading>
          <Text size={2} align="center" muted>
            Select a document type from the sidebar to get started.
          </Text>
        </Stack>
      </Flex>
    </Card>
  )
}
