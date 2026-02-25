

## Hide 3rd Place in Simulation Mode for Small Competitions

The simulation/prediction mode in both `CompetitionsTab.tsx` and `CompetitionDetail.tsx` currently always shows a 3rd place dropdown. This needs to respect the same rule: competitions with 6 or fewer teams should not show 3rd place.

### Changes

**File: `src/components/CompetitionsTab.tsx`**

1. **Simulation modal text** (line 677): Change "top 3" to dynamically say "top 2" or "top 3" based on lineup size.
2. **3rd place dropdown** (line 682): Conditionally render only if lineup > 6.
3. **Save validation** (line 632): Allow saving without 3rd if lineup <= 6.
4. **canSaveSimulation** (line 650): Same -- don't require 3rd for small comps.

**File: `src/components/CompetitionDetail.tsx`**

1. **3rd place dropdown** (line 563): Conditionally render only if lineup > 6.
2. **Save validation** (line 188): Allow saving without 3rd if lineup <= 6.
3. **canSaveSimulation** (line 203): Don't require 3rd for small comps.
4. **Section header** (line 556): "Top 3 Placings" becomes dynamic.

**File: `src/pages/Index.tsx`**

1. **Simulation points** (lines 272-274): Only add 3rd place simulation point if the competition has > 6 teams. This requires looking up the competition from the `competitions` array using `simulation.competitionId`.

### Logic Pattern (same in both UI files)

```typescript
const lineupSize = Array.isArray(comp.lineup) ? comp.lineup.length : 0;
const hasThirdPlace = lineupSize > 6;

// canSaveSimulation: require 3rd only if hasThirdPlace
const canSaveSimulation = predictions.first && predictions.second
  && (hasThirdPlace ? predictions.third : true)
  && predictions.first !== predictions.second
  && (!hasThirdPlace || (predictions.first !== predictions.third && predictions.second !== predictions.third));

// Conditionally render 3rd dropdown
{hasThirdPlace && <SimulationDropdown ... position="third" />}
```

For `Index.tsx` simulation points:
```typescript
if (simulation.predictions.third) {
  const comp = competitions.find(c => c.id === simulation.competitionId);
  const lineupSize = comp ? (Array.isArray(comp.lineup) ? comp.lineup.length : 0) : 0;
  if (lineupSize > 6) {
    pointsMap[simulation.predictions.third] = (pointsMap[simulation.predictions.third] || 0) + 1;
  }
}
```

### Summary

| File | Change |
|------|--------|
| `src/components/CompetitionsTab.tsx` | Hide 3rd place dropdown and adjust validation for comps with 6 or fewer teams |
| `src/components/CompetitionDetail.tsx` | Same changes for the detail modal simulation UI |
| `src/pages/Index.tsx` | Skip 3rd place simulation points for small competitions |
