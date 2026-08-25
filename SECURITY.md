# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` | ✅ active |

Production: https://evidence-desk-chi.valandelon.com

## Reporting a vulnerability

**Do not** open public issues for exploitable security bugs.

Email or DM the maintainer via GitHub: [@valentinzubok](https://github.com/valentinzubok)

Include:

- Description and impact
- Steps to reproduce
- Affected URLs / contract methods
- Suggested fix (optional)

We aim to respond within **72 hours**.

## Scope

In scope:

- Evidence Desk dApp (XSS, CSP bypass, wallet phishing UX)
- Client-side validation bypass leading to unsafe on-chain calls
- Dependency vulnerabilities in production bundle

Out of scope (report to respective projects):

- GenLayer Studionet infrastructure
- MetaMask extension
- Third-party URL content fetched by EvidenceSnapshot `cross_check`

## Measures in place

- **CSP** headers in `next.config.ts`
- **HTTPS-only** URL validation before `open_case`
- **Case ID** sanitization (alphanumeric + `_` `-`, max 64)
- **Client rate limit** — 5 `open_case` attempts per address per minute (anti-spam UX; on-chain limit is roadmap)
- **`rel="noopener noreferrer"`** on external links
- No `dangerouslySetInnerHTML` for user or contract content

## Recommended audit steps

Before mainnet or high-value deployments:

1. Run **Slither** / **MythX** on EvidenceSnapshot & PromptRegistry (primitive contracts)
2. Review genlayer-js transaction flows with a test wallet
3. Verify env vars in Vercel — no private keys in `NEXT_PUBLIC_*`
4. Pen-test CSP with [securityheaders.com](https://securityheaders.com/)

## Bug bounty

No formal paid program yet. Valid reports may be acknowledged in release notes and Portal contributions at maintainer discretion.

## Roadmap (on-chain security)

See [docs/ROADMAP.md](docs/ROADMAP.md):

- Per-address `open_case` rate limits in contract
- RBAC (owner / validator / viewer)
- Factory contract for isolated desk instances
