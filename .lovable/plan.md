

## Root Cause

The comparator logic is correct. The problem is **name mismatches between Directus team names and Google Sheet team names**. When `normalizeName(directusName)` doesn't equal `normalizeName(sheetName)`, the team is treated as "unmatched" and loses every tie to a matched team.

Evidence:
- 1pt tie works (all 3 names match) 
- 7pt and 5pt ties are wrong (one or both names don't match)
- The "unmatched team loses" rule in the comparator flips the intended order

## Plan

### 1. Add critical diagnostic logging (immediate)
In `Index.tsx`, after both `teamsData` and `tiebreakerRankingMap` are populated, log EVERY team with bid points:
- Original Directus name
- Normalized form
- Whether it matched the sheet
- Sheet position (if matched)

This will immediately reveal which names are mismatched.

### 2. Add a name alias map in `fetchTiebreakerRanking.ts`
Create a hardcoded alias map for known Directus↔Sheet name differences. After loading the sheet, also register aliases so both name forms point to the same position. Example:
```
"uconnthunderraas" → same position as "uconnthunderaas"
```

### 3. Fallback: use fuzzy matching
If exact normalized match fails, try a substring/Levenshtein match against sheet names. This handles minor spelling differences (extra letters, missing letters, etc.).

### 4. Change unmatched behavior
Currently, matched teams ALWAYS beat unmatched teams in ties. Instead, when one team is unmatched, fall back to alphabetical rather than automatically losing. This prevents name mismatches from completely inverting the order.

### Files to change
- `src/lib/fetchTiebreakerRanking.ts` - Add alias map, fuzzy matching fallback
- `src/lib/sorting.ts` - Change unmatched handling to alphabetical fallback
- `src/pages/Index.tsx` - Add per-team diagnostic logging

### What I need from you
After implementing the diagnostic logging, I'll need you to check your browser console and tell me which team names show as "UNMATCHED". Then I can add the exact aliases needed.

Alternatively, I can implement all of the above (diagnostics + fuzzy matching + safer fallback) in one go so it self-heals without manual alias mapping.
