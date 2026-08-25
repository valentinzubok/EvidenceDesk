# Criteria templates

Evidence Desk reads templates from [PromptRegistry](https://github.com/valentinzubok/PromptRegistry) on Studionet. Each template is a reusable **criteria body** — natural-language rules for evaluating evidence drift.

## How to use in the app

1. Open **Criteria** in the nav
2. Browse cards (preview loaded via `get_body`)
3. Click a template → full body appears on the right
4. **Copy** to clipboard → paste into your dispute workflow or LLM prompt

Sort by **score** (community rating) or **uses** (adoption). Filter by **tag** when available.

## Example template shapes

### 1. URL content unchanged

```markdown
# Criteria: URL content match

Given a frozen content hash and a live fetch of the same URL:

- PASS if SHA-256 of live body equals the frozen hash
- FAIL if hash differs or fetch returns 4xx/5xx
- Note redirects; follow up to 3 hops
```

**Use case:** Prove a Terms-of-Service page was not altered after agreement.

### 2. Timestamp window

```markdown
# Criteria: Publication date

The evidence URL must contain a visible publication date within ±24h of the case open timestamp.
Ignore footer copyright years unless explicitly labeled "Published".
```

**Use case:** News articles cited in arbitration.

### 3. Structured field presence

```markdown
# Criteria: Required fields

JSON response must include: `price`, `currency`, `validUntil`.
All three fields must be non-null strings or numbers.
```

**Use case:** API snapshot disputes (pricing APIs, rate feeds).

### 4. Cross-check alignment

Pair with EvidenceSnapshot **cross_check**:

```markdown
# Criteria: Cross-network hash

After cross_check, all chain-reported hashes for item index 0 must match the primary Studionet hash.
Flag tampered=true if any mismatch.
```

**Use case:** Multi-source evidence bundles.

## Visual preview in UI

The Criteria page renders a **card preview** (first ~120 chars, markdown stripped) for the top templates:

```
┌─────────────────────────────────────┐
│  Terms unchanged v2          ★ 4.2 │
│  uses: 18 · tags: legal, url        │
│  Given a frozen content hash and…   │
└─────────────────────────────────────┘
```

Full body loads on selection — same text you get from `get_body(templateId)` on-chain.

## Register your own template

Deploy or use PromptRegistry:

```bash
# Conceptual — see PromptRegistry repo for CLI
registry register --title "My criteria" --body ./criteria.md --tags dispute,url
```

After indexing, it appears in **top** queries and in Evidence Desk within minutes.

## Related

- [OpenAPI](./openapi.yaml) — `GET /registry/top`, `get_body`
- [Architecture](./ARCHITECTURE.md) — why previews are client-side
- Live app: https://evidence-desk-chi.valandelon.com/criteria
