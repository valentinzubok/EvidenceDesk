# Evidence Desk roadmap

## ✅ Shipped (v1.x)

### dApp UX

- Case wizard, cross_check progress + retry, FAQ (EN/UA)
- Dark / light theme, toasts, rate limit on open_case
- **SWR caching** keyed by chain (Studionet / Asimov)
- **Infinite scroll** + cursor API (`/api/cases?cursor=&limit=`)
- **Dynamic routes** `/cases/[id]`, shareable URLs
- **Marketplace**, **AI criteria assistant**, **RBAC demo**
- **Site chrome:** header + mobile nav, footer, breadcrumbs, favicon, sticky Cases CTA
- **Chain switcher:** Studionet writes + Asimov read-only

### API & SDK

- REST + GraphQL, `evidence-desk-sdk` package

### DevOps

- CI: lint, format, test, build, Storybook (Vite), SDK
- Security workflow, Deploy (Vercel secrets), Cypress e2e
- Docker, contracts in-repo for Portal review

## 🔜 Requires contracts / infra

| Feature                      | Notes                                       |
| ---------------------------- | ------------------------------------------- |
| On-chain RBAC                | Set `NEXT_PUBLIC_RBAC_ADDRESS` after deploy |
| Factory / batch              | Set `NEXT_PUBLIC_FACTORY_ADDRESS`           |
| Portal resubmit              | User action — see [SUBMIT.md](../SUBMIT.md) |
| npm publish SDK              | Tag `sdk-v*` + `NPM_TOKEN`                  |
| Revoke & rotate Vercel token | Was shared in chat                          |

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
