import {Card, Flex} from '@sanity/ui'
import {type CSSProperties} from 'react'

const baseStyle: CSSProperties = {
  display: 'inline',
  lineHeight: 1.6,
}

const cursiveStyle: CSSProperties = {
  ...baseStyle,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 600,
  letterSpacing: '0.02em',
  fontSize: 32,
}

const blankSpaceStyle: CSSProperties = {
  ...baseStyle,
  fontFamily: 'system-ui, sans-serif',
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: 56,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  background: 'linear-gradient(135deg, #f43f5e, #8b5cf6, #3b82f6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

const babyStyle: CSSProperties = {
  ...baseStyle,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '0.04em',
  fontSize: 14,
  color: 'var(--card-muted-fg-color)',
  verticalAlign: 'super',
}

const typewriterStyle: CSSProperties = {
  ...baseStyle,
  fontFamily: '"Courier New", Courier, monospace',
  fontWeight: 600,
  letterSpacing: '0.05em',
  fontSize: 24,
  whiteSpace: 'nowrap',
}

const anythingStyle: CSSProperties = {
  ...baseStyle,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontWeight: 800,
  fontStyle: 'italic',
  letterSpacing: '0.04em',
  fontSize: 48,
  whiteSpace: 'nowrap',
  background: 'linear-gradient(135deg, #f59e0b, #f43f5e, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

export function BlankSpacePane() {
  return (
    <Card flex={1} padding={5} sizing="border">
      <Flex align="center" justify="center" height="fill">
        <p
          style={{
            maxWidth: 680,
            textAlign: 'center',
            margin: 0,
            lineHeight: 2.2,
          }}
        >
          <span style={cursiveStyle}>Sanity&rsquo;s got a </span>
          <span style={blankSpaceStyle}>blank space </span>
          <span style={babyStyle}>(baby) </span>
          <span style={typewriterStyle}>but now you can write... </span>
          <span style={anythingStyle}>anything &#10024;</span>
        </p>
      </Flex>
    </Card>
  )
}
