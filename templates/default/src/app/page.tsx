// src/app/page.tsx — the "/" route.
//
// Demonstrates client-side hooks (useState) and the native bridge
// (useNotification / useClipboard / useShell) from murasaki/jsx/dom.

import { Link } from 'murasaki'
import {
  useClipboard,
  useNotification,
  useShell,
  useState,
} from 'murasaki/jsx/dom'

export default function HomePage() {
  const [count, setCount] = useState(0)
  const notify = useNotification()
  const clipboard = useClipboard()
  const shell = useShell()

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
        <button onClick={() => clipboard.write(`Count: ${count}`)}>
          📋 Copy to clipboard
        </button>
        <button onClick={() => shell.openExternal('https://github.com/murasakijs/murasaki')}>
          🔗 Open repo
        </button>
      </div>

      <p className="hint">Edit this file — the window reloads instantly.</p>

      <nav className="links">
        <Link href="/about">About →</Link>
      </nav>
    </main>
  )
}
