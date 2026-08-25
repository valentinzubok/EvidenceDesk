# Evidence Desk roadmap

Items from ecosystem feedback — status as of v1.x.

## ✅ Shipped (dApp)

- Case creation **wizard** with in-browser URL validation
- **cross_check** progress UI + retry
- Criteria **search**, **tag filter**, **sort** by score/uses
- **FAQ** (EN / UA)
- **Dark / light** theme toggle
- Client **rate limit** on `open_case` (5/min per address)
- CONTRIBUTING.md, SECURITY.md, ARCHITECTURE.md
- OpenAPI-style contract docs (`docs/openapi.yaml`)

## 🔜 Smart contracts (requires new deploys)

| Feature                 | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| **Factory contract**    | Deploy isolated EvidenceDesk + Snapshot instances per builder |
| **RBAC**                | owner / validator / viewer roles for update & deprecate       |
| **batch_open_cases**    | Lower overhead for bulk evidence intake                       |
| **On-chain rate limit** | `open_case` cooldown per address                              |
| **record_use / Points** | Track case reuse for GenLayer Portal rewards                  |

## 🔜 Infrastructure

| Feature                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| **Read-only GraphQL**  | Index Studionet cases for external tools (no wallet) |
| **OpenAPI gateway**    | Optional REST proxy if GraphQL is added              |
| **Slither / MythX CI** | Automated reports on primitive contract repos        |

## 🔜 Ecosystem

| Feature                        | Description                                           |
| ------------------------------ | ----------------------------------------------------- |
| **Studio plugin**              | Scaffold Evidence Desk front-end from GenLayer Studio |
| **Dispute marketplace bridge** | Post cases as collateral in resolution markets        |
| **YouTube tutorial**           | Full flow walkthrough for newcomers                   |
| **Discord #evidencedesk**      | Community feedback channel                            |

## Contributing

Pick a **good first issue** or propose a PR — see [CONTRIBUTING.md](../CONTRIBUTING.md).
