# Intelligent Contracts (source of truth for Evidence Desk)

This folder contains the **GenLayer Intelligent Contract** sources that power Evidence Desk.
Stewards can review fetching, hashing, and validator behavior here without leaving this repository.

| Contract | File | Studionet address |
|----------|------|-------------------|
| EvidenceSnapshot | [`EvidenceSnapshot.py`](./EvidenceSnapshot.py) | [`0x356C408058cb82934eE6f62B14FC85D52858721a`](https://explorer-studio.genlayer.com/contracts/0x356C408058cb82934eE6f62B14FC85D52858721a) |
| PromptRegistry | [`PromptRegistry.py`](./PromptRegistry.py) | [`0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3`](https://explorer-studio.genlayer.com/contracts/0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3) |

Frontend bindings: [`src/lib/contracts.ts`](../src/lib/contracts.ts).

## Method alignment (app ↔ contract)

### EvidenceSnapshot

| App call (`src/lib/contracts.ts`) | Contract method | Kind |
|-----------------------------------|-----------------|------|
| `listCaseIds()` | `list_cases()` | view |
| `getCaseStats()` | `get_stats()` | view |
| `getCase(id)` | `get_case(case_id)` | view |
| `openCase(...)` | `open_case(case_id, urls_json)` | write — `gl.get_webpage` + `gl.eq_principle_strict_eq` |
| `crossCheckCase(...)` | `cross_check(case_id)` | write — re-fetch + hash compare under eq_principle |

Core validator path in `EvidenceSnapshot.py`:

1. `open_case` → `_capture_urls` via `gl.get_webpage` → normalize → content hash + preview → frozen under `eq_principle_strict_eq`
2. `cross_check` → re-capture live URLs → compare hashes/status → set `tampered` when drifted

### PromptRegistry

| App call (`src/lib/contracts.ts`) | Contract method | Kind |
|-----------------------------------|-----------------|------|
| `listTopTemplates(limit)` | `top(offset, limit)` | view — args `["0", String(limit)]` |
| `getCriteriaBody(id)` | `get_body(criteria_id)` | view |

Registry also exposes `publish` / `vote` / `update` / `deprecate` for publishers; the Desk UI currently reads `top` + `get_body`.

## Redeploy (Studio)

1. Open [studio.genlayer.com/contracts](https://studio.genlayer.com/contracts)
2. Paste `EvidenceSnapshot.py` or `PromptRegistry.py`
3. Deploy with an owner `0x…` constructor arg
4. Set `NEXT_PUBLIC_SNAPSHOT_ADDRESS` / `NEXT_PUBLIC_REGISTRY_ADDRESS` in `.env.local`
