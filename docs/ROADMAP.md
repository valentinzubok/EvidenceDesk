# Evidence Desk roadmap

## ✅ Shipped (v1.x)

### dApp UX

- Case wizard, cross_check progress + retry, FAQ (EN/UA)
- Dark / light theme, toasts, rate limit on open_case
- **SWR caching** for list_cases / get_case / stats
- **Infinite scroll** + cursor API (`/api/cases?cursor=&limit=`)
- **Dynamic routes** `/cases/[id]`, shareable URLs
- **shortHash** for tx/content hashes, **Tooltips** on wallet & cross_check
- **Marketplace** page (KYC/AML/legal packs → Criteria)
- **AI criteria assistant** (`POST /api/ai/suggest-criteria`)
- **RBAC demo** (Admin / Moderator / Viewer in localStorage)
- **Chain service layer** (Studionet live; Asimov/Polkadot/Solana placeholders)

### API & SDK

- `GET /api/cases`, `/api/cases/summary`, `/api/history`
- **`evidence-desk-sdk`** package (`packages/evidence-desk-sdk`)

### DevOps

- CI: lint, format, test, build
- Security workflow: npm audit + tests
- Deploy workflow (Vercel secrets)
- **Dockerfile** + docker-compose

## 🔜 Requires contracts / infra

| Feature                    | Notes                                         |
| -------------------------- | --------------------------------------------- |
| On-chain RBAC              | Replace localStorage demo                     |
| Cross-chain EvidenceChain  | Adapters stubbed in `chainService.ts`         |
| Factory / batch_open_cases | New EvidenceSnapshot deploy                   |
| GraphQL index              | External indexer                              |
| Cypress e2e + MetaMask     | CI runner with wallet mock                    |
| Storybook                  | UI component catalog                          |
| OWASP ZAP full scan        | Add staging URL to CI                         |
| npm publish SDK            | `npm publish` from packages/evidence-desk-sdk |
| Asimov read-only demo      | `NEXT_PUBLIC_CHAIN=asimov` when RPC live      |

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
