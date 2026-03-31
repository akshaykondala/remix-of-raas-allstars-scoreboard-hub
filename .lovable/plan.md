
Goal: fix why placements entered for the RAAS All Stars competition are not showing correctly in the competition detail page.

What I found
- The issue is in the frontend display logic, not in the standings calculation.
- In `src/components/CompetitionDetail.tsx`, the placings section has a special branch for `isFutureCompetition && competition.ras` that always renders hardcoded “TBD” cards for 1st and 2nd place.
- That means even if `competition.firstplace` and `competition.secondplace` are populated, the RAAS/Nationals-style screen will still show placeholders as long as the event date is still considered future.
- There is also a second mismatch: `getPlacingTeam()` only matches teams by ID, while other parts of the app already support placements stored as either team ID or team name. If Directus saved a team name instead of an ID, the page will fail to resolve the winner.

Implementation plan
1. Update placement resolution in `CompetitionDetail.tsx`
   - Replace the current `getPlacingTeam()` logic with the same flexible matching strategy already used elsewhere:
     - match by exact ID
     - match by exact name
     - optionally normalized name match for safety
   - This keeps competition detail consistent with standings and banner behavior.

2. Fix the RAAS placings rendering branch
   - Change the `isFutureCompetition && competition.ras` branch so it does not always show static TBD cards.
   - Instead:
     - if placements exist, render the actual champion/runner-up cards using the resolved teams
     - if placements are missing, show the current TBD placeholders
   - This preserves the premium RAAS visual treatment while allowing real results to appear immediately.

3. Keep current non-RAAS behavior intact
   - Do not change the normal future-competition prediction flow for non-RAS events.
   - Do not alter leaderboard sorting or bid point logic unless needed.

4. Verify related edge cases
   - Confirm 3rd place still only appears when lineup size > 6.
   - Confirm RAAS/Nationals competitions still use their special styling.
   - Confirm clicks on resolved placed teams still open the team detail modal.

Technical details
- Main file to update: `src/components/CompetitionDetail.tsx`
- Root causes:
  - hardcoded future-RAS placeholder UI overrides real placements
  - team lookup only supports IDs, but backend data may contain names
- No backend/database change appears necessary based on the current code.

Expected result
- When you enter 1st/2nd place for RAAS All Stars, the competition page will show the actual placed teams instead of staying on TBD.
- If placements are empty, it will still show the styled placeholder state.
