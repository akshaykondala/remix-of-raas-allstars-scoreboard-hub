
## Root Cause: Directus Returns `time` Field as a Full ISO Datetime Too

Looking at the screenshot carefully: **NJ Naach** (Feb 21) shows `"2026-02-19T14:00:00"` in the time row. This tells us that `comp.time` from Directus is *also* a full ISO datetime string — not just `"HH:MM:SS"`. So the current mapping:

```ts
time: comp.time || (comp.date && comp.date.includes('T') ? comp.date.split('T')[1] : '') || '',
```

…uses `comp.time` as-is because it's truthy, storing `"2026-02-19T14:00:00"` in the `time` field. Then:

- `formatTime("2026-02-19T14:00:00")` — regex `/^(\d{1,2}:\d{2})/` expects a string starting with 1-2 digits then a colon. `"2026"` doesn't match. Returns the full ugly string.
- `parseTimeString("2026-02-19T14:00:00")` in `utils.ts` — neither the 12-hour nor 24-hour regex matches, returns `null`, so `isCurrentlyLive` returns `false` every time.

This explains both bugs simultaneously: same bad value, two downstream failures.

### The Fix — Two Places

**Fix 1: `src/pages/Index.tsx` line 566** — Strip the date prefix from `comp.time` if Directus returns it as a full ISO datetime:

```ts
// BEFORE:
time: comp.time || (comp.date && comp.date.includes('T') ? comp.date.split('T')[1] : '') || '',

// AFTER:
time: (() => {
  const raw = comp.time || (comp.date && comp.date.includes('T') ? comp.date.split('T')[1] : '') || '';
  // If Directus returned "2026-02-19T14:00:00", extract just "14:00:00"
  return raw.includes('T') ? raw.split('T')[1] : raw;
})(),
```

This ensures `time` is always just `"14:00:00"` regardless of what shape Directus returns.

**Fix 2: `src/components/CompetitionDetail.tsx` `formatTime` function** — Add a defensive fallback that handles the ISO case if it ever slips through:

```ts
const formatTime = (time?: string): string => {
  if (!time) return 'TBA';
  // Strip date prefix if Directus returned a full ISO datetime in the time field
  const t = time.includes('T') ? time.split('T')[1] : time;
  const match = t.match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : t;
};
```

### Why the Live Indicator Will Work After This

Once `competition.time` is `"14:00:00"`, `parseTimeString` in `utils.ts` matches the 24-hour regex `/^(\d{1,2}):(\d{2})(?::\d{2})?$/` and correctly extracts `hours=14, minutes=0`. Then `isCurrentlyLive` compares the current time against the 4-hour window (14:00–18:00 CST) and returns `true` — lighting up the LIVE badge everywhere.

### Files to Modify

| File | Change |
|---|---|
| `src/pages/Index.tsx` | Line 566: strip `T` prefix from `comp.time` before storing |
| `src/components/CompetitionDetail.tsx` | `formatTime`: add `T`-prefix guard before regex |
