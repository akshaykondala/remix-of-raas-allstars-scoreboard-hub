

## Add "Raas All Stars" (Nationals) Special Treatment

### Overview
Add a `ras` boolean field to competitions. When enabled, that competition is Nationals (Raas All Stars). The timeline dot and competition card will get a premium, standout visual treatment -- distinct from regular, bid, and live competitions.

### Changes

**1. Type Update (`src/lib/types.ts`)**
- Add `ras?: boolean` to the `Competition` interface

**2. API Update (`src/lib/api.ts`)**
- Map the `ras` field from Directus data onto the competition object

**3. Timeline Dot -- Nationals Treatment (`src/components/CompetitionTimeline.tsx`)**

When a weekend group contains a `ras: true` competition, the timeline dot gets a unique nationals style:
- Diamond/star-shaped dot instead of a circle (rotated square with a crown/trophy icon)
- Animated rainbow/holographic gradient glow ring (cycling through gold, cyan, magenta, purple)
- "RAS" micro-label beneath the date
- Larger dot size than regular weekends
- Multi-layered animated pulse rings when active

**4. Competition Card -- Nationals Treatment (`src/components/CompetitionTimeline.tsx`)**

The `TimelineCompetitionCard` will detect `competition.ras` and apply a premium card style:
- Animated gradient border cycling through gold/purple/cyan (holographic shimmer effect)
- Thicker top accent bar with a multi-color gradient
- Larger background glow orbs with richer colors
- A small "NATIONALS" badge/chip in the top-right corner
- Enhanced shine sweep on hover
- The card content layout stays the same (logo, name, city)

### Technical Details

- The `ras` check is a simple boolean: `const isRAS = competition.ras === true`
- In the timeline dot section, check `group.competitions.some(c => c.ras)` to determine if a weekend is nationals
- RAS styling takes highest priority: RAS > Live > Bid > Regular
- CSS animations for the holographic border use inline `@keyframes` via style props or Tailwind's `animate-` utilities with custom keyframes added to `tailwind.config.ts`
- A new `ras-glow` keyframe will be added to `tailwind.config.ts` for the cycling gradient animation

### Files Modified
1. `src/lib/types.ts` -- add `ras` field
2. `src/lib/api.ts` -- map `ras` from Directus
3. `src/components/CompetitionTimeline.tsx` -- special dot + special card visuals
4. `tailwind.config.ts` -- add `ras-glow` animation keyframe

