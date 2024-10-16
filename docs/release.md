---
Release
---
## Creating a new release

Every release creates a new tag in the repository and a new release in the GitHub repository.
The package is published to the npm registry, when merged to the main branch.
The release notes are automatically generated based on the commit messages since the last release.


**Release patch**

```bash
pnpm run release --patch
```

**Release minor**

```bash
pnpm run release --minor
```

**Release major**

```bash
pnpm run release --major
```