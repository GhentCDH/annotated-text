# Conventions

## Testing

- Use Vitest for unit tests
- Use Playwright for e2e tests
- Always use `describe`/`it` block structure
- Mock with `vi.fn()` / `vi.spyOn()`
- Use `vitest` for unit tests
- Prefer table testing with `it.each` using tagged template literal syntax when input is simple/tabular:

```ts
it.each`
  name           | style
  ${'error'}     | ${errorStyle}
  ${'warning'}   | ${warningStyle}
`('should handle "$name"', ({ name, style }) => {
  // ...
});
```

- Use array syntax for `it.each` only when rows contain functions or complex objects that don't fit a table format
- Co-locate test files as `*.spec.ts` in a folder __tests__ next to the source file

## Code style

- TypeScript strict mode
- pnpm for package management
- NX monorepo conventions
