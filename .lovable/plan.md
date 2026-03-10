

## Fix: Predictions Not Updating Scoreboard

### Root Cause

In `Index.tsx` line 306, `calculateBidPoints` is called with an empty array for competitions:
```ts
const updatedTeams = calculateBidPoints(teamsData, []);
```

Inside `calculateBidPoints` (line 272), it tries to find the competition in that empty array to check `bid_status`, which always fails — so simulation points are never added.

### Fix

**`src/pages/Index.tsx`** — Two changes:

1. **Line 306**: Pass the actual `competitions` state instead of `[]`:
   ```ts
   const updatedTeams = calculateBidPoints(teamsData, competitions);
   ```

2. **Line 310**: Add `competitions` to the useEffect dependency array so it doesn't use stale data:
   ```ts
   }, [simulationData, originalTeamsData, competitions]);
   ```

That's it — one-line fix plus a dependency update. The rest of the prediction and scoring logic is already correct.

