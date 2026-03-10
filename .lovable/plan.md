

## Fix Prediction → Standings Update

**Problem**: FantasyPredictions saves predictions to localStorage only. It never communicates back to Index.tsx's `simulationData` state, which is what drives the standings bid point recalculation. The two systems are completely disconnected.

**Solution**: Wire FantasyPredictions to call `handleSimulationSet` (which already exists and works for competition simulations) when predictions are saved. Skip tiebreaker logic for prediction-modified standings — just sort by points then alphabetically.

### Changes

1. **`src/components/FantasyPredictions.tsx`** — Add an `onPredictionSave` callback prop. When "Save Predictions" is clicked, call this callback for each competition prediction with `{ competitionId, competitionName, predictions: { first, second, third } }`.

2. **`src/components/FantasyTab.tsx`** — Accept an `onSimulationSet` prop and pass it through to `FantasyPredictions` as `onPredictionSave`. Also pass `competitions` properly.

3. **`src/pages/Index.tsx`** — Either:
   - Add a `<FantasyTab>` rendering somewhere (it's imported but never rendered in the current 3-tab layout), OR
   - Add a "Make Predictions" button directly in the standings tab that opens FantasyPredictions with the simulation callback wired up.
   
   Since there's no fantasy tab in the nav, I'll add FantasyPredictions directly accessible from the standings view (a small prediction button) and wire it to `handleSimulationSet`.

4. **`src/pages/Index.tsx` — `calculateBidPoints`** — The function already handles `simulationData` correctly (lines 270-287). No change needed there. But for sorting when predictions are active, skip the tiebreaker and just sort by bid points descending then alphabetically.

### Detailed approach

- Add a `showPredictions` state to Index.tsx
- Add a "Predict" button near the simulation alert area in standings
- Render `<FantasyPredictions>` from Index.tsx directly, passing competitions and an `onPredictionSave` that calls `handleSimulationSet` for each competition prediction
- In sorting, when `simulationData` has entries, use simple `bidPoints desc → alphabetical` instead of tiebreaker sort

