# Intelligent Contracts (source of truth for Evidence Desk)

This folder contains the **GenLayer Intelligent Contract** sources that power Evidence Desk.
Stewards can review fetching, hashing, and validator behavior here without leaving this repository.

| Contract         | File                                           | Studionet address                                                                                                                         |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| EvidenceSnapshot | [`EvidenceSnapshot.py`](./EvidenceSnapshot.py) | Redeploy after SHA-256 fix (old Studionet addr used 32-bit hash)                                                                          |
| PromptRegistry   | [`PromptRegistry.py`](./PromptRegistry.py)     | [`0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3`](https://explorer-studio.genlayer.com/contracts/0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3) |

Frontend bindings: [`src/lib/contracts.ts`](../src/lib/contracts.ts).

**URL limit:** `MAX_URLS = 8` in `EvidenceSnapshot.py` ↔ `MAX_URLS_PER_CASE` in [`src/lib/limits.ts`](../src/lib/limits.ts) (validated in case wizard + `parseUrlsJson`).

## Method alignment (app ↔ contract)

### EvidenceSnapshot

| App call (`src/lib/contracts.ts`) | Contract method                 | Kind                                                                               |
| --------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| `listCaseIds()`                   | `list_cases()`                  | view                                                                               |
| `getCaseStats()`                  | `get_stats()`                   | view                                                                               |
| `getCase(id)`                     | `get_case(case_id)`             | view                                                                               |
| `openCase(...)`                   | `open_case(case_id, urls_json)` | write — `gl.get_webpage` + **SHA-256** + `eq_principle_strict_eq` (max **8** URLs) |
| `crossCheckCase(...)`             | `cross_check(case_id)`          | write — re-fetch + **SHA-256** compare under eq_principle                          |

Core validator path in `EvidenceSnapshot.py`:

1. `open_case` → `_capture_urls` via `gl.get_webpage` → normalize → `hashlib.sha256` hex digest + preview → freeze under `eq_principle_strict_eq`
2. `cross_check` → re-capture live URLs → compare SHA-256 digests/status → set `tampered` when drifted

### PromptRegistry

| App call (`src/lib/contracts.ts`) | Contract method         | Kind                               |
| --------------------------------- | ----------------------- | ---------------------------------- |
| `listTopTemplates(limit)`         | `top(offset, limit)`    | view — args `["0", String(limit)]` |
| `getCriteriaBody(id)`             | `get_body(criteria_id)` | view                               |

Registry also exposes `publish` / `vote` / `update` / `deprecate` for publishers; the Desk UI currently reads `top` + `get_body`.

## Redeploy (Studio)

1. Open [studio.genlayer.com/contracts](https://studio.genlayer.com/contracts)
2. Paste `EvidenceSnapshot.py` or `PromptRegistry.py`
3. Deploy (EvidenceSnapshot v2 takes no constructor argument; v1 takes an owner `0x…`)
4. Set `NEXT_PUBLIC_SNAPSHOT_ADDRESS` / `NEXT_PUBLIC_REGISTRY_ADDRESS` in `.env.local`

## EvidenceSnapshot v2 (Studio Dev 61997)

| Item               | Value                                                                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File               | [`EvidenceSnapshotV2.py`](./EvidenceSnapshotV2.py)                                                                                                                            |
| Studio Dev (61997) | [`0xB154B8cDd3618ACE6b5E59C9c2EE7f64AcC783ff`](https://explorer-studio-dev.genlayer.com/address/0xB154B8cDd3618ACE6b5E59C9c2EE7f64AcC783ff)                                   |
| Source sha256      | `f9a92a466a9e6613b82d1dcf7d514b39f624d71502ac4c94e82c0cbe5686b8e4` (checked against the chain by `scripts/verify_evidence_v2.py` in CI)                                       |
| Write-up           | [`docs/MILESTONE_EVIDENCE_V2_1.md`](../docs/MILESTONE_EVIDENCE_V2_1.md) (v2.1, no owner) · [`docs/MILESTONE_EVIDENCE_V2.md`](../docs/MILESTONE_EVIDENCE_V2.md) (drift rounds) |

| Method                                                      | Access      | Effect                                                                                                            |
| ----------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `open_case(case_id, urls_json, question)`                   | anyone      | Freeze every URL (whole-document SHA-256 + bounded digest) and commit the dispute question.                       |
| `cross_check(case_id)`                                      | anyone      | Re-read the committed URLs; record per-URL hash drift. No model spend.                                            |
| `adjudicate(case_id)`                                       | anyone      | For drifted URLs only: validators agree, one boolean each, whether the change altered the answer to the question. |
| `close_case(case_id)`                                       | opener only | Stop further checks. No owner exists in v2.1.                                                                     |
| `get_drift(case_id)`                                        | view        | question, drift verdict, drifted and material URLs, counters, injection flags.                                    |
| `get_case` · `list_cases` · `get_tamper_flag` · `get_stats` | view        | Read state; `get_tamper_flag` is kept for v1 callers.                                                             |

Drift verdicts: `no_drift` → `drift_unjudged` (bytes moved, meaning not judged) → `cosmetic_drift`
or `material_drift`; `evidence_unreachable` when a committed URL cannot be read. Anything the
models cannot resolve escalates as material rather than passing, and a malformed answer, a model
error or a consensus failure reverts the transaction.
