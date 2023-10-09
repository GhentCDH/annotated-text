# Contributing Guide

We're really excited that you are interested in contributing. Please take a moment to read through our [Code of Conduct](CODE_OF_CONDUCT.md) first. All contributions (participation in discussions, issues, pull requests, ...) are welcome. Unfortunately, we cannot make commitments that issues will be resolved or pull requests will be merged swiftly, especially for new features.

## Recommended IDE Setup

* [VSCode](https://code.visualstudio.com/)
* [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
* [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
* [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
* [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Useful commands

### Install development dependencies

```sh
yarn install
```

### Compile and Hot-Reload for Development (only Vue 3)

```sh
yarn dev
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

#### Vue 2

```sh
yarn test:vue2
```

#### Vue 3

```sh
yarn test:vue3
```

#### Coverage

```sh
yarn test:coverage
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

### Type check

```sh
yarn type-check
```

### Compile and Hot-Reload documentation with [VitePress](https://vitepress.vuejs.org/)

```sh
yarn docs:dev
```
