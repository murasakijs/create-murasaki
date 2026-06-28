#!/usr/bin/env node
// create-murasaki — Scaffolder for Murasaki apps.

// ── ANSI truecolor (Oomurasaki palette) ────────────────────────────────
const BRIGHT = '\x1b[38;2;168;85;247m'
const DEEP   = '\x1b[38;2;91;33;182m'
const CREAM  = '\x1b[38;2;250;245;232m'
const DARK   = '\x1b[38;2;59;7;100m'
const DIM    = '\x1b[38;2;136;136;153m'
const BOLD   = '\x1b[1m'
const RESET  = '\x1b[0m'

// Background versions for half-block compositing
const BG_BRIGHT = '\x1b[48;2;168;85;247m'
const BG_DEEP   = '\x1b[48;2;91;33;182m'
const BG_CREAM  = '\x1b[48;2;250;245;232m'
const BG_DARK   = '\x1b[48;2;59;7;100m'

const noColor = process.env.NO_COLOR || !process.stdout.isTTY
const c = (code) => (noColor ? '' : code)

// ── H4 butterfly grid (19 col × 12 row) — ichi's revised Figma version ─
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

// Compress 2 grid rows into 1 terminal row using half-block ▀
// (top half = fg color, bottom half = bg color)
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

      if (!tFg && !bFg) {
        line += ' '
      } else if (tFg && !bFg) {
        line += c(tFg) + '▀' + c(RESET)
      } else if (!tFg && bFg) {
        line += c(bFg) + '▄' + c(RESET)
      } else {
        // Both halves filled
        if (tCh === bCh) {
          line += c(tFg) + '█' + c(RESET)
        } else {
          line += c(tFg) + c(BG_OF[bCh]) + '▀' + c(RESET)
        }
      }
    }
    out.push(line)
  }
  return out
}

// ── figlet "Standard" wordmark ─────────────────────────────────────────
const WORDMARK_LINES = [
  '                                      _    _ ',
  ' _ __ ___  _   _ _ __ __ _ ___  __ _ | | _(_)',
  "| '_ ` _ \\| | | | '__/ _` / __|/ _` || |/ /| |",
  '| | | | | | |_| | | | (_| \\__ \\ (_| ||   < | |',
  '|_| |_| |_|\\__,_|_|  \\__,_|___/\\__,_||_|\\_\\|_|',
]

function colorize(line, color, opts = {}) {
  const prefix = (opts.bold ? c(BOLD) : '') + c(color)
  return prefix + line + c(RESET)
}

// ── Render banner: butterfly LEFT, wordmark RIGHT, vertically centered ─
function renderBanner() {
  const bf = renderButterflyLines()  // now 6 lines
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

// ── Output ─────────────────────────────────────────────────────────────
process.stdout.write('\n' + renderBanner() + '\n')
process.stdout.write(`
  ${c(DIM)}desktop apps for Next.js developers${c(RESET)}

  ${c(DEEP)}docs${c(RESET)}  ${c(DIM)}https://github.com/murasakijs/murasaki${c(RESET)}

  ${c(DIM)}🌱 Pre-alpha — scaffolder not implemented yet.${c(RESET)}
  ${c(DIM)}Follow progress on GitHub or watch this space.${c(RESET)}

`)

process.exit(0)
