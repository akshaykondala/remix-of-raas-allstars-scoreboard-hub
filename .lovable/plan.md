
Goal: Make tie ordering match the spreadsheet exactly by using the spreadsheet’s displayed order (top-to-bottom in the provided tab) as the only tie-break source.

What I found:
- Current fetch uses `.../gviz/tq?tqx=out:csv` without `gid`, so it does not explicitly lock to your tab (`gid=1418394758`).
- Current ranking uses CSV row index (`i`) instead of the sheet’s Position value and can silently fall back to alphabetical when any name misses.
- Any missed match makes tie groups look “wrong/opposite” because fallback kicks in.

Implementation plan:
1) Lock fetch to your exact tab
- In `src/lib/fetchTiebreakerRanking.ts`, switch URL to:
  `https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=1418394758`
- This guarantees we read the exact sheet tab you linked.

2) Build ranking from sheet data, not loop index
- Parse each row and read:
  - Column A = `Position` (numeric rank)
  - Column B = `Team`
- Store `team -> position` from column A (ignore blank/non-numeric rows).
- Do not depend on `i` row number.

3) Make matching deterministic and forgiving
- Replace normalization with a stricter canonical key on both sides (sheet + Directus team names):
  - lowercase
  - unicode normalize
  - remove all non-alphanumeric chars (spaces, apostrophes, hyphens, punctuation)
- Keep one canonical map only; no ambiguous dual-logic.

4) Enforce tie logic exactly as requested
- In `src/pages/Index.tsx` comparator:
  - Primary: `bidPoints` descending
  - If tied: compare `sheetPosition` ascending (smaller position = higher)
  - If both missing from sheet: alphabetical fallback only as last resort
- Add one concise warning listing unmatched team names (once), so misses are obvious.

5) Remove noisy debug spam, keep focused diagnostics
- Remove per-row `console.log` spam.
- Keep a single summary log in dev for:
  - count of mapped teams
  - unmatched app teams (if any)

Acceptance criteria (must pass):
- Tie groups are ordered exactly by sheet position:
  - 7-point tie: Northeastern Nakhraas above Purdue Raas
  - 5-point tie: UConn ThundeRaas above UF GatoRaas
  - 2-point tie: RU Raga, TAMU Wreckin’ Raas, Cornell Big Red Raas, UC Berkeley Raas Ramzat
  - 1-point tie: Michigan Wolveraas, UMD EntouRaas, Illini Raas
- No alphabetical fallback occurs for teams present in the sheet tab.

Technical details:
- Files to update:
  - `src/lib/fetchTiebreakerRanking.ts` (URL, parsing by Position+Team, canonicalization, concise diagnostics)
  - `src/pages/Index.tsx` (tie comparator uses canonical lookup only)
- Optional hardening:
  - Use env vars `VITE_TIEBREAKER_SHEET_ID` and `VITE_TIEBREAKER_GID` after immediate fix to avoid hardcoding.
