
## Fix: Live Indicator Not Triggering — Two Root Causes

### Root Cause 1: Wrong field name in the competition mapping (Index.tsx line 570)

The inline competition mapping in `Index.tsx` reads `comp.livestreamLink` from the raw Directus API response. But Directus returns the field as `livelink` (the raw backend name), not `livestreamLink`. So the value is always `undefined`, which falls back to `''`, and the Watch Live button is never active.

```ts
// Index.tsx line 570 — what it currently says (WRONG):
livestreamLink: comp.livestreamLink || '',

// What it should be (reads the actual Directus field name):
livestreamLink: comp.livelink || '',
```

### Root Cause 2: Time string format mismatch

Directus returns **time** fields as `"HH:MM:SS"` (e.g., `"18:30:00"` — with seconds). The current `parseTimeString` regex in `utils.ts` only matches `"HH:MM"` (two-part, no seconds), so it always returns `null` for any time from Directus. When `parseTimeString` returns `null`, `isCurrentlyLive` immediately returns `false`.

```ts
// Current 24h regex — only matches "18:30", NOT "18:30:00":
const match24 = time.match(/^(\d{1,2}):(\d{2})$/);

// Fix — also match "18:30:00" with optional seconds:
const match24 = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
```

### Files to Modify

**1. `src/pages/Index.tsx` — line 570**

Change `comp.livestreamLink` → `comp.livelink` so the raw Directus field is read correctly:

```ts
// BEFORE:
livestreamLink: comp.livestreamLink || '',

// AFTER:
livestreamLink: comp.livelink || '',
```

**2. `src/lib/utils.ts` — the 24-hour regex in `parseTimeString`**

Add optional seconds capture group `(?::\d{2})?` to the 24-hour format pattern:

```ts
// BEFORE:
const match24 = time.match(/^(\d{1,2}):(\d{2})$/);

// AFTER:
const match24 = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
```

Also add optional seconds to the 12-hour format regex for safety:

```ts
// BEFORE:
const match12 = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

// AFTER:
const match12 = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
```

### Why These Were Silent Failures

- The `livelink` → `livestreamLink` mismatch caused no error — JavaScript just read `undefined` and `|| ''` masked it as an empty string
- The time regex mismatch also caused no error — `parseTimeString` returned `null`, `isCurrentlyLive` returned `false`, and everything rendered as non-live with no warning

### Technical Summary

| Bug | File | Line | Fix |
|---|---|---|---|
| Wrong Directus field name | `Index.tsx` | 570 | `comp.livestreamLink` → `comp.livelink` |
| Time regex misses seconds | `utils.ts` | 20 | Add `(?::\d{2})?` to 24h pattern |
| Time regex misses seconds (12h) | `utils.ts` | 10 | Add `(?::\d{2})?` to 12h pattern |
