# Portal submission — Evidence Desk (Projects)

## Status after first rejection + appeal

1st reject: IC sources missing from repo → **fixed** (`contracts/`).  
Appeal was used; stewards said: **resubmit as a new project** (do not appeal again).

Use **Correct and retry → Resubmit**.

## Checklist

- [x] IC sources in-repo: `contracts/EvidenceSnapshot.py` + `contracts/PromptRegistry.py`
- [x] Method map: `contracts/README.md` ↔ `src/lib/contracts.ts`
- [x] Live demo: https://evidence-desk-chi.valandelon.com
- [x] EvidenceSnapshot uses nondet `gl.get_webpage` + `eq_principle_strict_eq` (core IC path)
- [ ] Fresh screenshot / short clip of Cases + Criteria
- [ ] Resubmit under **Projects**

## Title

```text
Evidence Desk — GenLayer dispute evidence console (with in-repo Intelligent Contracts)
```

## Description (paste into Portal)

```text
Evidence Desk is a production Next.js Project where GenLayer is central to the main workflow.

Use case: dispute evidence. Users open cases, freeze live URL evidence on-chain, browse shared criteria, and run cross_check — via genlayer-js + MetaMask on Studionet.

Intelligent Contract sources are IN THIS REPOSITORY for steward review (addressing prior rejection):
• contracts/EvidenceSnapshot.py — open_case fetches pages with gl.get_webpage, freezes hashes under eq_principle_strict_eq; cross_check re-fetches and flags tampering
• contracts/PromptRegistry.py — criteria registry; v0.4 assess_quality uses LLM + prompt_comparative (nondet validator assessment)

App bindings: src/lib/contracts.ts ↔ contracts/README.md

Live: https://evidence-desk-chi.valandelon.com
GitHub: https://github.com/valentinzubok/EvidenceDesk
Studionet EvidenceSnapshot: 0x356C408058cb82934eE6f62B14FC85D52858721a
Studionet PromptRegistry: 0xc62eC7D0133867b33f50D7E9416D01A8Cc244DF3 (redeploy if using v0.4 assess_quality)
```

## Evidence (attach all)

1. https://github.com/valentinzubok/EvidenceDesk
2. https://evidence-desk-chi.valandelon.com
3. https://explorer-studio.genlayer.com/contracts/0x356C408058cb82934eE6f62B14FC85D52858721a
4. Optional: X/YouTube demo clip

## Pitch

**Freeze evidence. Pick criteria. Prove drift — one GenLayer desk for disputes.**
