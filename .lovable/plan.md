

## Raise Drawer Slightly Higher

Reduce the offset from `3.5rem` to `2rem` in `src/components/ui/drawer.tsx`, line with the `maxHeight` style:

```tsx
style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - 2rem)' }}
```

One line change. Still safe-area aware, just ~24px less gap above.

