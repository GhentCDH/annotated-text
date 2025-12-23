# Contributing to @ghentcdh/annotated-text

Thank you for your interest in contributing to the annotated-text library! This document provides guidelines and
instructions for contributing.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 22
- **pnpm** >= 10

You can verify your versions with:

```bash
node --version
pnpm --version
```

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/annotated-text.git
   cd annotated-text
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up Git hooks:

   ```bash
   pnpm prepare
   ```

## Project Structure

This is an [Nx](https://nx.dev/) monorepo. Key directories include:

```
annotated-text/
├── packages/           # Library packages
├── apps/               # Demo applications
├── docs/               # Documentation (VitePress)
├── tools/              # Build and release scripts
└── dist/               # Build output
```

## Development Workflow

### Running the Development Server

```bash
pnpm nx serve docs
```

### Building

```bash
pnpm nx build docs
```

To build all projects:

```bash
pnpm nx run-many -t build
```

### Running Tests

Unit tests use [Vitest](https://vitest.dev/):

```bash
pnpm nx test core
```

End-to-end tests use [Playwright](https://playwright.dev/):

```bash
pnpm nx e2e docs
```

### Linting

```bash
pnpm nx lint <project-name>
```

## Code Style

This project uses automated code formatting and linting:

- **ESLint** for JavaScript/TypeScript/Vue linting
- **Prettier** for code formatting
- **Stylelint** for CSS/SCSS linting

Pre-commit hooks (via Husky and lint-staged) automatically format and lint staged files. To manually format your code:

```bash
pnpm prettier --write "**/*.{js,ts,vue,css,scss}"
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. This enables automatic
changelog generation.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build config, etc.)

### Examples

```
feat(renderer): add curved underline style option
fix(highlight): correct color opacity calculation
docs: update API reference for AnnotationManager
```

## Pull Request Process

1. Create a new branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes and commit using conventional commit messages

3. Ensure all tests pass:

   ```bash
   pnpm nx run-many -t test
   pnpm nx run-many -t lint
   ```

4. Push your branch and open a pull request against `main`

5. Fill out the pull request template, describing your changes

6. Wait for review—address any feedback from maintainers

## Reporting Issues

When reporting bugs, please include:

- A clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS information
- Minimal reproduction (if possible)

## Questions?

If you have questions or need help, feel free to open
a [GitHub Discussion](https://github.com/GhentCDH/annotated-text/discussions) or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
