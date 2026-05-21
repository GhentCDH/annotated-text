# Conventions

## Project overview

- NX monorepo (`nx@22.4.5`) + `pnpm@10.8.1` (Node >= 22)
- Libs: `core` (main annotated-text lib), `markdown` (markdown adapter), `w3c` (W3C annotation adapter)
- E2E tests in top-level `e2e/` folder (separate NX project)
- Build: Vite 7 + Rollup for lib builds (CJS + ESM) with `vite-plugin-dts`
- Docs: VuePress 2 + `vuepress-theme-hope` in `docs/`

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

- Vitest for unit tests (jsdom environment)
- Playwright for e2e tests (in `e2e/` folder)
- Always use `describe`/`it` block structure
- Mock with `vi.fn()` / `vi.spyOn()`
- Prefer table testing with `it.each` using tagged template literal syntax when input simple/tabular:

```ts
it.each`
  name         | style
  ${'error'}   | ${errorStyle}
  ${'warning'} | ${warningStyle}
`('should handle "$name"', ({ name, style }) => {
  // ...
});
```

- Use array syntax for `it.each` only when rows contain functions or complex objects that don't fit table format
- Co-locate test files as `*.spec.ts` in `__tests__/` folder next to source file

## Git

- Conventional Commits
- Husky pre-commit hooks (lint-staged with prettier + eslint)

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring workspace, invoke `nx-workspace` skill first — has patterns for querying projects, targets, dependencies
- When running tasks (build, lint, test, e2e, etc.), always run through `nx` (`nx run`, `nx run-many`, `nx affected`) instead of underlying tooling directly
- Prefix nx commands with workspace package manager (e.g., `pnpm nx build`, `npm exec nx test`) — avoids globally installed CLI
- You have access to Nx MCP server and its tools, use them
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this — proceed without if unavailable.
- NEVER guess CLI flags — always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin config, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things already known
- `nx-generate` skill handles generator discovery internally — don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->