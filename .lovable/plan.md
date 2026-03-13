

## Issues Found That Could Cause Blank Screen / Rejection

### Issue 1: `loading` state is never set to `true`
In `Index.tsx` line 44, `loading` is initialized as `false`. The `loadData` function never sets it to `true` — it only sets it to `false` in the `finally` block. This means the "Loading teams..." spinner (line 437-440) **never renders**. After the loading screen dismisses, if data is still empty but `fetchError` hasn't been set, users see nothing.

### Issue 2: Error UI only shows on the Standings tab
The error state with the "Try Again" button is rendered only inside `TabsContent value="standings"`. If a user taps the Competitions or Fantasy tab while data is missing, they see a completely blank tab with no error message and no retry option.

### Issue 3: Network retries can hang for 45+ seconds
With 3 retry attempts × 15s timeout each, the loading screen can hang for up to 45 seconds before showing any error. App Store reviewers on slow/restricted networks would see a stuck loading screen and reject.

### Issue 4: Dead code in LoadingScreen
The first `LoadingScreen` component (lines 10-127) is unused dead code — only `LoadingScreenWrapper` is exported. Not a bug but unnecessary bloat.

## Plan

### 1. Fix `loading` state in `Index.tsx`
Add `setLoading(true)` at the start of `loadData()` so the loading spinner works correctly between the loading screen dismissing and data appearing.

### 2. Add error/empty state to ALL tabs
Move the error UI out of the standings-only block, or duplicate it in the Competitions and Fantasy tabs, so every tab shows "Unable to Load Data" + "Try Again" when `fetchError` is true and data is empty.

### 3. Add a maximum loading timeout
Add a 20-second overall timeout for the entire `loadData` call. If it exceeds this, immediately set `fetchError` and `dbReady` so the loading screen dismisses and the error UI shows. This prevents the 45-second hang. Reduce individual fetch timeout to 8s and retries to 2 attempts (max ~24s but with the 20s overall cap).

### 4. Remove dead code
Remove the unused first `LoadingScreen` component (lines 10-127) to keep the file clean.

### Files to change
- `src/pages/Index.tsx` — fix loading state, add error UI to all tabs, add overall timeout
- `src/components/LoadingScreen.tsx` — remove dead code

