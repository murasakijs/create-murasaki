// src/app/page.tsx — the "/" route.
// Mix of Murasaki components and plain HTML — both coexist.

import {
  Button,
  Card,
  Checkbox,
  Input,
  Link,
  Row,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  View,
} from 'murasaki'
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
  const [tab, setTab] = useState('counter')
  const [count, setCount] = useState(0)
  const [name, setName] = useState('world')
  const [sound, setSound] = useState(true)
  const [agree, setAgree] = useState(false)
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
    notify({
      title: 'File loaded',
      body: `${text.length} chars from ${paths[0]}`,
      sound,
    })
  }

  return (
    <View style={{ height: '100vh' }}>
      <Stack grow gap={20} padding={32} align="center" justify="center">
        <Stack gap={8} align="center">
          <Text as="h1" size={56} weight="bold" style={{ margin: 0 }}>
            Hello, {name} 🦋
          </Text>
          <Text color="#888">
            Edit <code>src/app/page.tsx</code> — the window reloads instantly.
          </Text>
        </Stack>

        <Tabs value={tab} onChange={setTab} style={{ width: '100%', maxWidth: '520px' }}>
          <TabList>
            <Tab value="counter" active={tab === 'counter'} onClick={() => setTab('counter')}>
              Counter
            </Tab>
            <Tab value="form" active={tab === 'form'} onClick={() => setTab('form')}>
              Form
            </Tab>
            <Tab value="native" active={tab === 'native'} onClick={() => setTab('native')}>
              Native
            </Tab>
          </TabList>

          <TabPanel value="counter" active={tab}>
            <Card>
              <Row gap={12} align="center" justify="center">
                <Button variant="secondary" onClick={() => setCount(count - 1)}>
                  −
                </Button>
                <Text size={28} weight="bold" style={{ minWidth: '64px', textAlign: 'center' }}>
                  {count}
                </Text>
                <Button onClick={() => setCount(count + 1)}>+</Button>
              </Row>
            </Card>
          </TabPanel>

          <TabPanel value="form" active={tab}>
            <Card>
              <Stack gap={14}>
                <Stack gap={4}>
                  <Text size={12} weight="medium" color="#888">
                    Name
                  </Text>
                  <Input
                    value={name}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                  />
                </Stack>
                <Switch checked={sound} onChange={setSound} label="Play sound on notify" />
                <Checkbox checked={agree} onChange={setAgree} label="I read the README" />
              </Stack>
            </Card>
          </TabPanel>

          <TabPanel value="native" active={tab}>
            <Card>
              <Row gap={8} wrap justify="center">
                <Button onClick={() => notify({ title: 'Hello', body: `${name}: ${count}`, sound })}>
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
                <Text size={12} color="#888" style={{ marginTop: '12px' }}>
                  Last picked: <code>{filePath}</code>
                </Text>
              )}
            </Card>
          </TabPanel>
        </Tabs>

        <nav>
          <Link href="/about">About →</Link>
        </nav>
      </Stack>
    </View>
  )
}
