# Backend architecture and delivery plan

## Decision

Build a test-driven modular FastAPI application with PostgreSQL, SQLAlchemy,
and Alembic. Keep application code under `backend/app`, tests under
`backend/tests`, and migrations under `backend/migrations`. PocketBase remains
the existing frontend's compatibility backend until an explicit cutover.
Do not add new product features to PocketBase or dual-write business records.

Use Python 3.12 for the initial CI baseline. Introduce dependencies when the
implementing branch needs them. No additional broker or cache service initially.

## Contracts

- Business routes use `/api/v1`; `/health` remains a public liveness endpoint.
- Readiness will check PostgreSQL once database integration exists.
- Errors use `error.code`, `error.message`, and `error.request_id`.
- Lists use `limit` (default 25, maximum 100) and `offset`, with explicit filter
  and sort allowlists. Responses contain `items`, `total`, `limit`, and `offset`.
- Persist UTC timestamps and decimal money with explicit currency. Serialize
  money as decimal strings. Do not add amounts across currencies implicitly.
- Use explicit workflow transitions and optimistic version checks for edits.
- Sensitive repeated writes use an organization-scoped idempotency key and
  persisted request fingerprint; conflicting reuse returns 409.

## Identity and isolation

Use opaque server-side sessions with hashed random tokens, expiry, revocation,
and secure HttpOnly cookies in production. Enforce CSRF on unsafe authenticated
browser requests. Hash passwords with Argon2id. Reset and verification tokens
are single-use, hashed, and expire. Resetting a password revokes sessions.

Every business record belongs to an organization. Resolve membership from the
authenticated user; never trust a submitted owner or role. Validate related
records against the same organization. Return 404 for inaccessible records.

| Role | Intended permissions |
| --- | --- |
| Owner | Organization settings, membership, all business actions |
| Admin | Membership except ownership transfer, all business actions |
| Operations | Customers, orders, documents, shipments |
| Compliance reviewer | Read trade documents and record compliance decisions |
| Finance | Read orders and manage invoices/payment records |
| Viewer | Read business records; no writes |

Only owners transfer ownership; never remove the last owner. Invitations cannot
grant privileges beyond the inviter's authority. Audit critical changes in the
same transaction as the business write. Audit access is owner/admin only.

## Data outline

Identity: users, organizations, memberships, invitations, sessions, verification
tokens. Trade: customers, orders, order_items, documents, document_versions,
extractions, comparisons, compliance_reviews, findings, shipments, shipment_events.
Finance: invoices, invoice_items, payments, payment_allocations, reversals.
Operations: jobs, email deliveries, notifications, enquiries, audit_events.

Use foreign keys, organization-scoped business identifier uniqueness, and
indexes based on actual queries. Preserve issued invoices and payment history.
Private files are accessed through authorized downloads, with bounded uploads,
safe storage identifiers, and versioned metadata. Production processing requires
quarantine/scanning. Retention periods and permitted file types must be specified
in the document branch before enabling uploads.

Jobs live in PostgreSQL and are claimed atomically by a worker from this backend.
Use leases, bounded retries, restart recovery, and idempotent processing. Provider
calls have timeouts and are replaced with fakes in automated tests.

Cache only measured expensive reads or reference data. Bound size and lifetime;
include organization, permission scope, and filters in keys. Invalidate after
commit. Never cache authorization/session validity. A process-local cache is not
a shared rate limiter or a cross-worker invalidation mechanism.

## Delivery order and branches

Each row is a separate reviewable branch. Until predecessors merge, dependent
branches are stacked on the previous branch and PRs must target that predecessor.
After merging, retarget the next PR to main. Do not merge or publish implicitly.

| Order | Branch | Acceptance focus |
| --- | --- | --- |
| 1 | docs/backend-architecture | Architecture, permissions, rollout contract |
| 2 | test/backend-foundation | Isolated clients, factory, deterministic CI |
| 3 | feat/backend-core | Validated settings, errors, request IDs, CORS |
| 4 | feat/backend-database | PostgreSQL, migrations, constraints, rollback tests |
| 5 | feat/backend-auth | Sessions, hashing, CSRF, revocation tests |
| 6 | feat/backend-account-security | Verification/reset, delivery retries |
| 7 | feat/backend-organizations-rbac | Tenant isolation and role matrix tests |
| 8 | feat/backend-request-protection | Rate limits, hosts, sizes, redacted logs |
| 9 | feat/backend-orders | Customers, items, transitions, concurrent edits |
| 10 | feat/backend-documents | Private versioned files and failure cleanup |
| 11 | feat/backend-jobs | Claiming, leases, retries, crash recovery |
| 12 | feat/backend-extraction | Validated provider output, human acceptance |
| 13 | feat/backend-document-comparison | Version-specific findings and resolution |
| 14 | feat/backend-compliance | Versioned checks, evidence, decisions |
| 15 | feat/backend-shipments | Milestones and ordered/idempotent events |
| 16 | feat/backend-finance | Invoices, allocations, balances, reversals |
| 17 | feat/backend-analytics-cache | Correct aggregates, isolated cache keys |
| 18 | feat/backend-enquiries-notifications | Public enquiry abuse controls, audit access |
| 19 | feat/backend-pocketbase-cutover | Repeatable imports, frontend integration |
| 20 | chore/backend-production-readiness | Readiness, backups/restores, deploy checks |

For each behavior: write a test, observe the expected failure, implement, rerun,
refactor, and document evidence. Protected API tests cover unauthenticated access,
roles, cross-organization IDs, invalid input, and meaningful concurrency cases.
Database integration tests use dedicated PostgreSQL, not SQLite substitutes.

## Cutover and release

Inventory PocketBase records/files and map IDs before importing. Rehearse imports
and compare counts, ownership, and relationships. Preserve password hashes only
if compatibility is demonstrated; otherwise require resets. Freeze legacy writes
for final import, change the frontend API/auth client, verify end-to-end flows,
and retain a restore/rollback procedure. Never delete legacy data automatically.

Before production choose email/extraction/carrier providers, compliance coverage
and authoritative rule sources, deployment origins, storage/retention policy,
and whether MFA is mandatory. Payment recording does not initiate money movement.
Release requires tested database and file restoration, secrets injection, HTTPS,
trusted proxy configuration, representative load checks, and operational alerts.
