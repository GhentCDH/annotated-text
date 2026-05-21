Run TypeScript type checking for this project.

If `$ARGUMENTS` specifies a project name, typecheck that specific project:

```
pnpm nx typecheck <project-name>
```

If `$ARGUMENTS` is empty, typecheck all affected projects:

```
pnpm nx affected -t typecheck --base=origin/main --parallel=5
```

If there are type errors, analyze them and fix the issues. After fixing, re-run the typecheck to verify.
