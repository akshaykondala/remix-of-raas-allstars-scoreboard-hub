
## The Problem

There are **two independent timers racing each other**:

1. The `LoadingScreen` animation runs for ~2 seconds and then calls `onComplete` → `setShowLoading(false)`, revealing the app regardless of DB status
2. The DB fetch in `Index.tsx` (`loadData`) runs in parallel and may finish before or after the loading screen — but often finishes **after**, especially on mobile/network connections where latency is higher

When the DB fetch is slow, the sequence is:
- t=0: App mounts, `teamsData` initialized with `fallbackTeams`, loading screen shown
- t=2s: Loading screen timer fires, reveals app — DB still pending — user sees fallback data
- t=3-5s: DB responds, real data replaces fallback data — visible "flicker" of content changing

The fix is to **tie the loading screen's completion to the DB fetch, not to an animation timer**.

---

## The Fix: 3 targeted changes

### 1. `src/pages/Index.tsx` — Initialize with empty arrays, track DB readiness

**Change the initial state** so fallback data is never the starting state:
```ts
// Before:
const [teamsData, setTeamsData] = useState<Team[]>(fallbackTeams);
const [loading, setLoading] = useState(false);

// After:
const [teamsData, setTeamsData] = useState<Team[]>([]);
const [dbReady, setDbReady] = useState(false);
```

**Add a `dbReady` flag** that gets set to `true` after `loadData()` completes (whether it succeeded or failed — we just need to know the fetch is done). In the `finally` block:
```ts
} finally {
  setLoading(false);
  setDbReady(true); // DB attempt is complete — loading screen may now dismiss
}
```

**Gate `handleLoadingComplete`** so the loading screen only dismisses once BOTH the animation AND the DB fetch are done:
```ts
// The loading screen calls this when its animation is ready to complete
const [animationReady, setAnimationReady] = useState(false);

const handleLoadingComplete = useCallback(() => {
  setAnimationReady(true);
}, []);

// Only actually hide the loading screen when BOTH are ready
useEffect(() => {
  if (animationReady && dbReady) {
    setShowLoading(false);
  }
}, [animationReady, dbReady]);
```

**If the DB fetch fails**, the `catch` block sets `teamsData` to the fallback — which is fine because at that point we've confirmed the DB is not reachable. The loading screen will still dismiss after both animation + fetch attempt are complete. The key is users never see a flicker of fallback-then-real data.

### 2. `src/components/CompetitionsTab.tsx` — Remove the separate fetch, use `teams` prop

`CompetitionsTab` currently does its **own** `fetchFromDirectus('competitions')` call independently, which is what causes the second round of "loading → fallback → real data" visible on the competitions tab. Since `Index.tsx` already fetches and maps competitions, we should pass them as a prop instead.

**Change the `CompetitionsTabProps`** to accept competitions as a prop:
```ts
export interface CompetitionsTabProps {
  competitions: Competition[]; // NEW — passed from Index
  onSimulationSet?: ...;
  simulationData?: SimulationData;
  teams: any[];
  onTeamClick?: (team: any) => void;
}
```

**Remove the internal `useEffect` fetch** (lines 608-630) and instead use the passed `competitions` prop directly. The `loading` state inside `CompetitionsTab` is also removed — `Index.tsx` controls the loading screen.

**In `Index.tsx`**, pass the already-fetched competitions down:
```tsx
<CompetitionsTab
  competitions={competitions}  // pass from Index state
  teams={teamsData}
  onSimulationSet={...}
  simulationData={simulationData}
  onTeamClick={...}
/>
```

### 3. `src/pages/Index.tsx` — Never use fallback teams data (only on confirmed DB failure)

The `catch` block at line 722-726 currently sets `teamsData(fallbackTeams)`. This is acceptable as a last resort, but only after the actual fetch attempt has failed. With the `dbReady` gate, users won't see fallback data flash-then-switch — they'll only see fallback data if the DB is genuinely unreachable. This behavior is acceptable and is what you'd want as a last resort.

---

## Files to Modify

| File | Change |
|---|---|
| `src/pages/Index.tsx` | Initialize `teamsData` as `[]`, add `dbReady` + `animationReady` flags, gate loading screen dismissal on both being true |
| `src/components/CompetitionsTab.tsx` | Accept `competitions` as a prop, remove internal `fetchFromDirectus` call and `loading` state |

---

## Technical Notes

- The loading screen animation typically completes in ~2 seconds. On a fast connection, the DB fetch likely beats that. On mobile/slow connections, the DB fetch takes longer — the loading screen will now wait for it, stretching to 3-5s if needed.
- The loading screen component (`LoadingScreenWrapper`) has its own internal animation phases (loading → fading → traveling). These are unaffected — we just delay calling `onComplete`'s side-effect until the DB is also ready.
- The `CompetitionsTab` still has access to `teams` (for rendering lineup, simulation dropdowns) — that's unchanged. Only the competitions fetch is removed from it.
