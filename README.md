# Evidence Desk

<p align="center">
  <img src="public/cover.png" alt="Evidence Desk" width="100%" />
</p>

<p align="center">
  <strong>GenLayer dispute evidence console — freeze evidence, pick criteria, prove drift.</strong>
</p>

<p align="center">
  <a href="https://docs.genlayer.com/"><img src="https://img.shields.io/badge/GenLayer-Project-0ea5a0?style=flat-square" alt="GenLayer" /></a>
  <a href="https://github.com/valentinzubok/EvidenceSnapshot"><img src="https://img.shields.io/badge/EvidenceSnapshot-primitive-111827?style=flat-square" alt="EvidenceSnapshot" /></a>
  <a href="https://github.com/valentinzubok/PromptRegistry"><img src="https://img.shields.io/badge/PromptRegistry-primitive-f59e0b?style=flat-square" alt="PromptRegistry" /></a>
</p>

---

## What it is

**Evidence Desk** is a Next.js dApp that unifies two GenLayer primitives into one product workflow:

| Primitive | Role in app |
|-----------|-------------|
| [EvidenceSnapshot](https://github.com/valentinzubok/EvidenceSnapshot) | Open cases, view frozen hashes, run cross_check |
| [PromptRegistry](https://github.com/valentinzubok/PromptRegistry) | Browse top criteria templates, copy get_body text |

GenLayer is central: all reads/writes go through **genlayer-js** on **Studionet** with MetaMask.

---

## Features

- **Cases** — list_cases, get_case, open_case, cross_check (wallet)
- **Criteria** — top templates, get_body, copy to clipboard
- **Wallet** — MetaMask connect + studionet via client.connect()
- **Explorer links** — Studionet contract pages

---

## Quick start

```bash
git clone https://github.com/valentinzubok/EvidenceDesk.git
cd EvidenceDesk
npm install
cp .env.example .env.local   # optional — defaults to Studionet addresses
npm run dev
```

Open http://localhost:3000 — connect MetaMask, use **Cases** and **Criteria**.

### Deploy (Vercel)

```bash
npm run build
# vercel deploy --prod
```

Set env vars from `.env.example` in Vercel project settings.

---

## Contract addresses (Studionet)

| Contract | Address |
|----------|---------|
| EvidenceSnapshot | `0x356C408058cb82934eE6f62B14FC85D52858721a` |
| PromptRegistry | `0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3` |

---

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind
- [genlayer-js](https://github.com/genlayerlabs/genlayer-js) (Studionet)
- MetaMask (window.ethereum)

---

## Portal

Submit under **Projects** — see [SUBMIT.md](SUBMIT.md).

---

## License

MIT © Valentyn Zubok
