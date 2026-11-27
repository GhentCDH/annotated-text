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
- required checks: `ci / build`, `ci / lint`, `test`, `e2e`, `merge-gate / gate`
- repository admins bypass all of the above; `pnpm release` pushes the release commit and tag directly, so it
  must be run by an admin

Required check names come from the workflow job names (`ci / …` = jobs of the shared CI workflow). Update
`main.json` when a job is renamed, otherwise pull requests wait forever on a check that never reports.

### Merge-gate labels: `block` and `needs review`

Required check `merge-gate / gate` (`.github/workflows/merge-gate.yml`, calls
`GhentCDH/crouton/.github/workflows/shared-merge-gate.yml`) fails while the PR has one of these labels:

- `block`: set by hand. Merge impossible until someone removes it.
- `needs review`: added automatically when the PR branch starts with `ai/`, `claude/`, `copilot/` or `codex/`, on
  open and on every push. Remove it after reviewing the AI-written change; the next AI push adds it again.

Removing a label re-runs the check, no new push needed. Do not tick "bypass rules" to merge past these labels.

## `tags.json`: release tags

A `v*` tag triggers the `Publish` workflow, so pushing one is publishing to npm. This ruleset lets only repository
admins create, move or delete `v*` tags.

```sh
gh api -X POST repos/GhentCDH/annotated-text/rulesets --input .github/rulesets/tags.json
```
