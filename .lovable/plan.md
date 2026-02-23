

## Fix: Bid Points Always Zero

### Root Cause

The `competitions_attending` array coming from `fetchTeams()` (in `api.ts`) contains **competition names** like `"Raas Chaos"`, because line 69 maps them via `compObj.competitions_id?.name`.

But in `Index.tsx` line 134, the lookup tries to match by **ID**:
```ts
mappedCompetitions.find((c) => String(c.id) === String(compId))
```

Comparing `"1"` (an ID) to `"Raas Chaos"` (a name) never matches, so every team gets zero competition results and zero bid points.

### Fix

**File: `src/pages/Index.tsx`, line 134** -- Also match by competition name:

```ts
const competition = mappedCompetitions.find(
  (c: any) => String(c.id) === String(compId) || c.name === compId
);
```

This single change makes the lookup work whether `competitions_attending` contains IDs or names. Everything downstream (placement detection, `bidPointsEarned`, cumulative totals) is already correct and will start producing real values once competitions are actually found.

### No other files change

The calculation logic, cumulative tracking, and tiebreaker sort are all already correct -- they just never ran because the competition lookup always returned `null`.

