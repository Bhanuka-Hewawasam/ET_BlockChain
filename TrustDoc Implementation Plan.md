# TrustDoc Implementation Plan

## Product scope
TrustDoc is an English-language student prototype for government document verification. It demonstrates a secure-feeling admin workflow and a public verification workflow using cryptographic hashing, QR-style verification references, cloud-ready records, and a clearly labelled blockchain-inspired simulated ledger.

## Design direction
- Option A (0.06): Civic command center — dark navy, mint signal green, compact data panels.
- Option B (0.08): Paper-to-digital editorial — warm white, cobalt accents, document-centric cards.
- Option C (0.04): Security operations console — charcoal, amber, neon status colors.

Chosen: **Civic command center**. The interface uses a quiet navy shell with a warm paper workspace, mint as the TrustDoc signature color, and compact evidence panels. The layout uses a left navigation rail and an asymmetric dashboard canvas rather than a generic centered grid. Interactions are direct: every action produces visible evidence such as a hash, verification result, status badge, or ledger entry. Typography is a modern sans with strong numeric hierarchy. Brand voice is concise and reassuring: “Verify before you trust.” and “Every document leaves an evidence trail.”

## Implementation approach
- React/Tailwind single-page prototype in `client/src/pages/Home.tsx`.
- Client-side SHA-256 hashing with Web Crypto API for selected files; a deterministic fallback for demo metadata.
- Local demo records and state transitions so the app is useful even without seeded database rows.
- Simulated ledger entries are linked by previous-hash fields and prominently labelled as prototype-only.
- QR-style visual is generated from a verification URL/reference in the UI for presentation purposes.
- `public/manus-routes.json` declares `/`, `/verify`, `/history`, and `/upload`.

## Project structure
- `client/src/App.tsx`: application shell and route registration.
- `client/src/pages/Home.tsx`: dashboard, upload, verification, history, and ledger views.
- `client/src/index.css`: civic command center visual system and responsive layout.
- `public/manus-routes.json`: route manifest.
- `plan.md` and `TODO.md`: implementation record.
