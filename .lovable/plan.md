

## Fix: Disable Hover Effects on Touch/Mobile Devices

### Problem
On mobile, scrolling triggers `hover:` and `group-hover:` effects on whatever element is under your finger. This causes cards to scale up, glow, and change borders mid-scroll, creating a jarring experience.

The custom `.hover-scale` and `.hover-glow` classes in `index.css` are already protected with `@media (hover: hover)`, but the many Tailwind `hover:` and `group-hover:` utilities used throughout the app (e.g., `hover:scale-[1.02]`, `group-hover:scale-110`, `hover:bg-slate-800/70`) are not.

### Solution
Add `hoverOnlyWhenSupported: true` to the Tailwind config. This is a built-in Tailwind v3 feature that wraps all `hover:` variants in `@media (hover: hover)`, so they only activate on devices with a real pointer (mouse/trackpad) -- not on touchscreens.

### Changes

**`tailwind.config.ts`** -- Add one line:
```ts
export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: ["class"],
  // ... rest unchanged
}
```

This single change fixes all `hover:` and `group-hover:` effects across the entire app (TeamCard, podium cards, competition cards, fantasy tab, buttons, etc.) without needing to touch any component files.

