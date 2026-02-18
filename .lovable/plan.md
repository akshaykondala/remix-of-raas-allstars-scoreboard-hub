

## Animate Loading Logo into Header Logo

The loading screen logo (centered, 112px) will smoothly fly/shrink into the header logo position (top-center, 48px tall) when loading completes, creating a seamless transition.

### Approach

1. **Track logo position**: Use `useRef` on the header logo to get its final position, and calculate the loading screen logo's starting position (center of screen).

2. **Shared animation state**: Instead of a simple fade-out, the loading screen will:
   - Keep the logo visible while fading out the background blobs and dots
   - Animate the logo from center-screen (w-28/h-28) to the header position (h-12) using CSS transitions on `top`, `left`, `width`, `height`, and `transform`
   - Once the logo reaches its destination, complete the transition

3. **Implementation details**:
   - **LoadingScreen.tsx**: Add a new "transitioning" phase between loading and complete. When progress hits 100%, the blobs/dots fade out, then the logo animates to target coordinates passed as props (`targetRect`).
   - **Index.tsx**: Use a `ref` on the header logo image. Pass the header logo's bounding rect to `LoadingScreen` so it knows where to animate to. Hide the header logo until the animation completes.
   - The logo will use `position: fixed` and transition from `top: 50%, left: 50%, transform: translate(-50%, -50%)` to the exact `top`/`left`/`width`/`height` of the header logo element.

### Technical Steps

1. **Modify `LoadingScreen.tsx`**:
   - Accept a `targetRef` prop (React ref to the header logo)
   - Add a `transitioning` state that triggers after progress completes
   - In transitioning phase: fade out blobs/dots, then animate logo position/size using inline styles with CSS `transition`
   - Call `onComplete` after the position animation finishes

2. **Modify `Index.tsx`**:
   - Add a `ref` to the header logo `<img>` element
   - Pass this ref to `LoadingScreen`
   - Keep the header logo invisible (`opacity-0`) until loading completes, then fade it in

3. **Modify `src/index.css`**:
   - Add a `logo-travel` transition utility if needed for the smooth position/size interpolation
