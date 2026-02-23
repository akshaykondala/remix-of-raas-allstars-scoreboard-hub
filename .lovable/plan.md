

## Fix: Show All Attended Competitions in Season Journey

### Problem

In `src/lib/api.ts` (line 110), the `competitionResults` builder only includes competitions where the team placed 1st, 2nd, or 3rd. If a team attended a competition but didn't place, it's filtered out with `if (placement === 'N/A') return null;`. This means the Season Journey section is incomplete.

### Root Cause

The logic scans all competitions and only keeps those where the team's name/ID matches the `firstplace`, `secondplace`, or `thirdplace` fields. It never checks if the team is in the competition's `lineup` (the attendance list).

### Solution

Update the `competitionResults` builder in `src/lib/api.ts` to also check if the team appears in the competition's `lineup` array. If the team attended but didn't place, include the competition with placement "Competed" and 0 bid points earned.

### Changes

**File: `src/lib/api.ts` (lines ~89-120)**

Update the competition mapping logic:

1. After checking placement fields (1st/2nd/3rd), add a lineup check: scan `competition.lineup` for an entry matching the team's ID or name (handling junction table structures like `{ teams_id: ... }`).
2. If the team placed -- keep existing behavior (1st/2nd/3rd with points).
3. If the team didn't place but IS in the lineup -- include it with placement "Competed" and 0 points.
4. If the team is neither placed nor in the lineup -- skip (return null).

This means the filter condition changes from "skip if no placement" to "skip if no placement AND not in lineup."

The Season Journey UI in `TeamDetail.tsx` already handles `earnedPoints = false` styling gracefully (grey card instead of green), so no UI changes are needed.

