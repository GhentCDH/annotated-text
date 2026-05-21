Create a new Vue composable following this project's conventions.

`$ARGUMENTS` should contain the composable name and optionally the target path.
Format: `useFeatureName [path/to/target]`

If no path is given, ask the user where the composable should be created.

Follow these conventions:

1. Place the composable in a `composables/` folder next to the component that uses it
2. Name the file `useFeatureName.ts` (must start with `use`)
3. Use arrow function expression syntax:

```ts
import { ref, computed } from 'vue';

export const useFeatureName = () => {
  // reactive state
  // computed properties
  // methods

  return {
    // expose public API
  };
};
```

Key rules:
- Use `const functionName = () => {}` arrow function syntax
- Prefix with `use` (e.g., `useSearch`, `useOptions`, `useEditorState`)
- Export from the file for use in components
- Keep composables focused on a single concern
- Use TypeScript strict mode with proper typing