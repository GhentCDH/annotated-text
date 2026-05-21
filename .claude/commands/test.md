Run tests for this project.

If `$ARGUMENTS` specifies a project name, run tests for that specific project:

```
pnpm nx test <project-name>
```

If `$ARGUMENTS` is empty, run tests for all affected projects:

```
pnpm nx affected -t test --base=origin/main --parallel=5
```

If tests fail, analyze the failures and suggest or apply fixes. After fixing, re-run the failing tests to verify.
