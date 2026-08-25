# evidence-desk-sdk

Read-only HTTP client for [Evidence Desk](https://evidence-desk-chi.valandelon.com) API routes.

```typescript
import { createClient } from "evidence-desk-sdk";

const client = createClient("https://evidence-desk-chi.valandelon.com");
const summary = await client.getSummary();
const page = await client.listCases(null, 20);
```

Build from monorepo root: `cd packages/evidence-desk-sdk && npm run build`
