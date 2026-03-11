

## Performance Optimization (Keeping Blur Effects)

### 1. Timeline: Only render active ±1 week cards

**`src/components/CompetitionTimeline.tsx`** (lines 220-231):

Currently all weekend groups render as cards and `translateX` shifts to show the active one. Replace with conditional rendering — only render `activeWeekIndex - 1`, `activeWeekIndex`, and `activeWeekIndex + 1` — while keeping the same visual slide transition using CSS. Pre-compute `isPast` per group in the `useMemo` instead of doing inline date parsing per card (line 227).

Also wrap `TimelineCompetitionCard` in `React.memo` (line 240) so cards don't re-render when parent state changes.

### 2. Memoize derived team data

**`src/pages/Index.tsx`** (lines 317-323):

Wrap `sortedTeams`, `rankedTeams`, `topThreeTeams`, `topNineTeams`, `qualifiedOtherTeams`, `notQualifiedTeams` in `useMemo` with `[teamsData, tiebreakerRankingMap, sheetOriginalNames]` dependencies.

Wrap `handleSimulationSet` and other event handlers in `useCallback`.

### 3. Remove ~500 lines of fallback data

**`src/components/CompetitionsTab.tsx`** (lines 25-268):

The `fallbackCompetitions` array is never used when the API returns data. Remove it entirely to reduce bundle parse time.

### 4. Add `useCallback` for timeline handlers

**`src/components/CompetitionTimeline.tsx`**: Wrap `goToPrev`, `goToNext`, touch/mouse handlers in `useCallback` to prevent unnecessary re-renders of child buttons.

