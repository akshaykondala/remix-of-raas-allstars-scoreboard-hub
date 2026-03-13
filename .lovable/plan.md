

## Problem: Blank Screen on Database Connection Failure

### Root Cause

The app makes three parallel network requests on every launch (Directus teams, Directus competitions, Google Sheets tiebreaker). If **any** of these fail — due to timeout, network issues, or Directus being temporarily unreachable — the app silently catches the error, sets empty arrays, dismisses the loading screen, and shows a completely blank UI. There is:

1. **No retry logic** — a single failed fetch means blank content for the entire session
2. **No data caching** — every launch requires a live network connection; there's no fallback to previously fetched data
3. **No error state UI** — users (and App Store reviewers) see an empty screen with no indication of what went wrong or how to recover
4. **Silent error swallowing** — all `catch` blocks return `null` or `[]` with no logging

### Plan

#### 1. Add localStorage caching for successful API responses
**`src/lib/api.ts`**
- After a successful `fetchFromDirectus` response, cache the result in `localStorage` keyed by collection name (e.g., `cache_teams`, `cache_competitions`) along with a timestamp
- On fetch failure, return the cached data instead of `null`
- Cache TTL: serve cached data immediately, but still attempt a fresh fetch; stale cache is better than blank screen

#### 2. Add automatic retry with backoff
**`src/lib/api.ts`**
- Wrap the fetch call in a retry loop (up to 3 attempts) with exponential backoff (1s, 2s, 4s)
- Increase the abort timeout from 10s to 15s for the first attempt
- Only fall back to cache after all retries are exhausted

#### 3. Add an error/empty state with manual retry
**`src/pages/Index.tsx`**
- Track a `fetchError` state alongside `dbReady`
- When data loads but both teams and competitions are empty (and no cache was available), show an error screen with a "Retry" button and a message like "Unable to load data. Check your connection and try again."
- The retry button re-triggers the `loadData` function

#### 4. Apply same caching to Google Sheets tiebreaker
**`src/lib/fetchTiebreakerRanking.ts`**
- Cache the parsed ranking map in localStorage on success
- On failure, return cached data instead of an empty map

### Technical Details

**Cache structure in localStorage:**
```
cache_teams → { data: [...], timestamp: 1710000000000 }
cache_competitions → { data: [...], timestamp: 1710000000000 }
cache_tiebreaker → { rankingMap: [...], originalNames: [...], timestamp: ... }
```

**Retry helper (new utility in `api.ts`):**
```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`${res.status}`);
      return res;
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
}
```

**Error state UI:** A centered card on the main screen background with a wifi-off icon, message, and a "Try Again" button that calls `loadData()` again. Only shown when `dbReady === true` and `teamsData.length === 0` and `fetchError === true`.

### Files Changed
- `src/lib/api.ts` — retry logic + localStorage caching
- `src/lib/fetchTiebreakerRanking.ts` — localStorage caching
- `src/pages/Index.tsx` — error state tracking + retry UI

