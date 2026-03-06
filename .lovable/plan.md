

## Plan: Use Google Sheet for Tiebreaker Ordering — IMPLEMENTED

### How It Works

The app fetches the public Google Sheet as CSV at load time, extracts team names in ranked order (column B), and uses that order to break ties when teams have equal bid points.

### What Was Done

1. **Created `src/lib/fetchTiebreakerRanking.ts`** — fetches CSV from the public sheet, parses team names from column B, returns a `Map<string, number>` (lowercase team name → rank position). Falls back to empty map on failure.

2. **Updated `src/pages/Index.tsx`** — added `tiebreakerRankingMap` state, fetches ranking in parallel with teams/competitions, replaced the old ratio/1st/2nd/3rd tiebreaker logic with a simple sheet-rank lookup.

### Tiebreaker Order
1. Bid points (descending)
2. Google Sheet rank (ascending)
3. Alphabetical (fallback)

### Sheet ID
Hardcoded: `1ZwhzO49wsBv_a8T_gyF_dihhH9FmjDQdGXknS6_-Uqw`

