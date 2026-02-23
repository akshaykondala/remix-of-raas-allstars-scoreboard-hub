

## Calculate Bid Points from Placings Instead of Backend Field

### What Changes

Currently, each team's `bidPoints` comes directly from the Directus `bidpoints` field. This will be replaced with a calculated value derived from actual competition placings: 1st = +4, 2nd = +2, 3rd = +1.

The tiebreaker logic is already implemented in `tiebreakerSort` (lines 275-380 of Index.tsx) and covers tiebreakers 1-4. Tiebreakers 5-7 (standardized scores, bonus points) remain as TODOs since that data isn't available yet.

---

### File: `src/pages/Index.tsx`

**1. Team mapping (line 139)**: After `competitionResults` is built (lines 162-202), sum the `bidPointsEarned` values to produce `bidPoints` instead of reading from the backend:

```ts
// Replace line 139:
bidPoints: Number(team.bidPoints || team.bid_points || team.bidpoints || 0),

// With: calculate after competitionResults is built
bidPoints: 0, // placeholder, will be set below
```

Then after the `competitionResults` IIFE completes, compute bidPoints as the sum of all `bidPointsEarned` from those results. This requires a small refactor: extract `competitionResults` into a variable before spreading it into the team object, then derive `bidPoints` from it.

**2. `calculateBidPoints` function (lines 221-255)**: Change the base from `originalTeam.bidPoints` to recalculating from `competitionResults`. The simulation overlay logic stays the same:

```ts
// Base points = sum of competitionResults bidPointsEarned (not backend field)
const basePoints = (team.competitionResults || [])
  .reduce((sum, r) => sum + r.bidPointsEarned, 0);
pointsMap[team.id] = basePoints;
```

**3. Also recalculate `cumulativeBidPoints`** in the competitionResults (currently left at 0 on line 195). After building the results array, sort by date and compute running totals -- this is already done in `api.ts` but not in the `Index.tsx` mapping. Add the same running-total logic after the `.filter(Boolean).sort(...)` call.

### No other files change

The `TeamCard`, podium, and standings all read `team.bidPoints` which will now reflect the calculated value. The tiebreaker sort already uses `competitionResults` for its logic.

