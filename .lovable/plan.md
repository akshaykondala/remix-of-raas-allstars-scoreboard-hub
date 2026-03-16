

## Sort Nationals Lineup by Standings, Show Bid Points, Remove Predictions

### Changes to `src/components/CompetitionDetail.tsx`

**1. Sort nationals lineup by bid points (descending)**
In the RAS lineup rendering block (~lines 488-531), sort the lineup teams using the `teams` array to look up each team's `bidPoints`. Sort descending so the highest-ranked team appears first. The displayed number (1-9) will reflect final standings order.

**2. Replace `#{rank}` badge with bid points display**
Replace the leaderboard rank badge (lines 523-527, showing `#{rank}`) with the team's bid points count. Change text from `#{rank}` to something like `42 pts` with the same amber styling.

**3. Remove prediction UI for RAS competitions**
In the "Top Placings" section (lines 589-597), wrap the `isFutureCompetition` prediction dropdowns branch in an additional `!competition.ras` check. When it's a RAS competition and future, show a simple "Results TBD" placeholder instead of the simulation dropdowns and save button.

### Files Changed
- `src/components/CompetitionDetail.tsx`

