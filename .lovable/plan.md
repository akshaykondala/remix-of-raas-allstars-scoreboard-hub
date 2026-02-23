

## Fix: Bid Points Missing Because Not All Competitions Are Checked

### Root Cause

The placement matching (comparing team names/IDs against `firstplace`/`secondplace`/`thirdplace`) **works correctly** -- Texas Raas getting 8 points proves this.

The real problem: the code only checks competitions listed in each team's `competitions_attending` junction table. If a team placed at a competition but isn't linked via that relationship, they get zero credit. UTD TaRaas likely competed at 3+ competitions earning 6 points, but only 1 of those competitions appears in its `competitions_attending` data.

### The Fix

Instead of building `competitionResults` from `team.competitions_attending`, build it from **ALL competitions** by checking every competition's `firstplace`/`secondplace`/`thirdplace` against the team.

### Changes (2 files)

**File 1: `src/lib/api.ts`** -- In `fetchTeams()`, replace the `competitionResults` builder (lines 89-132):

- Instead of iterating `team.competitions_attending`, iterate the full `competitionsData` array (already fetched on line 41)
- For each competition, check if `firstplace`/`secondplace`/`thirdplace` matches this team (by id or name)
- Only include competitions where the team actually placed (skip N/A entries)
- Keep the same running-total logic for cumulative bid points

**File 2: `src/pages/Index.tsx`** -- In the team mapping (lines 127-166):

- Same change: iterate `mappedCompetitions` (all competitions) instead of `team.competitions_attending`
- Check each competition's placings against the current team
- Remove the early return on line 128-130 that returns pre-built (incomplete) results from `api.ts`

### Why This Fixes It

A team like UTD TaRaas may have placed 2nd at three different competitions (earning 2+2+2 = 6), but only one of those was linked in `competitions_attending`. By scanning all competitions, every placement is captured and the sums will match the official leaderboard.

### Expected Result

| Points | Team |
|--------|------|
| 8 | Texas Raas |
| 6 | UTD TaRaas |
| 6 | Northeastern NakhRAAS |
| 6 | Purdue Raas |
| 6 | GT Ramblin' Raas |
| 5 | CMU Raasta |
| 4 | UCF KnightRaas |
| 3 | UConn ThundeRaas |
| 3 | UVA HooRaas |
| 2 | RU Raga |
| 2 | TAMU Wreckin' Raas |
| 2 | Cornell Big Red Raas |
| 1 | UMD EntouRaas |
| 1 | UF GatoRaas |
| 1 | Michigan Wolveraas |

### No other changes needed

The tiebreaker sort, podium rendering, standings display, simulation overlay, and cumulative tracking all remain the same -- they just need correct input data.

