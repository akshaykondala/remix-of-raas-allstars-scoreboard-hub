

## Fix: Nationals Lineup Should Reuse Standings Sort Order

### Insight
You're right — `sortedTeams` is already memoized in `Index.tsx` (line 343) with the full tiebreaker logic. Instead of passing `rankingMap` down and re-sorting inside `CompetitionDetail`, we should just pass the already-sorted team order.

### Plan

**`src/pages/Index.tsx`**:
- Build a `teamSortOrder: Map<string, number>` from `sortedTeams` (team.id → index) via `useMemo`
- Pass `teamSortOrder` to `CompetitionDetail` instead of `rankingMap`

**`src/components/CompetitionDetail.tsx`**:
- Replace `rankingMap` prop with `teamSortOrder: Map<string, number>`
- In `sortedRasLineup`, sort by `teamSortOrder.get(team.id) ?? Infinity` instead of re-running tiebreaker logic
- Remove the `createTeamComparator` import (not needed)

This is a simple prop swap — zero recomputation, just a map lookup per team.

