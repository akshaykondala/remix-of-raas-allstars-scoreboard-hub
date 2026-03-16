

## Performance Optimization for Competitions Tab

The shimmer animation on the nationals placings card is pure CSS and won't cause JS lag. The real performance issues are:

### Root Causes

1. **CompetitionsTab sorts competitions on every render** (line 200-205) — `[...competitions].sort(...)` is inline with no memoization
2. **CompetitionsTab re-renders fully on any parent state change** — it receives `teamsData` and `simulationData` as props from Index, and Index has many state variables that trigger re-renders (tab changes, modal stack, search query, etc.)
3. **All three TabsContent panels are always mounted and rendered** — even when viewing "standings", the comps tab components are re-rendering
4. **CompetitionDetail (731 lines) has zero memoization** — inline functions like `getAvailableTeams`, `getPlacingTeam`, `handleTeamClick` are recreated every render; multiple `teams.find()` calls run on each render
5. **CompetitionsTab inline `getAvailableTeams` creates new arrays every render**
6. **Multiple heavy blur effects** in the background (3 large blur-3xl divs in Index + timeline card blurs) compound GPU load

### Plan

#### 1. Memoize competition sorting in `CompetitionsTab`
Wrap the `[...competitions].sort(...)` call passed to `CompetitionTimeline` in `useMemo` instead of computing it inline on every render.

#### 2. Wrap `CompetitionsTab` in `React.memo`
Prevent re-renders when unrelated parent state changes (e.g. modal stack, search query, active tab switching).

#### 3. Add `useMemo` for derived data in `CompetitionDetail`
Memoize `firstPlaceTeam`, `secondPlaceTeam`, `thirdPlaceTeam`, and wrap `getAvailableTeams` in `useCallback`.

#### 4. Use `forceMount` + CSS visibility on TabsContent (or lazy render)
Instead of always rendering all tabs, only render the comps tab content when `activeTab === 'comps'` using a conditional, so the timeline and its children don't mount/update while on other tabs.

#### 5. Add `transform-gpu` to animated/blurred elements
Add `transform-gpu` class to the blur/glow elements in the timeline cards and nationals placings to offload compositing to the GPU.

### Files Changed
- `src/components/CompetitionsTab.tsx` — memo wrap + memoize sorted competitions
- `src/components/CompetitionDetail.tsx` — memoize derived team lookups, useCallback for handlers
- `src/pages/Index.tsx` — conditionally render tab content only when active (lazy mount)

