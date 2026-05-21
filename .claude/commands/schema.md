Create or update a Zod schema following this project's conventions.

`$ARGUMENTS` should describe the schema name and purpose, and optionally the target path.

If no path is given, place it in the appropriate lib under `libs/`.

Follow these conventions:

1. Use Zod for schema definitions
2. Use arrow function expression syntax for any helper functions
3. Export the schema and its inferred TypeScript type:

```ts
import { z } from 'zod';

export const MySchema = z.object({
  // schema definition
});

export type MySchemaType = z.infer<typeof MySchema>;
```

4. If the schema has mappers or transformers, place them in a separate file next to the schema
5. Co-locate tests as `*.spec.ts` in a `__tests__/` folder next to the schema file
6. Export from the library's `index.ts` if the schema is part of the public API