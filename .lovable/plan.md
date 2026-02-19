

## Fix Missing Backend Field Connections

There are two root problems causing backend fields to not show up in the app:

### Problem 1: Competition fields dropped in Index.tsx

In `Index.tsx` (lines 548-567), competitions from Directus are manually re-mapped into a new object, but several fields are **not included**: `time`, `timezone`, `showtickets`, `aptickets`, `livestreamLink`, and `bid_status`. This means even though `competitionMapping.ts` correctly maps `showtickets` to `showTicketsLink`, etc., the data is already gone before it gets there.

**Fix:** Add the missing fields to the competition mapping object in `Index.tsx`:
- `time: comp.time || ''`
- `timezone: comp.timezone || ''`
- `showtickets: comp.showtickets || ''`
- `aptickets: comp.aptickets || ''`
- `livestreamLink: comp.livestreamLink || ''`
- `bid_status: comp.bid_status || false`

### Problem 2: Team `theme` field not passed through in Index.tsx

In `Index.tsx` (line 593), `team.theme` is mapped to `color` (for the color strip), but the `theme` field itself is never passed through as its own property. The `TeamDetail.tsx` component checks `team.theme` (line 83) to show the "Season Theme" card, so it always comes up empty.

**Fix:** Add `theme: team.theme || ''` to the team mapping object in `Index.tsx` (around line 593), so it exists alongside `color`.

### Also in api.ts

The `fetchTeams` function in `api.ts` (line 77) has the same issue -- it maps `team.theme` to `color` but never passes `theme` as its own field.

**Fix:** Add `theme: team.theme || ''` to the return object in `api.ts`.

### Summary of files to modify

1. **`src/pages/Index.tsx`**
   - Competition mapping (~line 548): add `time`, `timezone`, `showtickets`, `aptickets`, `livestreamLink`, `bid_status`
   - Team mapping (~line 593): add `theme: team.theme || ''`

2. **`src/lib/api.ts`**
   - Team mapping (~line 77): add `theme: team.theme || ''` alongside the existing `color` line

No changes needed in `CompetitionsTab.tsx` (it already passes raw data through `mapCompetitionTeamsFull` correctly) or `competitionMapping.ts` (already has the right mappings).
