
## Show Leaderboard Position in Competition Lineup

When viewing a competition's lineup, teams that have bid points will now display their current leaderboard rank as a small badge next to their name.

### What Changes

**File: `src/components/CompetitionDetail.tsx` (lines ~502-516)**

In the lineup grid where each team row is rendered:

1. Before the lineup map, compute a sorted leaderboard from the `teams` prop:
   - Filter to teams with `bidPoints > 0`
   - Sort by `bidPoints` descending (using existing tiebreaker logic conventions)
   - Create a rank map: `{ teamId -> rank number }`

2. Inside each team row, after the team name `<span>`, check if the team has a rank in the map. If so, render a small pill/badge like:
   - `#3` in a subtle purple/blue badge
   - Positioned at the right side of the row

This keeps the lineup clean while giving users a quick glance at where each team stands in the overall standings.

### Visual Result

```text
  Competition Lineup
  +------------------------------------------+
  |  [logo] Texas Raas                   #1  |
  |  [logo] CMU Raasta                   #3  |
  |  [logo] Some New Team                    |  <-- no badge (0 pts)
  |  [logo] UF Gatoraas                  #2  |
  +------------------------------------------+
```

### Files Modified
- `src/components/CompetitionDetail.tsx` -- add rank computation + badge in lineup rows
