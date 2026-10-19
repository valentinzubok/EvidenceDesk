# EvidenceSnapshot v2.1 — no operator, lint-clean, redeployed

v2 was reviewed and two things were still wrong with it:

- **An owner could close anyone's case.** `_only_opener` let `self.owner` through, and the owner
  could be transferred. v2.1 removes the owner entirely: no `owner` field, no constructor argument,
  no `transfer_ownership`, no `get_owner`. Only the account that opened a case can close it.
- **Bare `Exception`.** All 23 deliberate refusals now raise `gl.vm.UserError`, so the current GenVM
  linter passes and the refusal text comes back on chain as the error payload.

The drift logic — freezing whole documents, cross-checking hashes, and validators agreeing whether a
drift changes the answer to the case question — is unchanged.

|                                                 |                                                                                                                                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contract**                                    | [`0xB154B8cDd3618ACE6b5E59C9c2EE7f64AcC783ff`](https://explorer-studio-dev.genlayer.com/address/0xB154B8cDd3618ACE6b5E59C9c2EE7f64AcC783ff) on Studio Dev (61997)                       |
| **Deploy tx**                                   | [`0x829024af…5bd4b6`](https://explorer-studio-dev.genlayer.com/tx/0x829024af268dcb10cf08f41ac282f27c32c82e4d5b5b724ca8c756985b5bd4b6) from `0x73064D61A55Fdc895a87fA0432637CdBfc80B7a3` |
| **sha256 of `contracts/EvidenceSnapshotV2.py`** | `f9a92a466a9e6613b82d1dcf7d514b39f624d71502ac4c94e82c0cbe5686b8e4` — `scripts/verify_evidence_v2.py` compares it with `gen_getContractCode` in CI                                       |
| **Lint**                                        | `sh scripts/lint_evidence_v2.sh`: `genvm-lint lint`, `check`, `typecheck` — passed, in CI                                                                                               |
| **Tests**                                       | 34 (`tests/test_evidence_v2.py`, `tests/test_evidence_v2_adversarial.py`)                                                                                                               |
| **Previous deployment**                         | `0xe5a428bC4A6cbd8E61e31C923C9703f5c1bA0047` (v2, with an owner)                                                                                                                        |

## On-chain run

Opener `0x0179e90393728B0De541Ea6C73743f4d4e6faAa9`, stranger `0x8Eb9001Cda3917d3F1e31dB5c70e7B7eD56B08d7`.
The page is the SLA fixture pinned at a commit:
`https://raw.githubusercontent.com/valentinzubok/CiteGuard/9d1f61edc41257c7e1e58c837e45d97ba80a6bc7/web/public/fixtures/sla.html`.

| #   | Call                          | Sender       | Result    | What happened                                                                                                      | Tx                                                                                                                                    |
| --- | ----------------------------- | ------------ | --------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `open_case("case/sla-v21")`   | opener       | SUCCESS   | case opened; the SLA page frozen (whole document hashed) with the question fixed                                   | [`0x58748817…a90214`](https://explorer-studio-dev.genlayer.com/tx/0x58748817ef1689ee8c1a38c2085c731d754948f7ec9068f18ed6de63d1a90214) |
| 2   | `close_case("case/sla-v21")`  | **stranger** | **ERROR** | **UserError** `only the case opener may do that`                                                                   | [`0x78bc2214…c93ca7`](https://explorer-studio-dev.genlayer.com/tx/0x78bc221498dae2cebcb801d79e6625f21b3840f179e94ef2bed915e519c93ca7) |
| 3   | `close_case("case/sla-v21")`  | **deployer** | **ERROR** | **UserError** `only the case opener may do that` — the account that deployed the contract has no power over a case | [`0x4d27542b…4083d2`](https://explorer-studio-dev.genlayer.com/tx/0x4d27542badf32ed41964b82003ce2d77b41cade0c5dde267049aa9cab64083d2) |
| 4   | `cross_check("case/sla-v21")` | stranger     | SUCCESS   | anyone may cross-check: the page is unchanged, `no_drift`                                                          | [`0x02ff75ce…26c115`](https://explorer-studio-dev.genlayer.com/tx/0x02ff75ce55c37218e80347da0c73f08523c59204514cdfa5f73b01303426c115) |
| 5   | `adjudicate("case/sla-v21")`  | stranger     | **ERROR** | **UserError** `nothing to adjudicate: run cross_check and find drift first`                                        | [`0x951843ee…8caa89`](https://explorer-studio-dev.genlayer.com/tx/0x951843ee98aca168dc218d87df45825602ee3d508107d7dbe117fdbe458caa89) |
| 6   | `close_case("case/sla-v21")`  | opener       | SUCCESS   | the opener closes the case                                                                                         | [`0xa319f53a…fdf467`](https://explorer-studio-dev.genlayer.com/tx/0xa319f53ab77065396d9a39307543d6f8452a11efc7f05c95c336f0f318fdf467) |
| 7   | `cross_check("case/sla-v21")` | stranger     | **ERROR** | **UserError** `case is closed`                                                                                     | [`0x34f9fa6f…fad215`](https://explorer-studio-dev.genlayer.com/tx/0x34f9fa6f9832ddc4a6c114208d79072815fa1595e5430ceb0fce06fc8cfad215) |

End state: `get_case("case/sla-v21")` → `status: closed`, `drift: no_drift`; `get_stats` →
`{"cases":1,"no_drift":1,"checks":1,"adjudications":0}`.

The two adjudication rounds that show the drift judgement itself (cosmetic drift → no change of
answer; material drift → the clause is gone) are recorded in [`MILESTONE_EVIDENCE_V2.md`](MILESTONE_EVIDENCE_V2.md)
on the previous deployment; that code path is byte-for-byte the same apart from the error type.
