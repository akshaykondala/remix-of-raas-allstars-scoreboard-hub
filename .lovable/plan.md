

## Stack Competition Cards Vertically on Mobile

Currently, when a weekend has multiple competitions, the cards are arranged in a horizontal scrollable row with a fixed width of `w-80`. On iPhone screens, this means you can only see one card at a time and must scroll sideways to find others -- easy to miss.

### Change

In `src/components/CompetitionTimeline.tsx` (lines 197-202), update the competition cards layout so that:

- On mobile (default): cards stack vertically in a column with gaps between them
- On larger screens (sm/md+): keep the current horizontal scroll behavior

### What changes

- Replace the horizontal-only layout with a responsive approach:
  - Default: `flex-col` with full-width cards
  - `sm:` breakpoint and up: revert to `flex-row` with `overflow-x-auto` and `w-80` fixed-width cards
- Each card will be `w-full` on mobile instead of `w-80`

This is a small, targeted CSS change in the competition cards container section of `CompetitionTimeline.tsx`.
