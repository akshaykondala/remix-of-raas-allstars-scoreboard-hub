

## Two Changes: Minimalist RAS Label + Judges Fallback for Nationals

### 1. Simplify "RAS" label on timeline dot

**File: `src/components/CompetitionTimeline.tsx` (line 199)**

Replace the rainbow gradient text with a simple, clean amber/gold label:
- Remove `bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent`
- Use a solid `text-amber-400` instead -- minimal, elegant, still stands out

### 2. Show location + date when no judges for RAS competitions

**File: `src/components/CompetitionDetail.tsx` (lines 535-556)**

In the Judges section, when `competition.ras` is true and the judges array is empty (no judges filled out), instead of showing an empty panel, display a stylish placeholder with the competition's city and formatted date. Something like:

```
  ── Houston, TX ──
  April 12, 2026
```

Styled with amber/gold tones to match the RAS theme -- centered text, elegant typography, subtle border treatment. When judges ARE filled out, the normal judge list renders as usual.

### Files Modified
- `src/components/CompetitionTimeline.tsx` -- line 199, simplify RAS label color
- `src/components/CompetitionDetail.tsx` -- lines 543-555, add RAS no-judges fallback

