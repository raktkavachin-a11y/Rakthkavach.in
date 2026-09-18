---
name: API contract and browser types
description: Durable workspace guidance for generated API clients and typed browser response helpers.
---

Keep `dom.iterable` enabled for the shared TypeScript libraries that compile generated fetch clients; Orval's header parsing uses `Headers.entries()`, which is not included by `dom` alone.

**Why:** The first contract regeneration completed successfully but the workspace library build failed until the iterable DOM typings were included.

**How to apply:** When regenerating `lib/api-client-react` or changing the shared TypeScript base, preserve both `dom` and `dom.iterable` in the client compiler configuration.