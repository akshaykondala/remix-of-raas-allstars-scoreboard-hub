

## Fix: Future Comps Showing "Competed" + Remove "+0" Points for Non-Placers

Two issues to fix across three files (`src/pages/Index.tsx`, `src/lib/api.ts`, `src/components/TeamDetail.tsx`).

### Issue 1: Future competitions showing "Competed"

Competitions with a date in the future should show as "Upcoming" (not "Competed"). The fix is simple: before assigning `placement = 'Competed'`, check if the competition date is in the future. If so, set `placement = 'Upcoming'` instead.

**Files: `src/pages/Index.tsx` (line ~163) and `src/lib/api.ts` (line ~126)**

In both files, replace:
```
placement = 'Competed';
```
with:
```
const compDate = new Date(competition.date);
const now = new Date();
now.setHours(0, 0, 0, 0);
placement = compDate >= now ? 'Upcoming' : 'Competed';
```

### Issue 2: "+0" points shown for teams that didn't place

In the Season Journey UI, teams that competed but didn't place still see "Points: +0" and "Total: 0 pts", which looks bad. Hide the points row entirely when a team didn't earn any points at that competition.

**File: `src/components/TeamDetail.tsx` (lines ~292-304)**

Wrap the points breakdown in a conditional so it only renders when `earnedPoints` is true:

```
{earnedPoints && (
  <div className="flex items-center gap-3 text-xs">
    ...points and total...
  </div>
)}
```

Also update the styling for "Upcoming" competitions to use a distinct blue/purple look (rather than the grey "Competed" style) so users can visually distinguish future events.

### Summary of Changes

| File | Change |
|------|--------|
| `src/pages/Index.tsx` (~line 163) | Check date before assigning "Competed" vs "Upcoming" |
| `src/lib/api.ts` (~line 126) | Same date check |
| `src/components/TeamDetail.tsx` (~lines 282-304) | Hide points row when 0 points; add "Upcoming" badge style |

