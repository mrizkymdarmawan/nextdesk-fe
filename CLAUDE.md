# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

> Use `pnpm` as the package manager (pnpm-lock.yaml and pnpm-workspace.yaml are present).

## Architecture

This is a **Next.js 16 App Router** project (no `src/` directory — app code lives directly under `app/`).

- `app/layout.tsx` — Root layout; sets fonts (Geist Sans/Mono via `next/font/google`) and global metadata
- `app/globals.css` — Tailwind CSS v4 import + CSS custom properties for light/dark theming
- `app/page.tsx` — Home page

**Path alias:** `@/*` resolves to the project root.

## Coding Principles

Apply best practices and the **KISS (Keep It Simple Stupid)** principle. Write code that is easy to maintain and that everyone can understand. Prefer simplicity over cleverness.
