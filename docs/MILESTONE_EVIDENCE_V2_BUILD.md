# Milestone build record — EvidenceSnapshot v2

Everything below is addressed by full commit SHA, so the links keep pointing at the same bytes
whatever happens to `main` afterwards.

## Comparison: Project version → milestone

|                    | Commit                                     | What it is                                                                                  |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Base**           | `687c6328910d4b6bd5c617589d4790271dcb18ce` | `main` from 2026-09-06 until the milestone: the Evidence Desk published in Project Explorer |
| **Milestone head** | `1b393d1bbe6ddd0b30be1af583687b6e95addd72` | EvidenceSnapshot v2, its tests, the deployed-code check and both on-chain rounds            |

**Diff:**
https://github.com/valentinzubok/EvidenceDesk/compare/687c6328910d4b6bd5c617589d4790271dcb18ce...1b393d1bbe6ddd0b30be1af583687b6e95addd72

Three commits, 10 files, 1 348 insertions, no deletions. Nothing that existed in the Project was
modified except four additive edits (CI job, README section, contract map, chain config):

| File                                    | Lines | Status                                        |
| --------------------------------------- | ----: | --------------------------------------------- |
| `contracts/EvidenceSnapshotV2.py`       |  +668 | new — the contract                            |
| `tests/test_evidence_v2.py`             |  +186 | new — lifecycle tests                         |
| `tests/test_evidence_v2_adversarial.py` |  +193 | new — adversarial tests                       |
| `tests/conftest.py`                     |   +96 | new — GenVM test double                       |
| `scripts/verify_evidence_v2.py`         |   +47 | new — deployed bytes == repo file             |
| `docs/MILESTONE_EVIDENCE_V2.md`         |   +74 | new — write-up and transaction table          |
| `.github/workflows/ci.yml`              |   +14 | added the `evidence-contract` job             |
| `README.md`                             |   +26 | added the milestone section                   |
| `contracts/README.md`                   |   +23 | added v2 to the contract map                  |
| `src/lib/config.ts`                     |   +21 | added the Studio Dev chain and the v2 address |

The v1 contract (`contracts/EvidenceSnapshot.py`) and the console code are byte-identical in base
and head: the milestone is the new contract, not a rewrite of the reviewed Project.

Tags mirror the two commits for convenience (`project-explorer-v1`, `milestone-evidence-v2`); the
SHAs above are the reference.

## Files at the milestone head

- Contract:
  https://github.com/valentinzubok/EvidenceDesk/blob/1b393d1bbe6ddd0b30be1af583687b6e95addd72/contracts/EvidenceSnapshotV2.py
- Adversarial tests:
  https://github.com/valentinzubok/EvidenceDesk/blob/1b393d1bbe6ddd0b30be1af583687b6e95addd72/tests/test_evidence_v2_adversarial.py
- Lifecycle tests:
  https://github.com/valentinzubok/EvidenceDesk/blob/1b393d1bbe6ddd0b30be1af583687b6e95addd72/tests/test_evidence_v2.py
- Deployed-code check:
  https://github.com/valentinzubok/EvidenceDesk/blob/1b393d1bbe6ddd0b30be1af583687b6e95addd72/scripts/verify_evidence_v2.py

## Deployed source, pinned

|                        |                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Network**            | GenLayer Studio Dev / Studio Next, chain `61997`, GenVM `v0.3.0`                           |
| **Address**            | `0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047`                                               |
| **Deploy transaction** | `0x99f736b5ea76bd3040074e2124942040af572f90d29689d0ead2e28b5c950171`                       |
| **Source file**        | `contracts/EvidenceSnapshotV2.py` at commit `1b393d1bbe6ddd0b30be1af583687b6e95addd72`     |
| **Introduced in**      | commit `11ddbf3a4c7314169e60e9f1842933f92786d3cb`, unchanged since                         |
| **Git blob**           | `fd1890d9f58ae44110fdb9c2dc63ddf69dd185ad`                                                 |
| **sha256 of the file** | `c29b70c645a97287e4051a2b0ab7b4d08be951001b5e05797bf9bb93ca26f039`                         |
| **sha256 on chain**    | `c29b70c645a97287e4051a2b0ab7b4d08be951001b5e05797bf9bb93ca26f039` (`gen_getContractCode`) |
| **Runner**             | `py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng`                         |

Reproduce both hashes from the pinned commit, without trusting this file:

```bash
curl -sL https://raw.githubusercontent.com/valentinzubok/EvidenceDesk/1b393d1bbe6ddd0b30be1af583687b6e95addd72/contracts/EvidenceSnapshotV2.py \
  | shasum -a 256

curl -s -X POST https://studio-dev.genlayer.com/api -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_getContractCode","params":["0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047"]}' \
  | python3 -c "import sys,json,base64,hashlib; print(hashlib.sha256(base64.b64decode(json.load(sys.stdin)['result'])).hexdigest())"
```

The one constructor argument, `owner_address`, is state rather than code: `gen_getContractCode`
returns the source bytes alone, which is why the two hashes are comparable.

CI repeats that comparison on every push: job `EvidenceSnapshot v2 (contract tests + deployed-code
check)`, which also runs the 33 contract tests. Run at the milestone head:
https://github.com/valentinzubok/EvidenceDesk/actions/runs/37151960511/job/111287498246

## Functional proof on chain

The transaction table is in [`MILESTONE_EVIDENCE_V2.md`](MILESTONE_EVIDENCE_V2.md). The two rounds
that show the new behaviour, on the same page:

| Change committed to the page              | Verdict          | `adjudicate` transaction                                             |
| ----------------------------------------- | ---------------- | -------------------------------------------------------------------- |
| review date edited                        | `cosmetic_drift` | `0xe4b8ba9400dc4a1ef3b423160e1eaa58d5202a4974e113dcdaa3c111d8c465e1` |
| 99.9% uptime clause and credits withdrawn | `material_drift` | `0xc9dc707a491391eec36db372a40ba82e1677ac4a8f438c41d1b0c00371e716c0` |
