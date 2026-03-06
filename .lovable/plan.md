
Root cause is now clear: the app has two different ranking systems active.
1) `src/pages/Index.tsx` uses the sheet-based tie comparator.
2) `src/components/CompetitionDetail.tsx` still uses old ratio/1st/2nd logic for rank badges in lineup (lines ~509-525).
So users see contradictory ordering and it looks “still wrong.”

Plan to fix (single source of truth, sheet-only):
1. Centralize tie comparator in one utility
- Create a shared comparator function used everywhere standings/ranks are computed.
- Logic:
  - Primary: `bidPoints` desc
  - Tie: sheet order asc (top-to-bottom from your tab)
  - Final fallback only if no sheet match for both

2. Make sheet ranking strictly “display order”
- In `src/lib/fetchTiebreakerRanking.ts`, keep `gid=1418394758`.
- Build rank from visible sheet order (top-to-bottom data rows in that tab), not any legacy metric.
- Keep normalization identical on both sheet names and app names.

3. Apply shared comparator in BOTH places
- `src/pages/Index.tsx`: standings/podium/list.
- `src/components/CompetitionDetail.tsx`: lineup rank badges (`#1`, `#2`, etc.) so they match standings exactly.
- Remove the old ratio/placings tie logic from `CompetitionDetail` entirely.

4. Add one-time mismatch diagnostics
- After teams + sheet load, compute unmatched team names and log one concise warning.
- This will immediately expose any Directus name that doesn’t match sheet naming.

5. Acceptance validation (must match your screenshot)
- 7-point tie: Northeastern Nakhraas above Purdue Raas
- 5-point tie: UConn ThundeRaas above UF GatoRaas
- 2-point tie: RU Raga > TAMU Wreckin’ Raas > Cornell Big Red Raas > UC Berkeley Raas Ramzat
- 1-point tie: Michigan Wolveraas > UMD EntouRaas > Illini Raas
- Competition lineup rank badges must mirror this same ordering logic.

Implementation scope:
- `src/lib/fetchTiebreakerRanking.ts`
- `src/lib` (new shared comparator utility)
- `src/pages/Index.tsx`
- `src/components/CompetitionDetail.tsx`
