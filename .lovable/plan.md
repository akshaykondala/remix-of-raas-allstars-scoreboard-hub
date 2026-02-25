

## Fix Season Journey Accuracy + Tiebreaker Logic

### Issue 1: Season Journey Shows Wrong Competitions

**Root Cause**: The code has TWO checks to decide if a team belongs in a competition -- `inLineup` (checks the competition's roster) and `inAttending` (checks the team's `competitions_attending` M2M field). The `competitions_attending` relationship in the database can contain stale or incorrect entries, causing teams to appear in competitions they are NOT actually rostered for.

**Additionally**, the `competitions_attending` data is pre-flattened to name strings by `fetchTeams()`, but the `inAttending` check in `Index.tsx` tries to parse it as junction objects, leading to unreliable string-to-name comparisons like `compId === competition.name`.

**Fix**: For season journey, a team should appear in a competition ONLY if:
- They placed (1st/2nd/3rd) -- already handled, OR
- They are in that competition's **lineup** (the actual roster)

Remove the `inAttending` check entirely from both `src/pages/Index.tsx` and `src/lib/api.ts`. The lineup is the source of truth for roster membership.

### Issue 2: Tiebreaker Logic Incorrect

**Problems**:
1. Tiebreaker uses ALL competition results (including non-bid and upcoming competitions) instead of only **completed Bid Competitions**
2. The denominator for "ratio of placings to attended Bid Competitions" uses `Math.max(competitionResults.length, competitions_attending.length)` -- completely wrong per the rules

**Fix**: Filter competition results to only include entries where:
- `isBidCompetition === true` (the competition has `bid_status: true`)
- `placement !== 'Upcoming'` (only completed competitions)

Then apply all tiebreakers using only that filtered set.

### Changes

**File: `src/pages/Index.tsx`**

1. **Lines 149-162** -- Remove the `inAttending` check. Keep only `inLineup`:
```typescript
if (placement === 'N/A') {
  const inLineup = Array.isArray(competition.lineup) && competition.lineup.some((entry: any) => {
    const entryTeamId = entry?.teams_id?.id ?? entry?.teams_id ?? entry?.id ?? entry;
    return String(entryTeamId) === teamId ||
           (entry?.teams_id?.name && entry.teams_id.name === teamName);
  });

  if (!inLineup) return null;
  // ... date check for Upcoming vs Competed
}
```

2. **Lines 170-177** -- Add `isBidCompetition` flag to each result entry:
```typescript
return {
  ...existing fields,
  isBidCompetition: competition.bid_status === true
};
```

3. **Lines 304-370** -- Rewrite tiebreaker to filter by completed bid competitions only:
```typescript
// Filter to completed bid competitions only
const aBidResults = aCompetitionResults.filter(
  r => r.isBidCompetition && r.placement !== 'Upcoming'
);
const bBidResults = bCompetitionResults.filter(
  r => r.isBidCompetition && r.placement !== 'Upcoming'
);

// TIEBREAKER 1: Ratio of placings to attended Bid Competitions
const aPlacings = aBidResults.filter(r => ['1st','2nd','3rd'].includes(r.placement)).length;
const bPlacings = bBidResults.filter(r => ['1st','2nd','3rd'].includes(r.placement)).length;
const aRatio = aBidResults.length > 0 ? aPlacings / aBidResults.length : 0;
const bRatio = bBidResults.length > 0 ? bPlacings / bBidResults.length : 0;
// ... then use aBidResults/bBidResults for all subsequent tiebreakers
```

**File: `src/lib/api.ts`**

4. **Lines 110-125** -- Same fix: remove `inAttending`, keep only `inLineup` for consistency.

**File: `src/lib/types.ts`**

5. Add `isBidCompetition?: boolean` to the `competitionResults` type.

### Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove `inAttending` check; add `isBidCompetition` flag; fix tiebreaker to use only completed bid competitions |
| `src/lib/api.ts` | Remove `inAttending` check; add `isBidCompetition` flag |
| `src/lib/types.ts` | Add `isBidCompetition` field to competitionResults type |

