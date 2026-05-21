Run linting for this project.

If `$ARGUMENTS` specifies a project name, lint that specific project:

```
pnpm nx lint <project-name>
```

If `$ARGUMENTS` is empty, lint all affected projects:

```
pnpm nx affected -t lint --base=origin/main --parallel=5
```

If there are lint errors, analyze them and fix the issues. After fixing, re-run the lint command to verify the fix.
