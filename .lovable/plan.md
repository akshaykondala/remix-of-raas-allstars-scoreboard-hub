

## Mobile-First Bug Fixes and Native App Feel

This plan addresses four key issues: scroll cutoff in detail drawers, phantom hover highlights during touch scrolling, incomplete scrolling on the main page, and making the app feel less "web-like" for mobile.

### Issue 1: Scroll Cutoff in Team/Competition Detail Drawers

The Drawer components (`TeamDetail`, `CompetitionDetail`) use `h-[98vh]` but don't account for the drag handle bar at the top consuming space. Content at the bottom gets cut off.

**Fix:** Add generous bottom padding (`pb-16`) to the scrollable content area inside both `TeamDetail.tsx` and `CompetitionDetail.tsx` drawers, ensuring the last elements are always reachable.

### Issue 2: Phantom Hover Highlights on Mobile

Team cards in `Index.tsx` use `hover:scale-[1.02]`, `hover:bg-slate-800/70`, and `group-hover:` effects. On mobile, these trigger during touch scrolling when your finger passes over a card, causing random cards to flash/highlight.

**Fix:** 
- Add a CSS media query utility in `index.css` that restricts hover effects to devices with actual hover capability: `@media (hover: hover)` 
- Replace `hover:` classes on team list items and podium cards with a custom class that only applies on true hover devices
- Alternatively, use the simpler approach: add `@media (hover: hover)` wrapper in CSS for the interactive scale/glow effects, and keep `active:scale-[0.98]` for touch feedback

### Issue 3: Can't Scroll All the Way Down

The main page uses `min-h-screen max-h-screen overflow-hidden` on the container. The bottom navigation bar is `fixed` at the bottom with `h-16`. The tab content areas have `pb-20` which should be enough, but the outer container's `max-h-screen overflow-hidden` combined with `h-screen flex flex-col` on the Tabs can clip content.

**Fix:** Ensure `pb-24` (instead of `pb-20`) on all `TabsContent` areas to give extra clearance for the fixed bottom nav. Also verify the flex layout chain doesn't clip the scroll container.

### Issue 4: Make It Feel Like a Native App

Several changes to remove the "web" feel:

- **Disable text selection** globally: add `-webkit-user-select: none; user-select: none` to the body (except inputs/textareas)
- **Disable long-press context menu**: add `-webkit-touch-callout: none` 
- **Disable tap highlight**: add `-webkit-tap-highlight-color: transparent`
- **Smooth momentum scrolling**: add `-webkit-overflow-scrolling: touch` on scroll containers
- **Remove cursor-pointer**: These are invisible on mobile but signal web-thinking; keep them for desktop but they won't affect mobile
- **Safe area insets**: Use `env(safe-area-inset-bottom)` on the bottom nav bar for notched phones
- **Overscroll behavior**: Add `overscroll-behavior: none` to prevent the browser bounce/pull-to-refresh behavior that feels web-like

### Files to Modify

1. **`src/index.css`** - Add native-feel global styles (tap highlight, text selection, touch callout, overscroll, hover media query utility)
2. **`src/pages/Index.tsx`** - Increase bottom padding on TabsContent, add safe-area to bottom nav, wrap hover effects in hover-capable media query classes  
3. **`src/components/TeamDetail.tsx`** - Add bottom padding to scrollable content
4. **`src/components/CompetitionDetail.tsx`** - Add bottom padding to scrollable content
5. **`src/components/TeamCard.tsx`** - Guard hover effects with media query classes (if used in current views)

