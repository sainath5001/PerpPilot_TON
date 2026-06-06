# PerpPilot TON

Professional perpetual trading risk terminal for TON traders — built for the [STON.fi Vibe Coding Hackathon](https://ston.fi).

## What it is

PerpPilot TON is **not** a perpetual exchange. It is a risk-analysis, trade-planning, and collateral-management platform that helps TON traders evaluate positions before execution.

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4 + shadcn/ui
- Zustand
- React Hook Form + Zod (ready for forms)
- TON AppKit + TonConnect (Tonkeeper)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect a TON wallet (Tonkeeper), and access the dashboard.

## Project structure

```
src/
├── app/                    # Routes (landing, dashboard)
├── components/
│   ├── dashboard/          # Dashboard UI
│   ├── layout/             # TopNav, ProtectedDashboardLayout
│   ├── navigation/         # Sidebar, NavItem
│   ├── providers/          # AppProviders (client-only wallet shell)
│   ├── ui/                 # shadcn/ui primitives
│   └── wallet/             # WalletProvider, WalletConnectButton
├── hooks/                  # useWalletSync, useIsWalletConnected
├── lib/                    # AppKit config, utils
├── store/                  # Zustand wallet store
└── types/                  # Global TypeScript types
```

## Core flow

1. Land on the app
2. Connect TON wallet (required)
3. Access protected dashboard
4. Analyze positions (coming in next prompts)
5. Manage collateral via Omniston (coming soon)

## Scripts

| Command        | Description          |
| -------------- | -------------------- |
| `npm run dev`  | Start dev server     |
| `npm run build`| Production build     |
| `npm run start`| Start production     |
| `npm run lint` | ESLint               |

## Deployment

Deploy to Vercel and update `public/tonconnect-manifest.json` with your production URL before going live.
