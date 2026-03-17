
Problem found: the fix was only wired into the modal path from `Index`, not the comps tab path. The standings order is memoized correctly in `Index.tsx`, but `CompetitionsTab.tsx` still opens `CompetitionDetail` without passing `teamSortOrder`, so the drawer falls back to `new Map()` and preserves the raw lineup order instead of standings order.

What to change

1. Update `src/components/CompetitionsTab.tsx`
- Add a new optional prop: `teamSortOrder?: Map<string, number>`
- Pass that prop through to the inline `CompetitionDetail` render:
  - `teamSortOrder={teamSortOrder}`

2. Update `src/pages/Index.tsx`
- Pass the already-memoized `teamSortOrder` into `<CompetitionsTab ... />`

Why this fixes it
- `Index.tsx` already computes:
  - `sortedTeams` with the full standings/tiebreaker logic
  - `teamSortOrder` from that sorted list
- `CompetitionDetail.tsx` already sorts the Nationals lineup using `teamSortOrder`
- The bug is simply that the comps tab modal never received that map, so it could not apply the standings order

Expected result
- Opening Nationals from the Comps tab will use the exact same team order as the Standings tab
- No extra recomputation is introduced
- The fix stays aligned with the app’s centralized data/sorting architecture

Technical note
- This is a prop-drilling mismatch, not a sorting algorithm issue
- `CompetitionDetail` is already implemented to sort correctly when `teamSortOrder` is present
- The modal stack render in `Index.tsx` already passes it correctly; only the `CompetitionsTab` local modal path is missing the prop
