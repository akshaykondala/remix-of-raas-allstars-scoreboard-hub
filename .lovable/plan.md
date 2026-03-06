

## Plan: Use Google Sheet for Tiebreaker Ordering

### How It Works

The app will fetch the public Google Sheet as CSV at load time, extract the team names in their ranked order, and use that order to break ties when teams have equal bid points. The existing complex tiebreaker logic (ratio, 1st/2nd/3rd counts, commented-out standardized scores) gets replaced with a simple lookup.

### Changes

**1. New file: `src/lib/fetchTiebreakerRanking.ts`**
- Fetches the sheet via the public CSV export URL: `https://docs.google.com/spreadsheets/d/1ZwhzO49wsBv_a8T_gyF_dihhH9FmjDQdGXknS6_-Uqw/gviz/tq?tqx=out:csv`
- Parses the CSV rows, extracts the "Team" column (column B / index 1) in order
- Returns a `Map<string, number>` mapping team name to rank position (1, 2, 3...)
- Handles fetch failures gracefully by returning an empty map (falls back to alphabetical)

**2. `src/pages/Index.tsx`**
- Import and call `fetchTiebreakerRanking()` alongside the existing teams/competitions data fetch (in the `useEffect` or add a new one)
- Store the ranking map in state
- Replace the `tiebreakerSort` function (lines 307-377): keep the primary bid points sort, then use the sheet ranking map for ties, with alphabetical as final fallback:
  ```
  if (b.bidPoints !== a.bidPoints) return b.bidPoints - a.bidPoints;
  const aRank = rankingMap.get(a.name) ?? 9999;
  const bRank = rankingMap.get(b.name) ?? 9999;
  if (aRank !== bRank) return aRank - bRank;
  return a.name.localeCompare(b.name);
  ```

**3. Store the Sheet ID**
- Add `VITE_TIEBREAKER_SHEET_ID` to environment secrets so the sheet ID isn't hardcoded, making it easy to swap sheets later

### What Gets Removed
- All the ratio/firsts/seconds/thirds tiebreaker computation (lines 313-376)
- The commented-out tiebreaker 5/6/7 blocks

### What Stays
- Primary sort by bid points (unchanged)
- Alphabetical fallback when sheet data is unavailable
- All other standings display logic

### Edge Cases
- If the fetch fails or the sheet is inaccessible, the map is empty and ties resolve alphabetically
- Team name matching will be case-insensitive trimmed comparison to handle minor discrepancies

