---
Release
---

## Creating a new release

```bash
pnpm release                      # bump derived from the conventional commits since the last tag
pnpm release --specifier=patch    # or minor / major to force it
```

This checks out `main`, bumps the versions, updates `RELEASE_NOTES.md`, commits, tags and pushes.
Nothing is published from your machine.

The pushed tag triggers two workflows on GitHub:

- **Publish**: publishes the packages to npm and creates the GitHub release, with notes generated from the merged
  pull requests (grouped by label, see `.github/release.yml`).
- **Publish Docs**: builds and deploys the documentation site.
