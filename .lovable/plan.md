
## Fix: Bid Points Not Matching Official Leaderboard

### Root Cause

There are **two** placement-matching locations that both fail because `competition.firstplace`/`secondplace`/`thirdplace` from Directus likely contain **team names** (e.g., "Texas Raas"), but the code compares them against `team.id` (a UUID like `"abc-123-..."`). The comparison always fails, so every team gets 0 points.

Worse, the fix in `api.ts` takes priority: it pre-builds `competitionResults` on the team objects, and `Index.tsx` line 128 returns those pre-built results immediately -- so the Index.tsx matching logic never even runs.

### Expected Result (Official Leaderboard)

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

### Fix (2 files)

**File 1: `src/lib/api.ts` (lines 102-110)**

Add name-based matching alongside ID matching for all three placements:

```ts
if (competition.firstplace === team.id || competition.firstplace === team.name) {
  placement = '1st';
  pointsEarned = 4;
} else if (competition.secondplace === team.id || competition.secondplace === team.name) {
  placement = '2nd';
  pointsEarned = 2;
} else if (competition.thirdplace === team.id || competition.thirdplace === team.name) {
  placement = '3rd';
  pointsEarned = 1;
}
```

This is the primary fix since `api.ts` is the first code that builds `competitionResults`.

**File 2: `src/pages/Index.tsx` (lines 140-148)**

Apply the same fix as a safety net for the secondary mapping path:

```ts
const teamId = String(team.id);
const teamName = team.name;

if (String(competition.firstplace) === teamId || competition.firstplace === teamName) {
  placement = '1st';
  pointsEarned = 4;
} else if (String(competition.secondplace) === teamId || competition.secondplace === teamName) {
  placement = '2nd';
  pointsEarned = 2;
} else if (String(competition.thirdplace) === teamId || competition.thirdplace === teamName) {
  placement = '3rd';
  pointsEarned = 1;
}
```

### Why This Will Match the Official Leaderboard

The calculation logic (1st = +4, 2nd = +2, 3rd = +1, summed across all competitions) is already correct. The only problem was that the placement comparisons always returned false because they compared UUIDs to team names. Once the matching works, the sums will produce the correct totals.

### No other changes needed

The tiebreaker sort, podium rendering, standings display, and cumulative tracking are all already implemented correctly -- they just never received non-zero values.
