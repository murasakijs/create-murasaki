<div align="center">

<img src="./assets/logo.svg" alt="create-murasaki — Murasaki アプリのスキャフォルダ" width="720">

**[Murasaki](https://github.com/murasakijs/murasaki) のスキャフォルダ** — Next.js
風の DX で書ける TypeScript / Node.js 用デスクトップフレームワーク。

[![npm version](https://img.shields.io/npm/v/create-murasaki?color=A855F7&label=npm)](https://www.npmjs.com/package/create-murasaki)
[![npm downloads](https://img.shields.io/npm/dm/create-murasaki?color=A855F7)](https://www.npmjs.com/package/create-murasaki)
[![license](https://img.shields.io/npm/l/create-murasaki?color=A855F7)](./LICENSE)

[English](./README.md) · [日本語](./README.ja.md)

</div>

---

## 使い方

```bash
# 対話モード (プロジェクト名 + linter を聞かれる)
pnpm create murasaki@latest

# 非対話モード
pnpm create murasaki@latest my-app --linter biome
npm  create murasaki@latest my-app --linter none
yarn create murasaki       my-app --linter eslint
bunx  create-murasaki      my-app
```

その後:

```bash
cd my-app
pnpm dev        # HMR 付き開発ウィンドウ
pnpm build      # dist/server.cjs
pnpm bundle     # dist/<App>.app (または OS 用フォルダ)
pnpm installer  # dist/<App>-<ver>.dmg (または .msi / .AppImage / .zip)
```

## 生成される構成

```
my-app/
├── src/
│   ├── app/
│   │   ├── page.tsx        最初のルート (/)
│   │   ├── layout.tsx      ルートレイアウト (metadata, ThemeProvider, ToastProvider)
│   │   └── globals.css     テーマトークン + reset
│   └── ...
├── murasaki.config.ts      typed なビルド設定 (name, bundleId, icon, targets)
├── package.json            dev / build / bundle / installer スクリプト付き
└── tsconfig.json
```

## オプション

| フラグ                     | 値                            | デフォルト        |
| ------------------------- | ----------------------------- | ---------------- |
| `<project-name>`          | 有効な npm パッケージ名        | 対話で入力       |
| `--linter <name>`         | `biome`, `eslint`, `none`     | 対話で選択 (Biome 推奨) |

## コントリビュート

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照。

## 行動規範

[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) を参照。

## セキュリティ

[SECURITY.md](./SECURITY.md) を参照。

## ライセンス

MIT © ichi — [LICENSE](./LICENSE) を参照。
