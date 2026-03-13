

## Audit: Current State of Loading/Blank Screen Fixes

You're right — the environment variables **are** configured (likely as build secrets, which I can't see). The intermittent blank screen is purely a **network reliability issue** — Directus or Google Sheets sometimes times out or fails.

### What's Already Working Well
- Retry logic with backoff in `api.ts` (2 retries, 8s timeout)
- localStorage caching for teams and competitions — on failure, cached data is served
- Error UI with "Try Again" button on all 3 tabs (standings, competitions, teams)
- 20-second overall timeout prevents indefinite hanging
- `setLoading(true)` at start of `loadData()` — loading spinner works correctly

### Two Remaining Issues

**1. Tiebreaker fetch still uses 3 retries × 15s timeout**
`src/lib/fetchTiebreakerRanking.ts` line 132-135 still has the old values. Since it runs in `Promise.all` with the Directus calls, it can block the entire load for up to 45s — exceeding the 20s overall timeout. When the timeout fires, the error state is set, but the tiebreaker fetch keeps running in the background, potentially causing a state race.

**Fix:** Reduce to 2 retries with 8s timeout (matching `api.ts`).

**2. Timeout doesn't cancel in-flight requests**
When the 20s timeout fires (line 87-92), it sets `fetchError` and `dbReady`, but the `Promise.all` on line 95 keeps running. If those requests eventually succeed, the `.then` logic on lines 100-256 runs and overwrites the error state — potentially flashing between error UI and content, or setting partial data without clearing the error flag.

**Fix:** Use an `AbortController` so the timeout actually cancels the in-flight fetches, preventing the race condition.

### Files to Change
- **`src/lib/fetchTiebreakerRanking.ts`** — reduce retries from 3→2, timeout from 15s→8s
- **`src/pages/Index.tsx`** — add `AbortController` to `loadData` so the 20s timeout aborts in-flight requests cleanly

