

## Add Rank Numbers (4-9) on Leaderboard

### What Changes

**File: `src/pages/Index.tsx` (lines ~671-682)**

Add a rank number badge to each team card in the 4-9 qualified section, matching the style used for teams 10+ but with a blue/purple tint to indicate they're above the cutoff.

Insert a rank badge between the team logo and info, similar to how ranks 10+ show their number. The badge will sit to the left of the team logo:

```
<div className="w-8 h-8 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
  <span className="text-blue-300 font-bold text-sm">{rank}</span>
</div>
```

This gets inserted inside the `flex items-center gap-4` div, before the team logo div.

### Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` (~line 671) | Add rank number badge (4-9) before team logo in qualified teams section |

