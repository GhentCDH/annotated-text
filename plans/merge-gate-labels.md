# Plan: `block` / `needs review` merge-gate labels

Shared across GhentCDH repos. Full plan: [crouton `plans/merge-gate-labels.md`](https://github.com/GhentCDH/crouton/blob/main/plans/merge-gate-labels.md).

This repo (status 🔄 PR open):

- `.github/workflows/merge-gate.yml` calls `GhentCDH/crouton/.github/workflows/shared-merge-gate.yml@main`. Merge only after the crouton PR that adds it.
- `block` + `needs review` labels in `.github/labels.yml`; AI branch prefix allowed in `.github/labeler.yml`.
- `merge-gate / gate` added to `.github/rulesets/main.json`. Apply with the `gh api -X PUT` command in `.github/rulesets/README.md` (admin).
- CLAUDE.md: AI branches start with `claude/`.

Verify: PR from `claude/test-gate` gets `needs review` and a red `merge-gate / gate`; removing the label turns it green.
