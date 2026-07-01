# Contributing to create-murasaki

Thank you for your interest in contributing! This repo is the scaffolder
for [Murasaki](https://github.com/murasakijs/murasaki) — a small Node CLI
that generates a starter app and asks a couple of setup questions.

If you have a change in mind that belongs in the framework itself
(components, hooks, runtime, build, cross-compile), please open the
issue or PR against
[murasakijs/murasaki](https://github.com/murasakijs/murasaki) instead.

---

## Ways to contribute

- 🐛 [Reporting bugs](#reporting-issues) in the scaffolder or default template
- 💡 Suggesting template improvements
- 📖 Improving documentation
- 🌍 Adding a translated README
- 🧪 Adding examples the CLI can offer

---

## Getting set up

```bash
git clone https://github.com/murasakijs/create-murasaki.git
cd create-murasaki
pnpm install
```

There's no build step — `index.mjs` runs directly:

```bash
node index.mjs my-test-app
cd my-test-app
pnpm install
pnpm dev
```

Rinse and repeat after edits. Use a scratch directory outside the repo
for test scaffolds.

---

## Repository layout

```
create-murasaki/
├── index.mjs                Single-file CLI: prompts, ANSI banner, copy templates
├── templates/
│   └── default/             Files copied into every new project
│       ├── src/
│       ├── murasaki.config.ts
│       ├── package.json
│       └── tsconfig.json
├── README.md / README.ja.md
└── ...
```

Placeholders inside `templates/default/` (`__PROJECT_NAME__`, etc.) are
rewritten at scaffold time.

---

## Development workflow

1. **Search first** for an existing issue or PR.
2. **Open an issue** for non-trivial changes (new prompt, new template
   variant, template layout changes).
3. **Fork + branch** from `main`.
4. **Test your change** by running `node index.mjs <scratch-name>` and
   walking through the generated project.
5. **Open a PR** with a short description of the "why".

---

## Reporting issues

Before filing:

- Search [open issues](https://github.com/murasakijs/create-murasaki/issues).
- Confirm you're running the latest version.

Please include:

- The command you ran.
- Full output (paste from your terminal).
- Your Node version, package manager, OS.

---

## Template guidelines

- Keep the default template **minimal**. Anything a first-time user
  doesn't need on day one shouldn't be in it.
- Every generated file should be **readable at a glance** — this is a
  learning surface as much as a starting point.
- Match the murasaki version pin in `templates/default/package.json`
  when murasaki ships a new release.

---

## Coding style

- Plain ESM JavaScript (`.mjs`), no build step.
- No new runtime dependencies unless there's a strong reason
  (`@clack/prompts` is the current one and pulls its weight).
- Prefer built-in Node APIs (`node:fs/promises`, `node:path`, etc.).
- Keep the ANSI banner and prompts consistent with the existing style —
  the CLI is a first impression.

---

## Release process

Releases are automated by tag push on `main`. See
[murasakijs/murasaki CONTRIBUTING.md](https://github.com/murasakijs/murasaki/blob/main/CONTRIBUTING.md#release-process)
for the same OIDC-based flow. Maintainers only.

---

## Getting help

- 💬 [Discussions on the main repo](https://github.com/murasakijs/murasaki/discussions)
- 🐛 [Issues here](https://github.com/murasakijs/create-murasaki/issues)
- 📧 murasaki@ichi10.com

By contributing, you agree that your contributions will be licensed under
the [MIT License](./LICENSE).
