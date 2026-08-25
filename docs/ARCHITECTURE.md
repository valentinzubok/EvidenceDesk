# Architecture & design decisions

## Overview

Evidence Desk is a **Next.js 16** dApp that composes two GenLayer primitives:

| Primitive        | Contract role                                        |
| ---------------- | ---------------------------------------------------- |
| EvidenceSnapshot | `open_case`, `get_case`, `cross_check`, `list_cases` |
| PromptRegistry   | `top`, `get_body`                                    |

All chain I/O goes through **[genlayer-js](https://github.com/genlayerlabs/genlayer-js)** on **Studionet** (GenLayer Studio testnet).

## Why Next.js + genlayer-js?

| Choice                 | Reason                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Next.js App Router** | Static-friendly deploy on Vercel, fast first paint, simple routing for Cases/Criteria |
| **TypeScript**         | Typed contract wrappers, fewer runtime errors in calldata                             |
| **genlayer-js**        | Official SDK — `readContract`, `writeContract`, Studionet connect via MetaMask        |
| **No custom backend**  | Reads/writes hit Studionet directly — no API keys, no server to secure                |
| **Tailwind CSS v4**    | Rapid UI iteration, responsive layout, dark/light themes                              |

## Data flow

```
Browser (MetaMask)
    ↓
genlayer-js client.connect("studionet")
    ↓
EvidenceSnapshot / PromptRegistry (Studionet)
    ↓
JSON responses → React state → UI
```

Write path: `writeContract` → wait `ACCEPTED` receipt → refresh reads.

## Security model

- **Read-only mode** — no wallet required for `list_cases`, `get_case`, `top`, `get_body`
- **Write mode** — MetaMask signs; client validates HTTPS URLs and case IDs before submit
- **CSP** — configured in `next.config.ts`
- **Rate limit** — client-side throttle on `open_case` (see `src/lib/rateLimit.ts`)

## i18n

Lightweight context provider — **EN / UA** in `src/lib/i18n/messages.ts`. No next-i18next dependency.

## Deployment

- **Vercel** — `npm run build`, env vars from `.env.example`
- **Custom domain** — `evidence-desk-chi.valandelon.com`

## Future architecture

See [ROADMAP.md](./ROADMAP.md) for factory contracts, GraphQL read layer, RBAC, batch ops, and Portal Points integration.
