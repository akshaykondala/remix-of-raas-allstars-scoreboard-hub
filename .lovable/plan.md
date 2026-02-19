
## Root Cause — Definitively Identified

The app running at `localhost:8080` **does** have Directus configured, so it uses the **`CompetitionsTab.tsx` fetch path**, not `Index.tsx`. This path calls `fetchFromDirectus('competitions')` then `mapCompetitionTeamsFull(item, teams)`.

`mapCompetitionTeamsFull` in `src/lib/competitionMapping.ts` does a simple `...competition` spread — it **never touches the `time` field**. So the raw Directus value `"2026-02-19T19:00:00.000Z"` is stored as-is in `competition.time`.

When `isCurrentlyLive` is called in `CompetitionDetail.tsx` with this value, it calls `parseTimeString("2026-02-19T19:00:00.000Z")`. The current cleanup strips `.000Z` → giving `"2026-02-19T19:00:00"`, but the **`T`-prefixed date portion is still there**. The 24-hour regex `/^(\d{1,2}):(\d{2})/` fails on a string starting with `"2026"`. So `parseTimeString` returns `null` → `isCurrentlyLive` returns `false`. LIVE never fires.

The previous fix to `Index.tsx` was correct but **only applies to the `Index.tsx` fetch path** (used when Directus is not configured). The `CompetitionsTab.tsx` path was never touched.

---

## Exact Files to Change

### 1. `src/lib/competitionMapping.ts` — sanitize `time` on spread

Add a helper that strips the full date prefix and UTC markers from the raw Directus `time` field, then apply it in the returned object:

```ts
// Before:
return {
  ...competition,
  logo: logoUrl,
  lineup: mappedLineup,
  ...
};

// After:
const sanitizeTime = (raw?: string): string => {
  if (!raw) return '';
  // Strip "2026-02-19T" prefix if Directus returned a full ISO datetime
  const t = raw.includes('T') ? raw.split('T')[1] : raw;
  // Strip fractional seconds and UTC marker e.g. ".000Z" or "Z"
  return t.replace(/\.\d+Z?$/, '').replace(/Z$/, '');
};

return {
  ...competition,
  time: sanitizeTime(competition.time),
  logo: logoUrl,
  lineup: mappedLineup,
  ...
};
```

### 2. `src/lib/utils.ts` — add `T`-prefix guard in `parseTimeString` as safety net

Even after the mapping fix, add a one-liner guard at the top of `parseTimeString` so any raw ISO string that slips through is handled:

```ts
function parseTimeString(time: string) {
  // If a full ISO datetime was passed (e.g. "2026-02-19T19:00:00.000Z"), extract just the time part
  const timeOnly = time.includes('T') ? time.split('T')[1] : time;
  const cleaned = timeOnly.replace(/\.\d+Z?$/, '').replace(/Z$/, '');
  // ... rest of existing logic using `cleaned`
}
```

### 3. Remove the duplicate LIVE indicator

The user said "do away with one of the live indicators." Looking at the screenshot and the code, there is still a "Live Now" text in the header subtitle (line 275 in `CompetitionDetail.tsx`):
```tsx
{isLive ? 'Live Now' : isFutureCompetition ? 'Upcoming' : 'Completed'}
```
This is **separate from** the LIVE NOW banner in the time row. The header badge was already removed in the last diff. The remaining duplication is between:
- The status text in the header subtitle (`"Live Now"`)  
- The LIVE NOW banner in the time row

The time row banner is more impactful and functional (it also links to the livestream). The header subtitle should just stay as the small status label it is — that's not "too much." Re-reading the user's screenshot: the **competition card on the timeline** also has a `LIVE` badge (top-right corner of the card, `CompetitionTimeline.tsx` line 246-251). That badge + the LIVE NOW row inside the detail drawer = two indicators. Remove the card badge from `CompetitionTimeline.tsx`, keep only the immersive LIVE NOW row inside the drawer.

---

## Summary

| File | Change |
|---|---|
| `src/lib/competitionMapping.ts` | Add `sanitizeTime` helper, apply to `time` field in returned object |
| `src/lib/utils.ts` | Add `T`-prefix guard at top of `parseTimeString` |
| `src/components/CompetitionTimeline.tsx` | Remove the small `LIVE` badge from the timeline card (keep LIVE NOW in the drawer) |

This is **3 surgical changes** — no rewriting of fetch logic, no duplicating mapping code.
