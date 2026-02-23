

## Fix: RAS Field Not Connected + Add Logo Animation

### Root Cause

The `ras` field is **never mapped** in the main competition data pipeline in `src/pages/Index.tsx` (lines 89-119). Every other field is explicitly copied from the API response, but `ras` is missing. So `competition.ras` is always `undefined`, and the timeline/card styling never triggers.

The `CompetitionTimeline` component already has all the visual code for RAS -- it just never receives `ras: true`.

### Changes

**1. `src/pages/Index.tsx` (line ~118)** -- Add `ras` to the competition mapping

Add `ras: comp.ras === true || comp.ras === 'true',` alongside the other mapped fields (near `bid_status`). This is the only thing needed to make the timeline dot and card visuals work.

**2. `src/components/CompetitionDetail.tsx` (line ~246)** -- Add logo entrance animation

When the competition detail drawer opens, animate the logo with a scale + fade-in effect:
- Add CSS classes to the logo container: a scale-up from 0.5 to 1 with a slight bounce, plus fade-in
- Use Tailwind's `animate-` utility with a custom or inline animation
- Apply to both the image logo and the fallback icon versions
- Add a subtle rotating glow ring behind the logo that plays once on open

