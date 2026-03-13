

## Bubble Logic — Diagnosis

The code is correctly wired across all 5 files. After reviewing:

- **`api.ts`** maps `team.bubble === true || team.bubble === 'true'` — handles boolean and string
- **`Index.tsx`**, **`TeamDetail.tsx`**, **`TeamDetailPage.tsx`** all conditionally render the amber badge when `team.bubble` is truthy
- The Directus query uses `fields=*` which includes all fields

**The frontend logic is correct.** The issue is almost certainly one of these backend causes:

1. **Field name mismatch** — The Directus field might not be named exactly `bubble` (e.g., `on_the_bubble`, `is_bubble`, etc.)
2. **Directus returns `1`/`0` instead of `true`/`false`** — Toggle fields in Directus often return `1`/`0` (integers), which wouldn't match `=== true` or `=== 'true'`

### Fix

In **`src/lib/api.ts`** line 164, change the bubble check to also handle `1`/`0` and other truthy values:

```ts
bubble: team.bubble === true || team.bubble === 'true' || team.bubble === 1 || team.bubble === '1',
```

Also add a temporary `console.log` to debug what Directus actually returns, so we can confirm:

```ts
console.log('[DEBUG] team bubble raw:', team.name, team.bubble, typeof team.bubble);
```

### Files to Change
- **`src/lib/api.ts`** — Broaden the `bubble` truthiness check to handle integer `1`/`0` (common Directus toggle format), and add a debug log

