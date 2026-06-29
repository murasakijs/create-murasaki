// src/app/page.tsx — the "/" route.
// Mixes Murasaki components with plain HTML — both coexist.

import { Button, Card, Input, Link, Row, Stack, Text, TitleBar, View } from 'murasaki'
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
  const [name, setName] = useState('world')
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

      <Stack grow gap={24} padding={40} align="center" justify="center">
        <Text as="h1" size={56} weight="bold" style={{ margin: 0 }}>
          Hello, {name} 🦋
        </Text>
        <Text color="#888">
          Edit <code>src/app/page.tsx</code> — the window reloads instantly.
        </Text>

        <Card padding={20} style={{ minWidth: '360px' }}>
          <Stack gap={12}>
            <Stack gap={4}>
              <Text size={12} weight="medium" color="#666">
                Name
              </Text>
              <Input
                value={name}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
              />
            </Stack>
            <Row gap={12} align="center" justify="center">
              <Button variant="secondary" onClick={() => setCount(count - 1)}>
                −
              </Button>
              <Text size={24} weight="bold" style={{ minWidth: '56px', textAlign: 'center' }}>
                {count}
              </Text>
              <Button onClick={() => setCount(count + 1)}>+</Button>
            </Row>
          </Stack>
        </Card>

        <Row gap={8} wrap justify="center">
          <Button onClick={() => notify({ title: 'Hello', body: `${name}, count = ${count}` })}>
            🔔 Notify
          </Button>
          <Button variant="secondary" onClick={() => clipboard.write(name)}>
            📋 Copy
          </Button>
          <Button variant="secondary" onClick={pickFile}>
            📂 Pick file
          </Button>
          <Button variant="ghost" onClick={() => win.toggleMaximize()}>
            🟢 Toggle max
          </Button>
          <Button
            variant="ghost"
            onClick={() => shell.openExternal('https://github.com/murasakijs/murasaki')}
          >
            🔗 Repo
          </Button>
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
