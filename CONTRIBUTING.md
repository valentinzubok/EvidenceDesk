# Contributing to Evidence Desk

Thanks for helping improve the GenLayer dispute evidence console.

## Setup

```bash
git clone https://github.com/valentinzubok/EvidenceDesk.git
cd EvidenceDesk
npm install
cp .env.example .env.local
npm run dev
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm test` | Vitest unit tests |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

## Commit messages

Use imperative, concise subjects:

- `Add case wizard URL validation`
- `Fix cross_check retry on Studionet timeout`
- `Update UA translations for FAQ`

No `Co-authored-by` tooling trailers.

## Pull request checklist

- [ ] `npm test` and `npm run build` pass
- [ ] EN and UA strings updated in `src/lib/i18n/messages.ts` when UI text changes
- [ ] HTTPS-only URL validation preserved for `open_case`
- [ ] No secrets in commits (`.env.local`, keys)
- [ ] Scope stays focused — one feature or fix per PR

## Good first issues

Look for issues labeled **`good first issue`** — docs, i18n, UI polish, tests.

## Code style

- TypeScript strict — no `any` without reason
- Match existing component patterns (`GlassCard`, `useLocale`, `useWallet`)
- Client components only where wallet/browser APIs are needed

## Questions

Open a GitHub issue or discuss on [GenLayer Portal](https://portal.genlayer.foundation/).
