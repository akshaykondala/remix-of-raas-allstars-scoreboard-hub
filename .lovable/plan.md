
Fix the competition detail placings by tightening the display logic in `src/components/CompetitionDetail.tsx`.

What’s causing it
- The detail page still has a fallback branch for future RAS competitions that renders the `? / TBD` cards whenever both resolved teams are missing.
- The placed-team resolver is better than before, but it still only searches the global `teams` list. If the placement value matches a team present in `competition.lineup` but not perfectly in `teams`, the detail page can still fail to resolve it even though the banner worked elsewhere.
- The placings section currently renders only cards for resolved teams, so if resolution fails you get the placeholder state instead of the actual placed lineup entries.

What to change
1. Strengthen team resolution for placements
- Update `getPlacingTeam()` so it checks, in order:
  - exact ID match in `teams`
  - exact ID/name match in `competition.lineup`
  - normalized name match in both sources
- If a lineup match is found first, hydrate it with the full `teams` record when possible so logo/click behavior still works.

2. Stop showing placeholder cards once placement values exist
- Replace the current future-RAS condition:
  - from: show placeholders when `!firstPlaceTeam && !secondPlaceTeam`
  - to: show placeholders only when there are no actual placement values entered at all
- This ensures that once `competition.firstplace` or `competition.secondplace` is populated, the page attempts to render results instead of defaulting to `?`.

3. Add a placement-aware fallback UI
- For RAS results, if a placement value exists but team resolution still fails, render a result card using the raw stored placement text instead of `TBD`.
- Example:
  - label stays “National Champion” / “Runner Up”
  - avatar falls back to first letter
  - name shows `competition.firstplace` / `competition.secondplace`
- This removes the broken-looking `?` state even if Directus data is slightly inconsistent.

4. Keep existing behavior for normal competitions
- Do not alter non-RAS future prediction cards.
- Keep third place conditional on lineup size / existing placement data.

Files to update
- `src/components/CompetitionDetail.tsx`

Expected result
- On the competition detail page, entered RAS placements will appear immediately.
- The `?` placeholder cards will only show when no placements have been entered yet.
- If Directus stores a name/string that can’t fully hydrate to a team object, the user will still see the entered placement text instead of a broken placeholder.

Technical notes
- Reuse the existing `normalizeName` helper.
- Prefer deriving small booleans like:
  - `hasPlacedResults`
  - `firstPlaceDisplay`
  - `secondPlaceDisplay`
- Keep the current card styling; only change the data resolution and rendering conditions.
