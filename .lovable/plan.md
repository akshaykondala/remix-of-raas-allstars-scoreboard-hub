

## Adjust Drawer Height — Less Gap Above

Currently `7rem` (112px) gap above the drawer is too much. Reduce to `3.5rem` so the drawer sits just below the notch with minimal wasted space.

### Change

**`src/components/ui/drawer.tsx` line 23** — change `7rem` to `3.5rem`:

```tsx
style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - 3.5rem)' }}
```

This keeps the safe-area-inset accounting (stays below notch) but reduces the extra gap from ~112px to ~56px.

