<div align="center">

# create-murasaki

Scaffolder for [Murasaki](https://github.com/murasakijs/murasaki) — the
Next.js-inspired desktop framework for TypeScript / Node.js.

[![npm version](https://img.shields.io/npm/v/create-murasaki?color=A855F7&label=npm)](https://www.npmjs.com/package/create-murasaki)

</div>

## Usage

```bash
pnpm create murasaki@latest        # interactive
# or
pnpm create murasaki@latest my-app --linter biome
# or
npm create murasaki@latest my-app
```

You'll be asked:

- **Project name** (defaults to `my-app`)
- **Linter** — `biome` (recommended) / `eslint` / `none`

The CLI then:

1. Copies the default template into `<project>/`
2. Patches `package.json` with the chosen name
3. (Optional) adds Biome or ESLint config + devDeps
4. Runs `pnpm install` / `npm install` / `yarn install` (auto-detected from
   the `npm_config_user_agent`). Pass `--skip-install` to opt out.
5. Prints next steps: `cd <project> && pnpm dev`

## What you get

```
my-app/
├── package.json          # pinned to murasaki ^0.x
├── tsconfig.json         # jsxImportSource: "murasaki", strict, Bundler resolution
├── biome.json            # (if biome chosen)
└── src/
    └── app/
        ├── layout.tsx    # root layout, metadata, ThemeProvider
        ├── page.tsx      # home — TitleBar + Tabs (Counter / Form / Native)
        ├── about/
        │   └── page.tsx  # /about route
        └── globals.css   # global styles
```

Right after `pnpm dev` you get a working window with:

- a 3-tab home (Counter, Form, Native APIs) using **Murasaki components**
- live **HMR** on file save (no flash)
- **system theme** following (light / dark)
- 9 **native hooks** ready to use (notification / clipboard / fs / dialog / shell / window)

## Flags

| Flag | Effect |
| --- | --- |
| `<name>` (positional) | Project directory name. If omitted, prompts. |
| `--linter biome\|eslint\|none` | Skip the linter prompt. |
| `--skip-install` | Don't run install after copy. |

## License

MIT
