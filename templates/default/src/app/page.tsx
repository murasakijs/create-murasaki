// src/app/page.tsx — the "/" route.
//
// Demonstrates the hooks shipped with murasaki/jsx/dom:
//   useState        — client state
//   useNotification — OS notification banner
//   useClipboard    — system clipboard r/w
//   useShell        — open URL in default browser
//   useDialog + useFs — native file picker + filesystem
//   useWindow       — window control (minimize, title, size, ...)

import { Link } from 'murasaki'
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

      <div className="actions">
        <button onClick={() => win.minimize()}>🟡 Minimize</button>
        <button onClick={() => win.toggleMaximize()}>🟢 Toggle max</button>
        <button onClick={() => win.setTitle(`Murasaki — count ${count}`)}>
          🪟 Title = count
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
