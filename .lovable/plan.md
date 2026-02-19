
## Fix: Display Time in Clean HH:MM Format

### The Problem

Directus returns the `time` field as `"HH:MM:SS"` (e.g., `"18:30:00"`). The app renders `{competition.time}` raw in 4 places inside `CompetitionDetail.tsx`, which means users see `"18:30:00"` — the ugly full format with seconds.

### The Fix

Add a `formatTime` helper function inside `CompetitionDetail.tsx` that trims the time string down to just `"HH:MM"`, and pipe every time display through it.

```ts
const formatTime = (time?: string): string => {
  if (!time) return 'TBA';
  // Strip seconds from "HH:MM:SS" → "HH:MM"
  const match = time.match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : time;
};
```

This handles:
- `"18:30:00"` → `"18:30"`
- `"18:30"` → `"18:30"` (already clean, no change)
- `"6:00 PM"` → `"6:00"` (edge case — strips the AM/PM and seconds, leaving clean HH:MM)
- `undefined` → `"TBA"`

### The 4 Places to Update in `CompetitionDetail.tsx`

| Line | Current | After |
|---|---|---|
| 290 | `{competition.time} · Watch Live →` | `{formatTime(competition.time)} · Watch Live →` |
| 303 | `{competition.time} · {competition.timezone...}` | `{formatTime(competition.time)} · {competition.timezone...}` |
| 319 | `{competition.time \|\| 'TBA'}` | `{formatTime(competition.time)}` |
| 334 | `{competition.time \|\| 'TBA'}` | `{formatTime(competition.time)}` |

### Files to Modify

- **`src/components/CompetitionDetail.tsx`** — Add `formatTime` helper and replace all 4 raw `{competition.time}` display usages with `{formatTime(competition.time)}`

That's the only file that needs to change. The `isCurrentlyLive` logic in `utils.ts` already handles the full `"HH:MM:SS"` format correctly for the live detection — we don't touch that.
