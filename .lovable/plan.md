
## Feature: Nationals Champions Banner Above Standings

### What to build
Add a special nationals-only hero banner at the top of the Standings tab that appears once the nationals competition has both `firstplace` and `secondplace` filled in. It should sit above the existing leaderboard/podium and celebrate the top 2 finishers, while keeping the leaderboard visible underneath.

### Why this fits the current app
- The standings screen already owns all competition + team data in `src/pages/Index.tsx`, so this is the best place to derive nationals winners and render the banner.
- Nationals already has a premium amber/gold visual language in `CompetitionDetail.tsx`, so the new banner should reuse that style.
- The current leaderboard remains useful as secondary context, so we only add a hero section above it rather than replacing the page.

### Implementation plan

1. **Derive the nationals results in `src/pages/Index.tsx`**
   - Find the competition where `ras === true`
   - Resolve `firstplace` and `secondplace` into actual team objects using the same ID/name matching pattern already used elsewhere
   - Add simple booleans like:
     - `hasNationalsResults`
     - `nationalChampion`
     - `nationalRunnerUp`

2. **Render a new hero banner above the current podium**
   - Insert it near the top of the Standings tab, after the loading/error/simulation alert area and before the existing “Top 3 Flowing Podium”
   - Only show it when nationals exists and both 1st + 2nd are available
   - Keep it lightweight:
     - no continuous animation
     - no heavy blur layers
     - minimal shadows/gradients
     - static premium card treatment

3. **Banner layout**
   - Headline like “National Champions” or “RAS Finals Results”
   - Large featured champion card:
     - team logo
     - team name
     - “National Champion” label
   - Smaller runner-up card beneath or beside it:
     - logo
     - name
     - “Runner Up” label
   - Optional small text with the nationals event name/date if available

4. **Preserve the existing leaderboard below**
   - Leave the current podium + standings list intact
   - Add spacing so the new banner feels like a celebratory header, not a replacement
   - This keeps the standings visible for users who still want to inspect points/ranking history

5. **Match existing visual conventions**
   - Reuse the amber/gold nationals identity already used in `CompetitionDetail.tsx`
   - Keep rounded cards, dark background, strong contrast, and mobile-first sizing
   - Make logos clickable to open team detail, matching current standings interactions

### Technical details
- Main file:
  - `src/pages/Index.tsx`
- Likely approach:
  - add a helper or `useMemo` to find the nationals competition and resolve placed teams
  - conditionally render a standalone JSX block above the existing podium section
- Data source:
  - use `competitions` + `teamsData`
- Show condition:
  - only when nationals competition exists and `firstplace` + `secondplace` resolve successfully
- Performance:
  - use memoized lookup
  - avoid animated glows/pulses
  - avoid expensive backdrop blur stacking

### Suggested UX structure
```text
[Header logo]

[Simulation alert if active]

[National Champions Banner]
  National Champion
  Team logo + name

  Runner Up
  Team logo + name

[Existing leaderboard podium]

[Existing ranked team list]
```

### Nice refinement
If you want it to feel even more “big moment” without adding lag, the champion card can have:
- a thin gold gradient border
- one subtle static radial glow behind the champion logo
- a trophy icon badge
But avoid particle effects, shimmer loops, or animated confetti.

### Result
When you enter nationals first and second place results, users will immediately see a premium championship banner above the standings, while the normal leaderboard remains available below for context.
