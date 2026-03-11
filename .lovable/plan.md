

## Fix: Restore Timeline Position After Heading Removal

The heading was removed but the surrounding spacing that kept the timeline pushed below the notch was also lost. The fix is to add back the safe-area top padding to the container while keeping the heading gone.

### Change

**`src/components/CompetitionsTab.tsx`** — Line 170: Add safe-area top padding to the outer div:

```tsx
return <div className="pb-4 w-full overflow-hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}>
```

This restores the vertical position of the timeline to where it was before (below the notch) without bringing back the "Competitions" heading text.

