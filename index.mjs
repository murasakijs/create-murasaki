#!/usr/bin/env node
// create-murasaki — Scaffolder for Murasaki apps.
// Usage: npm create murasaki@latest my-app

import { cp, mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { spawnSync } from 'node:child_process'

// ── ANSI truecolor (Oomurasaki palette) ────────────────────────────────
const BRIGHT = '\x1b[38;2;168;85;247m'
const DEEP   = '\x1b[38;2;91;33;182m'
const CREAM  = '\x1b[38;2;250;245;232m'
const DARK   = '\x1b[38;2;59;7;100m'
const DIM    = '\x1b[38;2;136;136;153m'
const GREEN  = '\x1b[38;2;76;175;80m'
const RED    = '\x1b[38;2;239;68;68m'
const BOLD   = '\x1b[1m'
const RESET  = '\x1b[0m'

const BG_BRIGHT = '\x1b[48;2;168;85;247m'
const BG_DEEP   = '\x1b[48;2;91;33;182m'
const BG_CREAM  = '\x1b[48;2;250;245;232m'
const BG_DARK   = '\x1b[48;2;59;7;100m'

const noColor = process.env.NO_COLOR || !process.stdout.isTTY
const c = (code) => (noColor ? '' : code)

// ── H4 butterfly grid (19 col × 12 row) ────────────────────────────────
const GRID = [
  '.....b.......b.....',
  '......b.....b......',
  '...bbbb.....bbbb...',
  '..bbbbbb...bbbbbb..',
  '.bbbbcbbb.bbbcbbbb.',
  '.bbbbbbbb.bbbbbbbb.',
  '..bbbbbbb.bbbbbbb..',
  '...bbbbb...bbbbb...',
  '...................',
  '.....ddd...ddd.....',
  '....ddddd.ddddd....',
  '.....dddd.dddd.....',
]
const FG_OF = { b: BRIGHT, d: DEEP, c: CREAM, k: DARK }
const BG_OF = { b: BG_BRIGHT, d: BG_DEEP, c: BG_CREAM, k: BG_DARK }
const GRID_WIDTH = GRID[0].length

function renderButterflyLines() {
  const out = []
  for (let r = 0; r < GRID.length; r += 2) {
    const top = GRID[r] || '.'.repeat(GRID_WIDTH)
    const bot = GRID[r + 1] || '.'.repeat(GRID_WIDTH)
    let line = ''
    for (let col = 0; col < GRID_WIDTH; col++) {
      const tCh = top[col]
      const bCh = bot[col]
      const tFg = FG_OF[tCh]
      const bFg = FG_OF[bCh]
      if (!tFg && !bFg) line += ' '
      else if (tFg && !bFg) line += c(tFg) + '▀' + c(RESET)
      else if (!tFg && bFg) line += c(bFg) + '▄' + c(RESET)
      else if (tCh === bCh) line += c(tFg) + '█' + c(RESET)
      else line += c(tFg) + c(BG_OF[bCh]) + '▀' + c(RESET)
    }
    out.push(line)
  }
  return out
}

const WORDMARK_LINES = [
  '                                      _    _ ',
  ' _ __ ___  _   _ _ __ __ _ ___  __ _ | | _(_)',
  "| '_ ` _ \\| | | | '__/ _` / __|/ _` || |/ /| |",
  '| | | | | | |_| | | | (_| \\__ \\ (_| ||   < | |',
  '|_| |_| |_|\\__,_|_|  \\__,_|___/\\__,_||_|\\_\\|_|',
]

function colorize(line, color, opts = {}) {
  return (opts.bold ? c(BOLD) : '') + c(color) + line + c(RESET)
}

function renderBanner() {
  const bf = renderButterflyLines()
  const wm = WORDMARK_LINES.map((l) => colorize(l, BRIGHT, { bold: true }))
  const gap = '   '
  const total = Math.max(bf.length, wm.length)
  const wmOffset = Math.max(0, Math.floor((bf.length - wm.length) / 2))
  const blankBf = ' '.repeat(GRID_WIDTH)
  const lines = []
  for (let i = 0; i < total; i++) {
    const bfLine = bf[i] !== undefined ? bf[i] : blankBf
    const wmIdx = i - wmOffset
    const wmLine = (wmIdx >= 0 && wmIdx < wm.length) ? wm[wmIdx] : ''
    lines.push('  ' + bfLine + gap + wmLine)
  }
  return lines.join('\n')
}

// ── Output helpers ─────────────────────────────────────────────────────
const log = (s) => process.stdout.write(s + '\n')

// ── Validation ─────────────────────────────────────────────────────────
function isValidPackageName(name) {
  // Basic npm package name rules
  return /^[a-z0-9][a-z0-9._-]*$/.test(name)
}

// ── Package manager detection ─────────────────────────────────────────
function detectPackageManager() {
  const ua = process.env.npm_config_user_agent || ''
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('yarn')) return 'yarn'
  if (ua.startsWith('bun'))  return 'bun'
  return 'npm'
}

function installArgs(pm) {
  // pnpm respects parent workspace by default; --ignore-workspace makes the
  // new app's install self-contained even when scaffolded inside a workspace.
  if (pm === 'pnpm') return ['install', '--ignore-workspace']
  return ['install']
}

function runInstall(targetDir, pm) {
  const result = spawnSync(pm, installArgs(pm), {
    cwd: targetDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  return result.status === 0
}

async function promptForName() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(`  ${c(DEEP)}?${c(RESET)} ${c(BOLD)}Project name${c(RESET)} ${c(DIM)}(my-app):${c(RESET)} `)
  rl.close()
  return answer.trim() || 'my-app'
}

async function promptForLinter() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(`  ${c(DEEP)}?${c(RESET)} ${c(BOLD)}Linter${c(RESET)} ${c(DIM)}(biome / eslint / none) [biome]:${c(RESET)} `)
  rl.close()
  const v = answer.trim().toLowerCase()
  if (v === 'eslint' || v === 'e') return 'eslint'
  if (v === 'none'   || v === 'n') return 'none'
  return 'biome'  // default
}

// ── Linter installers ─────────────────────────────────────────────────
async function applyBiome(targetDir) {
  const biomeJson = `{
  "$schema": "https://biomejs.dev/schemas/2.5.1/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "includes": ["src/**/*.{ts,tsx,js,jsx}", "!**/node_modules", "!**/dist"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "all"
    }
  }
}
`
  await writeFile(join(targetDir, 'biome.json'), biomeJson)
  await patchPackageJson(targetDir, (pkg) => {
    pkg.devDependencies = { ...(pkg.devDependencies || {}), '@biomejs/biome': '^2.5.1' }
    pkg.scripts = {
      ...(pkg.scripts || {}),
      check:  'biome check',
      format: 'biome format --write',
      lint:   'biome lint',
      fix:    'biome check --write',
    }
  })
}

async function applyEslint(targetDir) {
  const eslintConfig = `// eslint.config.js — flat config (ESLint v9+)

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    plugins: { react: reactPlugin, 'react-hooks': reactHooks },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  { ignores: ['node_modules/**', 'dist/**'] },
)
`
  await writeFile(join(targetDir, 'eslint.config.js'), eslintConfig)
  await patchPackageJson(targetDir, (pkg) => {
    pkg.devDependencies = {
      ...(pkg.devDependencies || {}),
      'eslint':                     '^9.20.0',
      '@eslint/js':                 '^9.20.0',
      'typescript-eslint':          '^8.20.0',
      'eslint-plugin-react':        '^7.37.0',
      'eslint-plugin-react-hooks':  '^5.1.0',
    }
    pkg.scripts = {
      ...(pkg.scripts || {}),
      lint:       'eslint .',
      'lint:fix': 'eslint . --fix',
    }
  })
}

async function patchPackageJson(targetDir, mutator) {
  const pkgPath = join(targetDir, 'package.json')
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
  mutator(pkg)
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

// ── Scaffold ───────────────────────────────────────────────────────────
async function scaffold(projectName, linter) {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const templateDir = join(__dirname, 'templates', 'default')
  const targetDir = resolve(process.cwd(), projectName)

  // Validate
  if (!isValidPackageName(projectName)) {
    log(`\n  ${c(RED)}✗${c(RESET)} Invalid project name: ${c(BOLD)}${projectName}${c(RESET)}`)
    log(`  ${c(DIM)}must match: ${c(RESET)}${c(DIM)}/^[a-z0-9][a-z0-9._-]*$/${c(RESET)}\n`)
    process.exit(1)
  }
  if (existsSync(targetDir)) {
    log(`\n  ${c(RED)}✗${c(RESET)} Target directory already exists: ${c(BOLD)}${targetDir}${c(RESET)}\n`)
    process.exit(1)
  }

  // Copy template
  log(`\n  ${c(DIM)}○${c(RESET)} Creating ${c(BOLD)}${projectName}/${c(RESET)} from template...`)
  await mkdir(targetDir, { recursive: true })
  await cp(templateDir, targetDir, { recursive: true })

  // Patch package.json name
  const pkgPath = join(targetDir, 'package.json')
  const pkgRaw = await readFile(pkgPath, 'utf8')
  const pkgPatched = pkgRaw.replace(/"__PROJECT_NAME__"/, JSON.stringify(projectName))
  await writeFile(pkgPath, pkgPatched)

  // Apply linter overlay
  if (linter === 'biome') {
    log(`  ${c(DIM)}○${c(RESET)} Adding ${c(BOLD)}Biome${c(RESET)}...`)
    await applyBiome(targetDir)
  } else if (linter === 'eslint') {
    log(`  ${c(DIM)}○${c(RESET)} Adding ${c(BOLD)}ESLint${c(RESET)}...`)
    await applyEslint(targetDir)
  }

  log(`  ${c(GREEN)}${c(BOLD)}✓${c(RESET)} Created ${c(BOLD)}${projectName}/${c(RESET)}`)

  // Install dependencies (Next.js-like behavior)
  const pm = detectPackageManager()
  const skip = process.argv.includes('--skip-install')

  if (!skip) {
    log(`  ${c(DIM)}○${c(RESET)} Installing dependencies with ${c(BOLD)}${pm}${c(RESET)}...\n`)
    const installStart = Date.now()
    const ok = runInstall(targetDir, pm)
    const elapsed = ((Date.now() - installStart) / 1000).toFixed(1)
    if (ok) {
      log(`\n  ${c(GREEN)}${c(BOLD)}✓${c(RESET)} Dependencies installed ${c(DIM)}(${elapsed}s)${c(RESET)}`)
    } else {
      log(`\n  ${c(RED)}✗${c(RESET)} ${pm} install failed; run ${c(BOLD)}${pm} install${c(RESET)} manually inside ${c(BOLD)}${projectName}/${c(RESET)}`)
    }
  }

  // Next steps
  const runner = pm === 'npm' ? 'npm run dev' : `${pm} dev`
  log(`
  ${c(DIM)}Next:${c(RESET)}
    ${c(BRIGHT)}cd${c(RESET)} ${projectName}
    ${c(BRIGHT)}${runner}${c(RESET)}     ${c(DIM)}# starts the desktop window with HMR${c(RESET)}

  ${c(DIM)}docs${c(RESET)}  ${c(DIM)}https://github.com/murasakijs/murasaki${c(RESET)}
`)
}

// ── Main ──────────────────────────────────────────────────────────────
const banner = renderBanner()
process.stdout.write('\n' + banner + '\n\n')
process.stdout.write(`  ${c(DIM)}desktop apps for Next.js developers${c(RESET)}\n`)

// ── Parse args ────────────────────────────────────────────────────────
const argName = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null
const argLinter = (() => {
  const i = process.argv.indexOf('--linter')
  if (i >= 0 && process.argv[i + 1]) {
    const v = process.argv[i + 1].toLowerCase()
    if (v === 'biome' || v === 'eslint' || v === 'none') return v
  }
  return null
})()

const projectName = argName || (await promptForName())
const linter      = argLinter || (await promptForLinter())

try {
  await scaffold(projectName, linter)
} catch (err) {
  log(`\n  ${c(RED)}✗${c(RESET)} Scaffold failed: ${err.message}\n`)
  process.exit(1)
}

process.exit(0)
