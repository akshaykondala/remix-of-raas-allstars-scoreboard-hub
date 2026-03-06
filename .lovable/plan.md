

## Fix: Tiebreaker Ranking Not Matching Spreadsheet

### Problem Identified

The Google Sheet CSV fetch works correctly and returns the right data. However, the tiebreaker is likely failing because **team names from Directus don't exactly match team names in the spreadsheet**. When a name doesn't match, the team gets rank 9999, and all tied teams fall back to alphabetical order -- which produces an order opposite to the spreadsheet.

For example, the spreadsheet has `"UConn ThundeRaas "` (trailing space inside quotes), and Directus may store the name slightly differently (e.g., `"UConn ThundeRaas"` without trailing space, or with different capitalization/punctuation).

### Changes

**1. `src/lib/fetchTiebreakerRanking.ts`**
- Add debug logging: log each parsed team name and the final map so we can verify matches
- Normalize team names more aggressively: lowercase, trim, and also strip extra internal whitespace
- Also store a normalized version that removes common punctuation differences (apostrophes, hyphens) as a fallback key

**2. `src/pages/Index.tsx`**
- In `tiebreakerSort`, normalize the team name the same way before looking up in the map
- Add a `console.log` showing the final sorted order with ranks for debugging
- After the ranking map loads, log which teams matched and which didn't so any name mismatches are immediately visible

### Normalization Strategy

Both the spreadsheet names and Directus names will be normalized using:
```
name.toLowerCase().trim().replace(/\s+/g, ' ')
```

This handles trailing spaces, double spaces, and case differences. If needed, a second-pass match could strip punctuation (`'`, `'`, `-`) for fuzzy matching.

### Outcome

Teams with equal bid points will be ordered exactly as they appear in the spreadsheet. Any unmatched names will be logged to the console for easy diagnosis.

