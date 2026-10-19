# Milestone build record — EvidenceSnapshot v2.1

Everything below is addressed by full commit SHA, so the links keep pointing at the same bytes
whatever happens to `main` afterwards.

## Comparison: published Project → milestone head

|                    | Commit                                     | What it is                                                                                                  |
| ------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Base**           | `687c6328910d4b6bd5c617589d4790271dcb18ce` | the Evidence Desk published in Project Explorer (tag `project-explorer-v1`)                                 |
| **Milestone head** | `853ddc929022c28303d05432503aa956ba55582c` | EvidenceSnapshot v2.1: no owner, UserError refusals, lint in CI, redeployed (tag `milestone-evidence-v2.1`) |

**Diff:** https://github.com/valentinzubok/EvidenceDesk/compare/687c6328910d4b6bd5c617589d4790271dcb18ce...853ddc929022c28303d05432503aa956ba55582c

13 files changed, 1538 insertions(+), 30 deletions(-). What changed since the previous milestone attempt (v2, head `1b393d1`):
https://github.com/valentinzubok/EvidenceDesk/compare/1b393d1bbe6ddd0b30be1af583687b6e95addd72...853ddc929022c28303d05432503aa956ba55582c

| File                                    | Lines     |
| --------------------------------------- | --------- |
| `.github/workflows/ci.yml`              | +18 / -0  |
| `README.md`                             | +40 / -14 |
| `contracts/EvidenceSnapshotV2.py`       | +650 / -0 |
| `contracts/README.md`                   | +39 / -16 |
| `docs/MILESTONE_EVIDENCE_V2.md`         | +74 / -0  |
| `docs/MILESTONE_EVIDENCE_V2_1.md`       | +44 / -0  |
| `docs/MILESTONE_EVIDENCE_V2_BUILD.md`   | +89 / -0  |
| `scripts/lint_evidence_v2.sh`           | +18 / -0  |
| `scripts/verify_evidence_v2.py`         | +47 / -0  |
| `src/lib/config.ts`                     | +21 / -0  |
| `tests/conftest.py`                     | +105 / -0 |
| `tests/test_evidence_v2.py`             | +200 / -0 |
| `tests/test_evidence_v2_adversarial.py` | +193 / -0 |

## Files at the milestone head

- Contract: https://github.com/valentinzubok/EvidenceDesk/blob/853ddc929022c28303d05432503aa956ba55582c/contracts/EvidenceSnapshotV2.py
- Tests: https://github.com/valentinzubok/EvidenceDesk/blob/853ddc929022c28303d05432503aa956ba55582c/tests/test_evidence_v2.py and
  https://github.com/valentinzubok/EvidenceDesk/blob/853ddc929022c28303d05432503aa956ba55582c/tests/test_evidence_v2_adversarial.py
- Lint: https://github.com/valentinzubok/EvidenceDesk/blob/853ddc929022c28303d05432503aa956ba55582c/scripts/lint_evidence_v2.sh
- Deployed-code check: https://github.com/valentinzubok/EvidenceDesk/blob/853ddc929022c28303d05432503aa956ba55582c/scripts/verify_evidence_v2.py
- Write-up and transactions: https://github.com/valentinzubok/EvidenceDesk/blob/853ddc929022c28303d05432503aa956ba55582c/docs/MILESTONE_EVIDENCE_V2_1.md

## Deployed source, pinned

|                        |                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Network**            | GenLayer Studio Dev / Studio Next, chain `61997`                                           |
| **Address**            | `0xB154B8cDd3618ACE6b5E59C9c2EE7f64AcC783ff`                                               |
| **Deploy transaction** | `0x829024af268dcb10cf08f41ac282f27c32c82e4d5b5b724ca8c756985b5bd4b6`                       |
| **Source file**        | `contracts/EvidenceSnapshotV2.py` at commit `853ddc929022c28303d05432503aa956ba55582c`     |
| **Git blob**           | `38a1404a16701bc9a26d1fad9719bb6785038214`                                                 |
| **sha256 of the file** | `f9a92a466a9e6613b82d1dcf7d514b39f624d71502ac4c94e82c0cbe5686b8e4`                         |
| **sha256 on chain**    | `f9a92a466a9e6613b82d1dcf7d514b39f624d71502ac4c94e82c0cbe5686b8e4` (`gen_getContractCode`) |

Check it yourself:

```bash
git show 853ddc929022c28303d05432503aa956ba55582c:contracts/EvidenceSnapshotV2.py | shasum -a 256
curl -s -X POST https://studio-dev.genlayer.com/api -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_getContractCode","params":["0xB154B8cDd3618ACE6b5E59C9c2EE7f64AcC783ff"]}' \
  | python3 -c "import sys,json,base64,hashlib; print(hashlib.sha256(base64.b64decode(json.load(sys.stdin)['result'])).hexdigest())"
```

CI runs the same comparison (`scripts/verify_evidence_v2.py`) and the GenVM linter on every push.
