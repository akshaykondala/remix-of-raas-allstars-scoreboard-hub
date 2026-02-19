
## Fix: Date Display Shows Full ISO String + Live Indicator Still Broken

### The Single Root Cause

Directus is returning the `date` field as a full ISO datetime string: `"2026-02-19T14:00:00"` — not just `"2026-02-19"` as expected.

This one fact causes both problems:

**Problem 1 — Date displays as `"2026-02-19T14:00:00"`**

`formatDate` in `CompetitionDetail.tsx` does `dateString.split('-').map(Number)` which gives `[2026, '02', '19T14:00:00']`. The third element `'19T14:00:00'` parses as `19` via `Number()` (JavaScript ignores trailing text), so the date itself renders correctly — but anywhere `competition.date` is rendered raw in the UI (like in the timeline date labels or card subtitle), it shows the full ugly string.

**Problem 2 — Live indicator never triggers**

In `isCurrentlyLive` (`utils.ts`), the date is split: `date.split('-')` on `"2026-02-19T14:00:00"` gives `["2026", "02", "19T14:00:00"]`. Then `.map(Number)` gives `[2026, 2, 19]` (the `T14:00:00` is stripped by `Number()`), so the date comparison actually passes. 

But then `time` is `""` (empty string) — because in `Index.tsx` line 566, `time: comp.time || ''` — if Directus stores the time embedded inside the date field only (and `comp.time` is null/undefined), then `time` is always empty string, making `isCurrentlyLive` return `false` immediately at the `if (!date || !time) return false` guard.

### The Fix — One File, Two Lines

In `src/pages/Index.tsx`, in the competition mapping (around line 552-566):

**Line 552 — Strip the time component from date:**
```ts
// BEFORE:
date: comp.date,

// AFTER:
date: comp.date ? comp.date.split('T')[0] : comp.date,
```

**Line 566 — Extract time from the date field if `comp.time` is empty:**
```ts
// BEFORE:
time: comp.time || '',

// AFTER:
time: comp.time || (comp.date && comp.date.includes('T') ? comp.date.split('T')[1] : '') || '',
```

This extracts `"14:00:00"` from `"2026-02-19T14:00:00"` as a fallback when `comp.time` is empty. The existing `parseTimeString` regex in `utils.ts` already handles `"HH:MM:SS"` format (with the `(?::\d{2})?` fix applied earlier), so `isCurrentlyLive` will now correctly parse it.

### Why No Other Files Need to Change

- `utils.ts` — `parseTimeString` already handles `HH:MM:SS` ✓
- `CompetitionDetail.tsx` — `formatDate` already manually splits by `-` so `"2026-02-19"` (after fix) works fine; `formatTime` already strips seconds ✓  
- `CompetitionTimeline.tsx` — `groupByWeekend` already does `comp.date.split('T')[0]` to extract the date key ✓

### Technical Summary

| Problem | Root Cause | File | Fix |
|---|---|---|---|
| Date shows as `"2026-02-19T14:00:00"` | Raw ISO string passed through mapping | `Index.tsx` line 552 | Strip `T` suffix: `comp.date.split('T')[0]` |
| Live indicator never fires | `comp.time` is empty; time is embedded in date string | `Index.tsx` line 566 | Extract time from date ISO string as fallback |
