<div align="center">

<img src="./assets/logo.svg" alt="create-murasaki — scaffolder for Murasaki apps" width="720">

**Scaffolder for [Murasaki](https://github.com/murasakijs/murasaki)** — the
Next.js-inspired desktop framework for TypeScript / Node.js.

[![npm version](https://img.shields.io/npm/v/create-murasaki?color=A855F7&label=npm)](https://www.npmjs.com/package/create-murasaki)
[![npm downloads](https://img.shields.io/npm/dm/create-murasaki?color=A855F7)](https://www.npmjs.com/package/create-murasaki)
[![license](https://img.shields.io/npm/l/create-murasaki?color=A855F7)](./LICENSE)

[English](./README.md) · [日本語](./README.ja.md)

</div>

---

## Usage

```bash
# interactive (project name + linter prompt)
pnpm create murasaki@latest

# non-interactive
pnpm create murasaki@latest my-app --linter biome
npm  create murasaki@latest my-app --linter none
yarn create murasaki       my-app --linter eslint
bunx  create-murasaki      my-app
```

Then:

```bash
cd my-app
pnpm dev        # HMR-enabled dev window
pnpm build      # dist/server.cjs
pnpm bundle     # dist/<App>.app (or OS folder)
pnpm installer  # dist/<App>-<ver>.dmg (or .msi / .AppImage / .zip)
```

## What you get

```
my-app/
├── src/
│   ├── app/
│   │   ├── page.tsx        first route (/)
│   │   ├── layout.tsx      root layout (metadata, ThemeProvider, ToastProvider)
│   │   └── globals.css     theme tokens + resets
│   └── ...
├── murasaki.config.ts      typed build config (name, bundleId, icon, targets)
├── package.json            with dev / build / bundle / installer scripts
└── tsconfig.json
```

## Options

| Flag                      | Values                        | Default          |
| ------------------------- | ----------------------------- | ---------------- |
| `<project-name>`          | Any valid npm package name    | Prompted         |
| `--linter <name>`         | `biome`, `eslint`, `none`     | Prompted (Biome recommended) |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

See [SECURITY.md](./SECURITY.md).

## License

MIT © ichi — see [LICENSE](./LICENSE).
