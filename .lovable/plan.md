

# Fix: Competition Teams Undefined, Blank Future Comps, and Leaderboard Filtering

Three bugs were found, two of which were caused by the recent app-store cleanup.

---

## Issue 1 & 2: Teams show as "undefined" when opening a competition from the Comps tab

**Root cause**: When you tap a competition card on the Comps tab, the `CompetitionsTab` component passes the raw competition object straight to `CompetitionDetail` without mapping the lineup through `mapCompetitionTeamsFull`. The raw Directus lineup entries look like `{teams_id: {id: '5', name: 'Texas Raas'}}` -- they do not have a top-level `.name` property, so `team.name` renders as `undefined`.

When you reach the same competition through a team card on the Standings tab, it works because `Index.tsx` line 859 calls `mapCompetitionTeamsFull()` before opening the modal.

This same issue causes future competitions to appear blank -- the lineup names are all undefined, and the simulation dropdowns show "Team [object Object]" or similar broken text.

**Fix**: In `CompetitionsTab.tsx`, when a competition is selected from the timeline (around line 704), run `mapCompetitionTeamsFull(competition, teams)` before setting `selectedCompetition`. This maps the raw junction-table lineup entries into `{id, name}` objects that `CompetitionDetail` expects.

**Files changed**: `src/components/CompetitionsTab.tsx`
- Import `mapCompetitionTeamsFull` from `../lib/competitionMapping`
- In the `onCompetitionClick` callback (line 704), call `mapCompetitionTeamsFull(competition, teams)` and use the result as the selected competition

---

## Issue 3: Teams with 0 bid points should not appear on the Standings tab

**Root cause**: The standings leaderboard renders all teams from `sortedTeams` without filtering out teams that have zero bid points. Teams with 0 points should only appear on the Teams tab.

**Fix**: In `Index.tsx`, filter teams with 0 bid points out of the standings lists. The podium (`topThreeTeams`), qualified section (`qualifiedOtherTeams`), and below-cutoff section (`notQualifiedTeams`) should all be derived from `sortedTeams.filter(t => t.bidPoints > 0)`.

**Files changed**: `src/pages/Index.tsx`
- Around line 829, add a filter: `const rankedTeams = sortedTeams.filter(t => t.bidPoints > 0)`
- Derive `topThreeTeams`, `qualifiedOtherTeams`, and `notQualifiedTeams` from `rankedTeams` instead of `sortedTeams`

---

## Also: Remove dead `fallbackTeams` constant from Index.tsx

The large `fallbackTeams` array (lines 17-475) is no longer referenced anywhere after the previous cleanup but was left behind as dead code. It will be deleted to keep the file clean.

