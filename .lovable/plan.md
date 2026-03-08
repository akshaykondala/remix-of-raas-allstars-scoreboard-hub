

## Problem

The 2-point tie group (TAMU Wreckin' Raas, UC Berkeley Raas Ramzat, Cornell Big Red Raas) is in the wrong order. The sheet positions are 12, 13, 14 respectively, and the code correctly does `aRank - bRank`, so this should work. The issue is that **one or more of these teams' Directus names don't match the sheet names**, even with Levenshtein distance ≤ 3.

For example, if Directus stores "Cornell Raas" but the sheet says "Cornell Big Red Raas", that's a normalized distance of ~6 characters ("bigged" difference) — far beyond the fuzzy threshold of 3. The unmatched teams fall back to alphabetical, which produces wrong order.

## Root Cause

The Levenshtein distance threshold of 3 is too conservative for team names that differ significantly between Directus and the Google Sheet (e.g., abbreviated vs full names). This causes some teams to be "unmatched" and sorted alphabetically instead of by sheet position.

## Plan

### Enhance fuzzy matching with substring/token-based matching

In `src/lib/fetchTiebreakerRanking.ts`, upgrade `fuzzyLookup` to try multiple strategies in order:

1. **Exact match** (current)
2. **Substring containment** — if the app name contains a sheet name or vice versa, it's a match
3. **Token overlap** — split both names into word-like tokens, if they share 2+ tokens, it's a match (handles "Cornell Raas" vs "Cornell Big Red Raas")
4. **Levenshtein ≤ 3** (current fallback)

This handles abbreviated names, extra words, and minor spelling differences — all without needing manual aliases.

### Files to change
- `src/lib/fetchTiebreakerRanking.ts` — enhance `fuzzyLookup` with substring and token-based matching strategies

