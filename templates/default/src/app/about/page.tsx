// src/app/about/page.tsx — the "/about" route.

import { Link } from 'murasaki'

export default function AboutPage() {
  return (
    <main>
      <h1>About 🦋</h1>
      <p>
        File-based routing: add <code>src/app/&lt;name&gt;/page.tsx</code> and
        link to it with <code>&lt;Link href=&quot;/&lt;name&gt;&quot; /&gt;</code>.
      </p>
      <nav className="links">
        <Link href="/">← Back home</Link>
      </nav>
    </main>
  )
}
