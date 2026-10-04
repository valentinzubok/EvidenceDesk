# Milestone — EvidenceSnapshot v2: from "the bytes changed" to "the change matters"

Evidence Desk v1 is live in Project Explorer and runs two Intelligent Contracts on legacy
Studionet. It can freeze the pages a dispute cites and tell you their SHA-256 digests no longer
match. That is necessary and not sufficient: a vendor who edits a timestamp and a vendor who
deletes the clause under dispute both show up as `tampered = true`, and a reviewer has to go and
read the pages anyway.

This milestone adds the verdict a dispute desk actually needs, and moves the contract onto the
current network.

|                    |                                                                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What is new**    | `adjudicate(case_id)` — for the drifted URLs only, validators compare the frozen snapshot with the live one and agree on **one boolean per URL**: did the change alter the answer to the case question?                          |
| **New deployment** | GenVM v0.3 on **Studio Dev / Studio Next, chain 61997**: [`0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047`](https://explorer-studio-dev.genlayer.com/address/0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047) (v1 ran on Studionet 61999) |
| **Source**         | [`contracts/EvidenceSnapshotV2.py`](../contracts/EvidenceSnapshotV2.py), sha256 `c29b70c645a97287e4051a2b0ab7b4d08be951001b5e05797bf9bb93ca26f039`                                                                               |
| **Verification**   | `scripts/verify_evidence_v2.py` compares the deployed bytes with that file and runs in CI (`evidence-contract` job)                                                                                                              |
| **Tests**          | 33 new tests: `tests/test_evidence_v2.py` + `tests/test_evidence_v2_adversarial.py`                                                                                                                                              |

## What changed in the contract

| v1 (live)                                         | v2                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cross_check` compares hashes and sets `tampered` | `cross_check` still does exactly that — cheap, deterministic, **no model spend** — and records per-URL drift, then `adjudicate` judges what the drift _means_                                                                                                                         |
| No question is stored                             | The **dispute question** is committed at `open_case` and is what the drift is judged against                                                                                                                                                                                          |
| 280-character `preview` per URL                   | The **whole** normalized document is hashed, and the models read a bounded deterministic digest: head window plus non-overlapping windows around the question's own words, ≤4000 chars                                                                                                |
| `bool(check.get("all_match"))`                    | Nothing is coerced: `literal_bool()` accepts only JSON `true`/`false`, and anything else reverts the transaction                                                                                                                                                                      |
| No LLM in the loop at all                         | One boolean per drifted URL under `eq_principle.prompt_comparative`, with the question and both snapshots fenced as untrusted data and injection phrasing flagged                                                                                                                     |
| —                                                 | **Fail-safe direction is explicit:** an unreadable page, an empty snapshot or an unresolvable comparison is escalated as `material_drift`, never quietly called cosmetic. A malformed answer, a model error or a consensus failure **reverts** and leaves the drift `drift_unjudged`. |
| —                                                 | `principle` is passed **positionally**. It is positional-only in GenVM v0.3, so the keyword form raises `TypeError` — which is how v1-era contracts silently ended up deciding under `strict_eq`.                                                                                     |

New state a reviewer can read without a wallet: `get_drift(case_id)` returns the question, the
drift verdict (`no_drift` · `drift_unjudged` · `cosmetic_drift` · `material_drift` ·
`evidence_unreachable`), which URLs drifted, which of those are material, and the injection flags
seen in the data. `get_tamper_flag` is kept so v1 callers keep working.

## Verify the deployment

```bash
curl -s -X POST https://studio-dev.genlayer.com/api -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_getContractCode","params":["0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047"]}' \
  | python3 -c "import sys,json,base64,hashlib; print(hashlib.sha256(base64.b64decode(json.load(sys.stdin)['result'])).hexdigest())"
shasum -a 256 contracts/EvidenceSnapshotV2.py
# both print c29b70c645a97287e4051a2b0ab7b4d08be951001b5e05797bf9bb93ca26f039
```

## On-chain, on the new deployment

| #   | Step                                                                                                                                         | Result                                                                                                                         | Tx                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 0   | deploy                                                                                                                                       | contract created                                                                                                               | `0x99f736b5ea76bd3040074e2124942040af572f90d29689d0ead2e28b5c950171`         |
| 1   | `open_case("case/hello", [hello.html], "Does the page still say Hello world?")`                                                              | evidence frozen                                                                                                                | `0xe32d352694d12ad8e43baf89b87830b71acfd3ae7c50bc8a84c6a26247331803`         |
| 2   | `cross_check("case/hello")`                                                                                                                  | `no_drift` — hashes identical, decided arithmetically with no model spend                                                      | `0x0efdc0f6ecf06b5a19174f3d18b331eeaab3f310f543b991d8b39519cef29254`         |
| 3   | `adjudicate("case/hello")`                                                                                                                   | **reverted**: `"nothing to adjudicate: run cross_check and find drift first"` — the expensive half cannot be run speculatively | `0x2d04afd2ca117921a3568e52a4a501f33f2b13cbf4935378ca9f6439f4494eef` (ERROR) |
| 4   | `open_case("case/sla", [fixtures/sla.html], "Does the vendor still promise 99.9% monthly uptime with service credits paid within 30 days?")` | frozen: sha-256 `0a1a7f3b…` over 1195 characters, 935 of them in the digest                                                    | `0xa272f981a69edea267609fb23fba0912dc5494be01dfc4653cb8e7552a2b86a9`         |

| 5 | commit adds a review line to the SLA page, then `cross_check("case/sla")` | `drift_unjudged` — the bytes moved, so the case is flagged but **not** judged yet. v1 would have stopped here and called it `tampered`. | `0x3fd8bddd924d2f1da8b06360764fe964c20a6873fad8d8045b246697e3548702` |
| 6 | `adjudicate("case/sla")` | **`cosmetic_drift`** — the validators agreed the review line does not change the answer to the case question. `material_urls` stays empty. | `0xe4b8ba9400dc4a1ef3b423160e1eaa58d5202a4974e113dcdaa3c111d8c465e1` |

| 7 | commit withdraws the uptime commitment and the credit term, then `cross_check("case/sla")` | `drift_unjudged` again — hash drift, 1195 → 1323 characters | `0xe3443ecdab0bbabcbee1a647cd6e7e62d42ecdd04d2e76eddd4cd1c59bcc1c40` |
| 8 | `adjudicate("case/sla")` | **`material_drift`** — the same page, the same verdict mechanism, the opposite answer: the clause the question asks about is gone, so the URL lands in `material_urls` | `0xc9dc707a491391eec36db372a40ba82e1677ac4a8f438c41d1b0c00371e716c0` |

State (`get_stats`): `{"cases":2,"no_drift":1,"unjudged_drift":0,"cosmetic_drift":0,"material_drift":1,"unreachable":0,"checks":3,"adjudications":2}`

Steps 5–8 are the milestone in two lines: **the same page, the same contract, two different
verdicts.** A review date is cosmetic; a withdrawn commitment is material. v1 reported both as
`tampered = true`.

The SLA evidence page is a file in a public repository
([`fixtures/sla.html`](https://github.com/valentinzubok/CiteGuard/blob/main/web/public/fixtures/sla.html)),
so each edit the case reacts to is a commit anyone can diff: one commit adds a review date, the
next withdraws the uptime commitment and the credit term. The material round is appended below once
Studio Dev's page renderer serves the new text (it caches a URL for a few minutes, so the first
check after a commit can still legitimately see the old document).
