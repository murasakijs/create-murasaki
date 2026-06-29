// src/app/page.tsx — the "/" route.
//
// Uses Murasaki's own layout primitives (View / Row / Text) alongside
// regular HTML. <TitleBar> gives the window a draggable header.

import { Link, Row, Stack, Text, TitleBar, View } from 'murasaki'
import {
  useClipboard,
  useDialog,
  useFs,
  useNotification,
  useShell,
  useState,
  useWindow,
} from 'murasaki/jsx/dom'

export default function HomePage() {
  const [count, setCount] = useState(0)
  const [filePath, setFilePath] = useState('')

  const notify = useNotification()
  const clipboard = useClipboard()
  const shell = useShell()
  const dialog = useDialog()
  const fs = useFs()
  const win = useWindow()

  async function pickFile() {
    const paths = await dialog.openFile({ title: 'Pick a file' })
    if (paths.length === 0) return
    setFilePath(paths[0])
    const text = await fs.readFile(paths[0])
    notify({ title: 'File loaded', body: `${text.length} chars from ${paths[0]}` })
  }

  return (
    <View style={{ height: '100vh' }}>
      <TitleBar>
        <Text size={13} weight="medium">
          My Murasaki App
        </Text>
      </TitleBar>

      <Stack grow gap={20} padding={40} align="center" justify="center">
        <Text as="h1" size={64} weight="bold" style={{ margin: 0 }}>
          Hello, Murasaki 🦋
        </Text>
        <Text color="#888">
          Edit <code>src/app/page.tsx</code> — the window reloads instantly.
        </Text>

        <Row gap={12} align="center">
          <button onClick={() => setCount(count - 1)} aria-label="decrement">
            −
          </button>
          <Text size={28} weight="bold" style={{ minWidth: '48px', textAlign: 'center' }}>
            {count}
          </Text>
          <button onClick={() => setCount(count + 1)} aria-label="increment">
            +
          </button>
        </Row>

        <Row gap={8} wrap justify="center">
          <button onClick={() => notify({ title: 'Hello', body: `Count: ${count}` })}>
            🔔 Notify
          </button>
          <button onClick={() => clipboard.write(`Count: ${count}`)}>📋 Copy</button>
          <button onClick={pickFile}>📂 Pick file</button>
          <button onClick={() => win.toggleMaximize()}>🟢 Toggle max</button>
          <button onClick={() => shell.openExternal('https://github.com/murasakijs/murasaki')}>
            🔗 Repo
          </button>
        </Row>

        {filePath && (
          <Text size={12} color="#888">
            Last picked: <code>{filePath}</code>
          </Text>
        )}

        <nav>
          <Link href="/about">About →</Link>
        </nav>
      </Stack>
    </View>
  )
}
