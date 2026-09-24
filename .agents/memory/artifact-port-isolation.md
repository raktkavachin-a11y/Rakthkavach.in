---
name: Artifact port isolation
description: Replit artifact services must not share a global PORT override when they use separate managed local ports.
---

Each managed artifact service should declare its own local port and service-level `PORT`; avoid setting a shared workspace `PORT` that overrides those values.

**Why:** A shared `PORT` made the main web app and the mockup preview compete for port 3000, causing the preview server to auto-fallback and making workflow behavior unreliable.

**How to apply:** When adding or changing an artifact workflow, keep the Vite fallback for standalone local runs, but use distinct managed service ports and remove any workspace-wide `PORT` override.