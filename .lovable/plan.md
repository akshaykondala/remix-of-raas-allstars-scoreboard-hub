

## Fix: Teams Tab Header Behind Notch

The standings tab already uses `paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)'` on its header container (line 395). The teams tab container at line 689 just has `className="px-4 py-6"` with no safe-area padding.

### Change

**`src/pages/Index.tsx`** — Line 689: Add the same safe-area top padding to the teams tab content wrapper:

```tsx
<div className="px-4 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}>
```

This replaces `py-6` with `pb-6` (keeping bottom padding) and adds the dynamic top padding via inline style, matching the pattern used in the standings tab.

