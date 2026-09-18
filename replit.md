# Rakt Kavach National Blood Grid

Rakt Kavach is an installable progressive web app for India's blood network, connecting donors, hospitals, blood banks, laboratories, and public authorities through accountable emergency response and live operational data.

## Run & Operate

- `pnpm --filter @workspace/rakt-kavach run dev` — run the PWA
- `pnpm --filter @workspace/api-server run dev` — run the shared API server
- `pnpm run typecheck` — typecheck every workspace package
- `pnpm run build` — typecheck and build every package
- `pnpm --filter @workspace/api-spec run codegen` — regenerate typed API hooks and Zod schemas from the OpenAPI contract
- `pnpm --filter @workspace/db run push` — apply development schema changes

## Stack

- pnpm workspaces, TypeScript 5.9, React 19, Vite 7
- PWA frontend: `artifacts/rakt-kavach`
- API: Express 5 at `/api`
- Database: PostgreSQL + Drizzle ORM
- Validation and generated client: OpenAPI, Orval, Zod, TanStack Query
- UI: Tailwind CSS, Radix primitives, Framer Motion, Recharts, Lucide

## Where things live

- `artifacts/rakt-kavach/src/App.tsx` — unified route-aware PWA shell and role consoles.
- `artifacts/rakt-kavach/src/index.css` — shared Rakt Kavach visual system and responsive foundations.
- `artifacts/rakt-kavach/public/manifest.webmanifest` — install metadata.
- `artifacts/rakt-kavach/public/sw.js` — progressive offline shell caching.
- `lib/api-spec/openapi.yaml` — source of truth for dashboard, donor, inventory, request, SOS, verification, AI Guardian, audit, and connector contracts.
- `artifacts/api-server/src/routes/blood-grid.ts` — validated API handlers for all network operations.
- `lib/db/src/schema/network.ts` — PostgreSQL schema for facilities, donors, donations, blood units, requests, emergencies, and audit logs.
- `lib/api-client-react/src/generated/` — generated React Query hooks; do not edit by hand.

## Architecture decisions

- The three uploaded codebases are consolidated into one deployable PWA; the feature-rich national-grid surfaces are unified with the generated API/database layer instead of keeping separate donor and command-center apps.
- OpenAPI is the contract boundary. Regenerate hooks and Zod schemas after every contract change before touching callers.
- The UI never invents operational records. Empty states are intentional until a real donor, facility, inventory unit, request, or emergency is written through the API.
- Database-backed queries power all dashboard summaries, inventory views, emergency states, QR verification, audit activity, and AI Guardian signals.
- ABDM and e-RaktKosh are represented as explicit connector boundaries in the API. They report planned/configured state based on environment configuration rather than pretending an external exchange is connected.

## Product

- Gateway and role-aware navigation for donor, hospital, blood-bank, lab, authority, and founder workflows.
- Donor registry, eligibility status, donation history, donor identity, and QR verification.
- Hospital blood requests, live inventory matching, and SOS emergency response.
- Blood-bank inventory intake, status updates, unit timeline, and traceability.
- Lab verification, QR pass verification, facility network visibility, audit activity, and bilingual-ready controls.
- Authority and founder command centers with trend views, network metrics, AI Guardian signals, and integration readiness.

## Gotchas

- The frontend artifact is mounted at `/` and the API at `/api`; generated client URLs already include `/api`.
- The service worker is progressive enhancement. The app remains usable when installation or offline caching is unavailable.
- Do not add seed rows or local mock datasets. Use the API forms to create actual records in the development database.
- `PORT` and `BASE_PATH` are supplied by the managed artifact workflow; do not hardcode them in the Vite config or app code.

## Pointers

- See `.local/skills/react-vite/SKILL.md` for frontend conventions.
- See `.local/skills/pnpm-workspace/SKILL.md` for workspace and backend conventions.