// src/app/page.tsx — the "/" route.
//
// Demonstrates hooks from murasaki/jsx/dom:
//   useState         — re-render on state change
//   useNotification  — OS notification banner
//   useClipboard     — read/write system clipboard
//   useShell         — open URL in default browser
//   useDialog + useFs — file picker + read

import { Link } from 'murasaki'
import {
  useClipboard,
  useDialog,
  useFs,
  useNotification,
  useShell,
  useState,
} from 'murasaki/jsx/dom'

export default function HomePage() {
  const [count, setCount] = useState(0)
  const [filePath, setFilePath] = useState('')

  const notify = useNotification()
  const clipboard = useClipboard()
  const shell = useShell()
  const dialog = useDialog()
  const fs = useFs()

  async function pickFile() {
    const paths = await dialog.openFile({ title: 'Pick a file' })
    if (paths.length === 0) return
    setFilePath(paths[0])
    const text = await fs.readFile(paths[0])
    notify({ title: 'File loaded', body: `${text.length} chars from ${paths[0]}` })
  }

  return (
    <main>
      <h1>Hello, Murasaki 🦋</h1>
      <p>
        This view lives in <code>src/app/page.tsx</code>.
      </p>

      <div className="counter">
        <button onClick={() => setCount(count - 1)} aria-label="decrement">
          −
        </button>
        <strong>{count}</strong>
        <button onClick={() => setCount(count + 1)} aria-label="increment">
          +
        </button>
      </div>

      <div className="actions">
        <button onClick={() => notify({ title: 'Hello', body: `Count: ${count}` })}>
          🔔 Notify
        </button>
        <button onClick={() => clipboard.write(`Count: ${count}`)}>📋 Copy</button>
        <button onClick={pickFile}>📂 Pick file</button>
        <button onClick={() => shell.openExternal('https://github.com/murasakijs/murasaki')}>
          🔗 Repo
        </button>
      </div>

      {filePath && (
        <p className="hint">
          Last picked: <code>{filePath}</code>
        </p>
      )}

      <nav className="links">
        <Link href="/about">About →</Link>
      </nav>
    </main>
  )
}
