

## Problem

The LoadingScreen animation runs on a fixed timer (~1.5s total) and is **completely independent of data readiness**. The phase progression is:

1. Progress bar fills (~1.5s) → `'fading'` (blobs fade out, 400ms) → `'traveling'` (logo flies to header, 700ms) → `'done'` → calls `onComplete`

During `'traveling'`, the background overlay opacity is already 0, so the user sees the empty app behind it. The `onComplete` callback fires at the end, setting `animationReady = true`. If `dbReady` is already true by then, `showLoading` flips to false — but the user already saw the empty content during the travel phase.

If the API is slow, the animation finishes, the loading screen visually disappears (opacity 0 during traveling), and then the component returns `null` at `'done'` — all before data arrives.

**The `animationReady && dbReady` gate in Index.tsx only controls unmounting, not the visual fade.** The visual fade happens inside LoadingScreen independently.

## Fix

Pass `dbReady` as a prop to `LoadingScreen` and **gate the phase transition** so it won't leave the `'loading'` phase until data is ready.

### File: `src/components/LoadingScreen.tsx`

1. Add `dataReady?: boolean` to `LoadingScreenProps`
2. Change the progress→fading transition to require **both** `progress >= 100` **and** `dataReady === true`:
   ```
   if (progress >= 100 && dataReady && phase === 'loading') {
     setTimeout(() => setPhase('fading'), 300);
   }
   ```
3. When progress hits 100 but data isn't ready, the dots keep animating — the user sees a seamless wait. Once data arrives, the fade/travel animation plays over already-loaded content.

### File: `src/pages/Index.tsx`

Pass `dbReady` to LoadingScreen:
```
<LoadingScreen onComplete={handleLoadingComplete} headerLogoRef={headerLogoRef} dataReady={dbReady} />
```

### Result
The loading screen now stays fully visible until the API returns, then plays the exit animation over content that's already rendered underneath — no flash of empty UI.

