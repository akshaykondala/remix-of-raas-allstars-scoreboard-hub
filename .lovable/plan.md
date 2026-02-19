

## Fix Safari Blur Rendering Artifacts (Revised Approach)

### Problem
The previous fix (adding `transform-gpu`) did not resolve the Safari rendering bug. Safari still shows visible rectangular bounding boxes around elements that use CSS `blur` filter on absolutely-positioned divs. This is visible on:
- The 1st place podium card (dark rectangle around rounded gold card)
- The logo/header area (rectangular glow box behind the star logo)

### Why transform-gpu Didn't Work
Safari's rendering engine draws the rectangular bounding box of any element with a `filter: blur()` applied, regardless of GPU compositing hints. The only reliable fix is to stop using blur-based glow divs altogether.

### Solution
Replace all blur-based glow divs with CSS `box-shadow` and `drop-shadow` on the actual card/element itself. Box shadows are rendered natively by the browser compositor and never produce rectangular artifacts.

### Changes

**`src/pages/Index.tsx`**

1. **Remove all "glow" blur divs** -- Delete the 9 absolutely-positioned glow divs in the podium section:
   - Line 1086: 2nd place card glow div (blur-xl)
   - Line 1092: 2nd place avatar glow div (blur-lg)
   - Line 1106: 2nd place points glow div (blur-md)
   - Line 1124: 1st place card glow div (blur-2xl)
   - Line 1130: 1st place avatar glow div (blur-xl)
   - Line 1144: 1st place points glow div (blur-md)
   - Line 1162: 3rd place card glow div (blur-xl)
   - Line 1168: 3rd place avatar glow div (blur-lg)
   - Line 1182: 3rd place points glow div (blur-md)

2. **Add box-shadow equivalents** to the actual card containers and avatar circles:
   - 1st place card: add a warm amber/orange box-shadow glow
   - 2nd place card: add a subtle silver/slate box-shadow glow
   - 3rd place card: add a warm orange/red box-shadow glow
   - Avatar circles: add matching colored box-shadow for the floating glow effect
   - Points badges: add subtle matching box-shadow

3. **Background decorative blobs (lines 997-999)**: These are fine since they are large ambient background elements inside an `overflow-hidden` container. They likely aren't causing the visible issue. Leave them as-is.

### Technical Details

Example transformation for 1st place card:

Before (causes Safari artifacts):
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-500/60 rounded-3xl blur-2xl transform-gpu"></div>
<div className="relative bg-gradient-to-br from-yellow-400/90 to-orange-500/95 rounded-3xl p-5 h-40 ...">
```

After (Safari-safe):
```tsx
{/* glow div removed */}
<div className="relative bg-gradient-to-br from-yellow-400/90 to-orange-500/95 rounded-3xl p-5 h-40 ..."
  style={{ boxShadow: '0 0 30px 8px rgba(245, 158, 11, 0.4), 0 0 60px 16px rgba(234, 88, 12, 0.2)' }}>
```

### Files to modify
- `src/pages/Index.tsx` -- remove 9 blur glow divs, add box-shadow styles to cards/avatars/badges

