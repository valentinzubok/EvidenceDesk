# Portal submission — Evidence Desk (Projects)

## Checklist

- [ ] Builder activated + GitHub linked
- [ ] Live deploy URL (Vercel)
- [ ] GitHub repo public
- [ ] **Both IC sources in-repo:** `contracts/EvidenceSnapshot.py` + `contracts/PromptRegistry.py`
- [ ] Method map in `contracts/README.md` matches `src/lib/contracts.ts`
- [ ] EvidenceSnapshot + PromptRegistry explorer links
- [ ] Screenshot or short demo of Cases + Criteria flow
- [ ] Submit at [submit-contribution](https://portal.genlayer.foundation/submit-contribution)

## Type

**Projects** (20–4000 pts)

## Title

```text
Evidence Desk — GenLayer dispute evidence console (EvidenceSnapshot + PromptRegistry)
```

## Description (paste into Portal)

```text
Evidence Desk is a Next.js dApp where GenLayer is central to the main workflow.

Use case: dispute evidence management. Builders open cases (EvidenceSnapshot), freeze URL evidence on-chain, browse shared eq-principle criteria (PromptRegistry), and cross-check for tampering — all from one dashboard.

Intelligent Contract sources are included in this repository for review:
- contracts/EvidenceSnapshot.py — open_case (gl.get_webpage + eq_principle_strict_eq hashing), cross_check, list_cases, get_case, get_stats
- contracts/PromptRegistry.py — top, get_body (plus publish/vote for publishers)
Method map: contracts/README.md ↔ src/lib/contracts.ts

Stack: Next.js + genlayer-js + MetaMask on Studionet. Real read/write IC calls — not mocked.

Live: https://evidence-desk-chi.valandelon.com
GitHub: https://github.com/valentinzubok/EvidenceDesk
Studionet EvidenceSnapshot: 0x356C408058cb82934eE6f62B14FC85D52858721a
Studionet PromptRegistry: 0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3
```

## Evidence URLs

1. GitHub: https://github.com/valentinzubok/EvidenceDesk (see `/contracts`)
2. Live app: https://evidence-desk-chi.valandelon.com
3. EvidenceSnapshot explorer: https://explorer-studio.genlayer.com/contracts/0x356C408058cb82934eE6f62B14FC85D52858721a
4. PromptRegistry explorer: https://explorer-studio.genlayer.com/contracts/0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3

## Pitch

**Freeze evidence. Pick criteria. Prove drift — one desk for GenLayer disputes.**
