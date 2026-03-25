# Conventions

## Project overview

- NX monorepo (`nx@22.4.5`) with `pnpm@10.8.1` (Node >= 22)
- Libs: `core` (main annotated-text library), `markdown` (markdown text adapter), `w3c` (W3C annotation adapter)
- E2E tests live in the top-level `e2e/` folder (separate NX project)
- Build: Vite 7 + Rollup for library builds (CJS + ESM) with `vite-plugin-dts`
- Docs: VuePress 2 with `vuepress-theme-hope` in `docs/`

## Code style

- TypeScript 5.9 strict mode
- pnpm for package management
- NX monorepo conventions
- Prefer `type` over `interface`
- Prefer arrow function expressions: `const functionName = () => {}`
- Prettier: single quotes (`"singleQuote": true`)
- ESLint v9 flat config (`eslint.config.js`)
- Stylelint for SCSS (`stylelint-config-standard-scss`)

## Styling

- SCSS for annotation styles in `libs/core/src/lib/style/`

## Testing

- Use Vitest for unit tests (jsdom environment)
- Use Playwright for e2e tests (in `e2e/` folder)
- Always use `describe`/`it` block structure
- Mock with `vi.fn()` / `vi.spyOn()`
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
- Co-locate test files as `*.spec.ts` in a `__tests__/` folder next to the source file

## Git

- Commit messages follow Conventional Commits
- Husky for pre-commit hooks (lint-staged with prettier + eslint)
