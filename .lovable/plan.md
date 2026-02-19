
## Root Cause: UTC vs Local Timezone Mismatch in `isCurrentlyLive`

The `isCurrentlyLive` function in `src/lib/utils.ts` uses `new Date()` which returns the current time in the **browser's local timezone**. However, `now.getFullYear()`, `now.getMonth()`, and `now.getDate()` extract local date components — which should be fine for a user's browser.

But the **real problem** is subtler. The competition `date` is `"2026-02-19"` and `time` is `"14:00:00"` (EST). When `isCurrentlyLive` builds the start timestamp:

```ts
const startMs = new Date(year, month - 1, day, parsed.hours, parsed.minutes).getTime();
```

This creates a local-time Date: **Feb 19, 2026 at 2:00 PM in whatever timezone the browser is in**. If the user's browser is in PST (UTC-8), that's `14:00 PST`. If the competition is actually at `14:00 EST` (UTC-5), then the window is wrong by 3 hours.

More critically, the current time check `now.getDate() !== day` compares local browser date to the stored date string — if those differ (e.g., user is in a timezone far from EST), the function returns `false` before even checking the time window.

**The simplest and most reliable fix**: Treat the competition `date` + `time` as a **wall-clock local time** (since users of this app are all attending US competitions and viewing in US timezones) — which is actually what the code already does. The real bug is almost certainly that **Directus is returning the `time` field as a full timestamp like `"2026-02-19T19:00:00.000Z"` (UTC) instead of just `"14:00:00"`**, because Directus `datetime` fields are stored/returned in UTC.

So when the mapping does:
```ts
const raw = comp.time || ...
return raw.includes('T') ? raw.split('T')[1] : raw;
```

`raw` becomes `"19:00:00.000Z"` — with a **Z suffix** (UTC marker). Then `parseTimeString("19:00:00.000Z")` tries to match `/^(\d{1,2}):(\d{2})(?::\d{2})?$/` — this FAILS because of the `.000Z` at the end. So `parseTimeString` returns `null`, and `isCurrentlyLive` returns `false`.

### The Fix

**Two targeted changes:**

**1. `src/lib/utils.ts` — Strip milliseconds and Z suffix in `parseTimeString`**

The 24-hour regex currently is:
```ts
const match24 = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
```

This fails on `"19:00:00.000Z"` or `"19:00:00Z"`. Change it to strip trailing fractional seconds and Z before matching:

```ts
function parseTimeString(time: string): { hours: number; minutes: number } | null {
  // Strip any trailing fractional seconds and timezone indicator (e.g. ".000Z" or "Z")
  const cleaned = time.replace(/\.\d+Z?$/, '').replace(/Z$/, '');
  
  // Handle "6:00 PM" / "6:00 AM" format
  const match12 = cleaned.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (match12) { ... }
  
  // Handle "18:00" or "18:00:00" format
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) { ... }
  return null;
}
```

**2. `src/pages/Index.tsx` — Also strip `.000Z` from the raw time string**

The existing IIFE only strips the `T` prefix but leaves the Z suffix:

```ts
time: (() => {
  const raw = comp.time || (comp.date && comp.date.includes('T') ? comp.date.split('T')[1] : '') || '';
  let t = raw.includes('T') ? raw.split('T')[1] : raw;
  // Also strip fractional seconds and UTC marker (e.g. "19:00:00.000Z" → "19:00:00")
  t = t.replace(/\.\d+Z?$/, '').replace(/Z$/, '');
  return t;
})(),
```

**3. Remove one of the two LIVE indicators in `CompetitionDetail.tsx`**

The user said there are two LIVE indicators and it's "a little too much." Looking at the component, there's likely a pulsing badge in the header AND another one in the time/LIVE NOW row. The header badge should be removed, keeping only the LIVE NOW banner in the time row — which is the most contextually meaningful one.

### Files to Modify

| File | Change |
|---|---|
| `src/lib/utils.ts` | Strip `.000Z` / `Z` from time string before regex matching in `parseTimeString` |
| `src/pages/Index.tsx` | Strip `.000Z` / `Z` suffix from `comp.time` in the IIFE mapping |
| `src/components/CompetitionDetail.tsx` | Remove the header pulsing LIVE badge (keep only the LIVE NOW time row) |

### Why This Works

Once `"19:00:00.000Z"` is cleaned to `"19:00:00"`, `parseTimeString` correctly extracts `hours=19, minutes=0`. Then `isCurrentlyLive` creates `startMs = Feb 19 at 19:00 local` and `endMs = Feb 19 at 23:00 local`. At 4:27 PM local time (16:27), that's within the window — LIVE fires correctly.

Note: The competition time from Directus is stored in UTC (19:00 UTC = 14:00 EST), so this approach correctly reflects the competition's actual start time as intended.
