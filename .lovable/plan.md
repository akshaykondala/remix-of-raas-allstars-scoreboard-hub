

## Fix: Hide Rank Badge for Unranked Teams in Competition Lineup

### Problem
In regular competition lineups, every team gets a `#rank` badge because `teamSortOrder` contains all teams (even those with 0 bid points). Unranked teams should show no rank badge.

### Change
**`src/components/CompetitionDetail.tsx`** — Line 270: Change rank assignment to only set a rank when the team has bid points > 0:

```
const rank = (sortIdx !== undefined && fullTeam?.bidPoints > 0) ? sortIdx + 1 : undefined;
```

This ensures only teams with actual standings points display a rank number in regular competition lineups. Teams with 0 bid points will have `rank = undefined` and the badge (lines 546-550) won't render.

