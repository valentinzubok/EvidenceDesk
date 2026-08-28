# Intelligent Contracts (source of truth for Evidence Desk)

This folder contains the **GenLayer Intelligent Contract** sources that power Evidence Desk.
Stewards can review fetching, hashing, and validator behavior here without leaving this repository.

| Contract | File | Studionet address |
|----------|------|-------------------|
| EvidenceSnapshot | [`EvidenceSnapshot.py`](./EvidenceSnapshot.py) | Redeploy after SHA-256 fix (old Studionet addr used 32-bit hash) |
| PromptRegistry | [`PromptRegistry.py`](./PromptRegistry.py) | [`0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3`](https://explorer-studio.genlayer.com/contracts/0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3) |

Frontend bindings: [`src/lib/contracts.ts`](../src/lib/contracts.ts).

**URL limit:** `MAX_URLS = 8` in `EvidenceSnapshot.py` ↔ `MAX_URLS_PER_CASE` in [`src/lib/limits.ts`](../src/lib/limits.ts) (validated in case wizard + `parseUrlsJson`).

## Method alignment (app ↔ contract)

### EvidenceSnapshot

| App call (`src/lib/contracts.ts`) | Contract method | Kind |
|-----------------------------------|-----------------|------|
| `listCaseIds()` | `list_cases()` | view |
| `getCaseStats()` | `get_stats()` | view |
| `getCase(id)` | `get_case(case_id)` | view |
| `openCase(...)` | `open_case(case_id, urls_json)` | write — `gl.get_webpage` + **SHA-256** + `eq_principle_strict_eq` (max **8** URLs) |
| `crossCheckCase(...)` | `cross_check(case_id)` | write — re-fetch + **SHA-256** compare under eq_principle |

Core validator path in `EvidenceSnapshot.py`:

1. `open_case` → `_capture_urls` via `gl.get_webpage` → normalize → `hashlib.sha256` hex digest + preview → freeze under `eq_principle_strict_eq`
2. `cross_check` → re-capture live URLs → compare SHA-256 digests/status → set `tampered` when drifted

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
