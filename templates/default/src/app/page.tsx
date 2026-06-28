// src/app/page.tsx — the "/" route.
//
// useState comes from murasaki/jsx/dom and runs inside the WebView
// after the client bundle hydrates the SSR shell.

import { Link } from 'murasaki'
import { useState } from 'murasaki/jsx/dom'

export default function HomePage() {
  const [count, setCount] = useState(0)
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

      <p className="hint">
        Edit the file — the window reloads instantly.
      </p>

      <nav className="links">
        <Link href="/about">About →</Link>
      </nav>
    </main>
  )
}
