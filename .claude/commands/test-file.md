Create a test file for an existing source file.

`$ARGUMENTS` should be the path to the source file to test.

Follow these conventions:

1. Place the test file in a `__tests__/` folder next to the source file
2. Name it `<source-file-name>.spec.ts`
3. Use `describe`/`it` block structure
4. Mock with `vi.fn()` / `vi.spyOn()`
5. Prefer table testing with `it.each` using tagged template literal syntax when input is simple/tabular:

```ts
import { describe, it, expect } from 'vitest';

describe('FeatureName', () => {
  it.each`
    input        | expected
    ${'value1'}  | ${'result1'}
    ${'value2'}  | ${'result2'}
  `('should handle $input', ({ input, expected }) => {
    // test implementation
  });

  it('should do something specific', () => {
    // test implementation
  });
});
```

6. Use array syntax for `it.each` only when rows contain functions or complex objects
7. Read the source file first to understand what needs testing, then create comprehensive tests

After creating the test file, run the tests to verify they pass:
```
pnpm nx test <project-name>
```