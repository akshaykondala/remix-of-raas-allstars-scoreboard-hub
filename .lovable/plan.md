

## Premium Nationals Placings Section

### What Changes

#### `src/components/CompetitionDetail.tsx`

Replace the current RAS "Results TBD" placeholder (lines 603-604) with a premium podium-style placings display showing 1st and 2nd place only:

- **Header**: Change to "National Champions" with amber/gold crown icon styling
- **1st Place card**: Large, prominent card with gold/amber gradient background, crown icon, large "TBD" text centered, subtle shimmer or glow effect, "National Champion" subtitle
- **2nd Place card**: Silver-themed card below, slightly smaller, "TBD" text, "Runner Up" subtitle
- Both cards use the amber/gold border treatment consistent with the RAS visual identity
- No 3rd place slot since nationals only has 1st and 2nd
- Remove the generic "Top 2 Placings" header text for RAS, replace with "National Champions"

### Files Changed
- `src/components/CompetitionDetail.tsx` — Replace RAS TBD placeholder with premium podium-style 1st/2nd place display

