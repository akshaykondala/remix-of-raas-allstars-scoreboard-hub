
Goal: make tie ordering provably match the Google Sheet tab (`gid=1418394758`) and remove any ambiguity about “backwards” ties.

What I verified now:
- Current comparator logic in code is `bidPoints desc`, then `sheetRank asc`.
- Current sheet fetch parses Column B team names but assigns rank by row iteration, not Column A Position.
- Competition detail currently shows lineup in original lineup order (with rank badges), not sorted by global ranking order.
- The live sheet data (from export) has expected tie order:
  - 7 pts: Northeastern before Purdue
  - 5 pts: UConn before UF
  - 2 pts: RU > TAMU > Cornell > UC Berkeley
  - 1 pt: Michigan > UMD > Illini

Implementation plan (focused):
1) Make sheet ranking unambiguous in `fetchTiebreakerRanking`
- Parse Column A (`Position`) as numeric rank and Column B (`Team`) as name.
- Use `Position` as primary rank source (fallback to row index only if Position missing).
- Keep one canonical normalization function for both sheet and app names.

2) Harden comparator in shared utility (`src/lib/sorting.ts`)
- Keep exact rule: `bidPoints desc` → `sheetPosition asc` → alphabetical fallback.
- Explicitly handle matched-vs-unmatched teams so matched teams always win ties over unmatched ones.

3) Add one-time diagnostics in `Index.tsx` (dev-only, concise)
- Log unmatched app team names vs sheet names.
- Log each tied points group with computed sheet ranks so we can see immediately if any group is inverted.

4) Align all UI surfaces to same ordering source
- `Index.tsx`: ensure standings arrays derive from one sorted source only.
- `CompetitionDetail.tsx`: sort displayed lineup by the shared comparator before rendering (not just show badges on unsorted lineup), so users don’t perceive reversed tie order in detail views.

5) Acceptance verification (must pass exactly)
- 7-point tie: Northeastern Nakhraas above Purdue Raas
- 5-point tie: UConn ThundeRaas above UF GatoRaas
- 2-point tie: RU Raga > TAMU Wreckin’ Raas > Cornell Big Red Raas > UC Berkeley Raas Ramzat
- 1-point tie: Michigan Wolveraas > UMD EntouRaas > Illini Raas

Technical change scope:
- `src/lib/fetchTiebreakerRanking.ts`
- `src/lib/sorting.ts`
- `src/pages/Index.tsx`
- `src/components/CompetitionDetail.tsx`
