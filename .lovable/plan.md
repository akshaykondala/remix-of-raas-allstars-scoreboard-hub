

## Performance Fix: Competition Detail Drawer

### Problem
The CompetitionDetail drawer is janky when dragging because:

1. **Heavy CSS animations running during drag** — `animate-ras-shimmer`, `animate-ras-glow`, `logo-glow-spin`, `animate-pulse` all run continuously inside the drawer, causing GPU compositing fights with the vaul drag transform
2. **Multiple `blur-xl`/`blur-2xl`/`blur-3xl` elements** — Lines 278, 309-311, 315-317 in the header create expensive blur layers that must be re-composited every frame during drag
3. **`willChange: 'transform'` on scroll container** — Line 250 promotes a massive layer for no benefit during drag
4. **Inline IIFE renders** — The lineup section (lines 485-533, 547-575) runs `.find()` lookups and sorts inside render without memoization
5. **728-line monolith** — Every state change re-evaluates the entire tree

### Plan

#### `src/components/CompetitionDetail.tsx`
- **Remove all blur elements** from the header (lines 278, 309-311, 315-317) — replace with simple solid/gradient backgrounds. These are the biggest perf killers on iOS Safari during compositing
- **Remove `animate-ras-shimmer`** from the 1st place TBD card (line 603) — continuous animation during drag
- **Remove `animate-pulse`** from live indicator elements inside the drawer
- **Remove the `logo-glow-spin` animated glow ring** (lines 258-269) — runs a blur+rotate animation on open
- **Remove the `logo-entrance` animation** (lines 271-276) — not worth the compositing cost
- **Remove `willChange: 'transform'`** from the scroll container (line 250)
- **Memoize the sorted RAS lineup** — move the `.sort()` + `.find()` calls in the lineup IIFE (lines 487-493) into a `useMemo`
- **Memoize the regular lineup render data** — same for non-RAS lineup (lines 547-575)

#### `src/components/CompetitionTimeline.tsx`
- **Remove RAS shimmer sweep** on the timeline card (lines 377-381) — continuous animation on a card that's always visible
- **Remove the `blur-3xl` glow elements** inside `TimelineCompetitionCard` (lines 309-317) — replace with simpler opaque backgrounds
- **Remove the animated holographic glow** behind the RAS timeline dot (lines 177-178) — `blur-sm` with `animate-ras-glow`

### Files Changed
- `src/components/CompetitionDetail.tsx` — strip blur/animation layers, memoize lineup data
- `src/components/CompetitionTimeline.tsx` — strip blur/animation layers from cards and RAS dot

