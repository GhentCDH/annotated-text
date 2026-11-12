# Branch rulesets

GitHub does not read these files. `main.json` is the source for the `main` ruleset of this repo; apply it with
the API after changing it (needs repo admin).

```sh
# first time
gh api -X POST repos/GhentCDH/annotated-text/rulesets --input .github/rulesets/main.json

# update: look up the id, then replace
gh api repos/GhentCDH/annotated-text/rulesets -q '.[] | "\(.id) \(.name)"'
gh api -X PUT repos/GhentCDH/annotated-text/rulesets/<id> --input .github/rulesets/main.json
```

What it enforces on the default branch:

- no deletion, no force push
- changes go through a pull request (0 approvals required)
- required checks: `ci / build`, `ci / lint`, `test`, `e2e`
- repository admins bypass all of the above; `pnpm release` pushes the release commit and tag directly, so it
  must be run by an admin

Required check names come from the workflow job names (`ci / …` = jobs of the shared CI workflow). Update
`main.json` when a job is renamed, otherwise pull requests wait forever on a check that never reports.

## `tags.json`: release tags

A `v*` tag triggers the `Publish` workflow, so pushing one is publishing to npm. This ruleset lets only repository
admins create, move or delete `v*` tags.

```sh
gh api -X POST repos/GhentCDH/annotated-text/rulesets --input .github/rulesets/tags.json
```
