

## Problem

App name: **"UCB Raas Ramzat"** → normalized: `"ucbraasramzat"` → tokenized: `["ucbraasramzat"]` (1 token)  
Sheet name: **"UC Berkeley Raas Ramzat"** → normalized: `"ucberkeleyraasramzat"` → tokenized: `["ucberkeleyraasramzat"]` (1 token)

The `normalizeName()` strips all spaces/punctuation first, then `tokenize()` tries to split — but there's nothing to split on. So token overlap is always 0 for teams without numbers in their name, making strategy #3 useless.

Substring also fails: `"ucbraasramzat"` is not contained in `"ucberkeleyraasramzat"` (the "b" directly before "raas" breaks containment).

## Fix

Change the approach: **tokenize the original name first** (split on spaces/punctuation), then normalize each token individually. This preserves word boundaries.

### File: `src/lib/fetchTiebreakerRanking.ts`

1. Add a new `tokenizeOriginal(name: string)` function that:
   - Lowercases the name
   - Splits on non-alphanumeric characters (spaces, hyphens, apostrophes)
   - Strips empty tokens
   - Returns array like `["ucb", "raas", "ramzat"]`

2. Update `fuzzyLookup` to use `tokenizeOriginal` with the **original (un-normalized) name** for the token-overlap strategy. This means `fuzzyLookup` needs to accept the original name as a parameter (or we change the tokenize approach).

Simplest approach: replace the `tokenize` helper to work on raw lowercased input instead of normalized input, and pass the original name into the token strategy section.

**Result**: `["ucb", "raas", "ramzat"]` vs `["uc", "berkeley", "raas", "ramzat"]` → 2 shared tokens ("raas", "ramzat") → match found.

### Downstream change
- `src/lib/sorting.ts` — pass original team name to `fuzzyLookup` (currently only passes normalized name)

