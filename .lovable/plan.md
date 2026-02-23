
## Replace RAS Timeline Dot with Competition Logo + Minimal Holographic Effects

### What Changes

**`src/components/CompetitionTimeline.tsx` (lines 150, 163-207)**

Replace the current diamond-shaped dot with the RAS competition's actual logo, plus a subtle holographic glow:

1. **Get the RAS logo from the group**: Extract the logo URL from the first RAS competition in the weekend group (`group.competitions.find(c => c.ras)?.logo`)

2. **Replace the entire RAS dot block (lines 165-179)** with:
   - A small circular logo image (~20x20px, `w-5 h-5 rounded-full object-cover`) as the dot
   - One subtle holographic glow ring behind it using `animate-ras-glow` (the existing animation, just toned down -- a `w-7 h-7` blurred circle at ~30% opacity with the rainbow gradient)
   - No pulse rings, no diamond shape, no Crown icon

3. **Keep the "RAS" micro-label** below (lines 199-202) -- it already looks clean

4. **Keep the amber date label** styling (line 158) as-is

### Result

The RAS weekend dot becomes: the actual RAS logo as a tiny circle on the timeline, with a soft rainbow glow halo behind it and a "RAS" label underneath. Minimal but unmistakably special.

### Technical Detail

```text
Before:                        After:
  [diamond + crown icon]         [circular logo image]
  [2 pulse rings]                [1 subtle glow ring]
  [holographic ring]             
  "RAS" label                    "RAS" label
```

### Files Modified
- `src/components/CompetitionTimeline.tsx` -- replace RAS dot markup (lines 165-179)
