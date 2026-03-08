

## Fix: LoadingScreen.tsx broken import

The error is on line 2 of `LoadingScreen.tsx` — it imports the logo using a relative path to the `public/` directory (`../../public/lovable-uploads/...`), which Vite doesn't allow. Files in `public/` must be referenced as URL strings, not ES module imports.

### File: `src/components/LoadingScreen.tsx`

Replace:
```ts
import logo from '../../public/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png';
```

With a simple constant:
```ts
const logo = '/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png';
```

This references the file via Vite's public directory serving (absolute URL path). No other changes needed.

