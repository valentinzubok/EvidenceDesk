# On-chain extensions (v2 contracts)

Deploy these on Studionet / Asimov before enabling env vars.

## EvidenceDeskFactory

```solidity
function create_desk(string name) returns (address desk);
function list_desks() returns (string[]);
```

Env: `NEXT_PUBLIC_FACTORY_ADDRESS`

## EvidenceSnapshot extensions

```solidity
function batch_open_cases(string batchJson) returns (bool);
```

Client: `batchOpenCases()` in `src/lib/contracts-extended.ts`

## EvidenceDeskRBAC

```solidity
function get_role(address account) returns (uint8); // 0 viewer, 1 moderator, 2 admin
```

Env: `NEXT_PUBLIC_RBAC_ADDRESS`

API: `GET /api/rbac?account=0x…`

Until deployed, the app uses localStorage RBAC demo in the Nav role selector.
