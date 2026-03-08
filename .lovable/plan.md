

## What's Actually Happening

The code IS correctly reading the Google Sheet and applying it. The problem is that **the sheet's ranking contradicts your expected tie order**.

Here's what the sheet (GID `1418394758`) actually contains:

```text
Position | Team                    | Bid Points (in sheet)
---------|-------------------------|---------------------
   2     | Purdue Raas             | 11
   6     | Northeastern Nakhraas   | 7
   7     | UConn ThundeRaas        | 7
   9     | UF GatoRaas             | 5
```

The sheet ranks Purdue at **position 2** and Northeastern at **position 6**. So when both have 7 bid points in the app, the current code correctly places Purdue first (lower position number wins). Same for UConn (pos 7) vs UF (pos 9): UConn wins, which is actually correct per the sheet.

But you want:
- 7pts: **Northeastern > Purdue** (sheet says Purdue wins)
- 5pts: **UConn > UF** (sheet agrees here -- UConn pos 7 < UF pos 9)

**The sheet positions are based on TOTAL season bid points (Purdue has 11 overall, Northeastern has 7), not a head-to-head tiebreaker.** So using the sheet's global position to break ties between teams that currently have the same points in the app doesn't give you what you want -- it's biased by future results.

## The Real Question

For the 7-point tie specifically: What criteria should make Northeastern rank above Purdue? Some options:

1. **A different tiebreaker sheet/tab** that specifically ranks teams within the same point tier
2. **Head-to-head results** or **placement quality** (e.g., Northeastern's ratio of 1sts/2nds/3rds vs Purdue's at the same point total)
3. **Number of competitions attended** (fewer comps = more efficient = higher rank?)
4. **Simply reverse the sheet order** so higher position numbers win ties

## Proposed Fix

Once you tell me the correct tiebreaker rule, I'll implement it in one shot. The code architecture is solid -- `sorting.ts` comparator, `fetchTiebreakerRanking.ts` data source, `Index.tsx` consumption. Only the **tiebreaker signal** needs to change.

If you have a different Google Sheet tab or a different column that encodes the correct within-tier ranking, just point me to it and I'll wire it up.

### Files that would change
- `src/lib/fetchTiebreakerRanking.ts` -- adjust what data we pull from the sheet
- `src/lib/sorting.ts` -- adjust comparator to use the correct tiebreaker signal

