# Quickstart

Get Evidence Desk running locally in under 5 minutes.

## 1. Clone & install

```bash
git clone https://github.com/valentinzubok/EvidenceDesk.git
cd EvidenceDesk
npm install
```

## 2. Environment

Copy the example env file (Studionet defaults are already set):

```bash
cp .env.example .env.local
```

| Variable                       | Purpose                       |
| ------------------------------ | ----------------------------- |
| `NEXT_PUBLIC_SNAPSHOT_ADDRESS` | EvidenceSnapshot on Studionet |
| `NEXT_PUBLIC_REGISTRY_ADDRESS` | PromptRegistry on Studionet   |

You only need custom values if you deployed your own contracts.

## 3. Run dev server

```bash
npm run dev
```

Open **http://localhost:3000**

## 4. Explore without wallet

1. **Home** — workflow overview, FAQ, theme toggle (☀/☾)
2. **Cases** — browse on-chain cases (read-only)
3. **Criteria** — top templates with card previews

## 5. Connect MetaMask (writes)

1. Install [MetaMask](https://metamask.io/download/)
2. Click **Connect Wallet** in the header
3. Approve Studionet — genlayer-js switches the network automatically
4. On **Cases** → **Open case wizard** → add HTTPS URLs → submit
5. Run **Cross-check** on an existing case

## 6. Favorites & recent

- Click **☆** next to a case to add to favorites
- Opening a case adds it to **Recent**
- Data lives in `localStorage` (keys under `evidence-desk:*`)
- Validate IDs against chain: `GET /api/history?ids=case-a,case-b`

## 7. API (read-only)

| Endpoint                   | Description                             |
| -------------------------- | --------------------------------------- |
| `GET /api/cases`           | All case IDs from EvidenceSnapshot      |
| `GET /api/history?ids=a,b` | Which client history IDs exist on-chain |

See [openapi.yaml](./openapi.yaml) for the full contract surface.

## 8. Quality checks

```bash
npm run lint      # ESLint
npm test          # Vitest unit tests
npm run build     # Production build
```

CI runs the same steps on every push (see `.github/workflows/ci.yml`).

## 9. Deploy

[![Live demo](https://img.shields.io/badge/Live-evidence--desk--chi.valandelon.com-0ea5a0)](https://evidence-desk-chi.valandelon.com)

```bash
npm run build
vercel deploy --prod
```

Set env vars in Vercel project settings to match `.env.example`.

## Troubleshooting

| Symptom                | Fix                                       |
| ---------------------- | ----------------------------------------- |
| 🦊 MetaMask not found  | Install extension, refresh page           |
| ⚡ Network mismatch    | Reconnect wallet; Studionet auto-connects |
| ❌ Could not load data | Check Studionet RPC / contract addresses  |
| Transaction rejected   | User cancelled in MetaMask — retry        |

Unified error toasts show 🦊 / ⚡ / ❌ prefixes via `useErrorToast()`.
