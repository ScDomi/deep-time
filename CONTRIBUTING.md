# CONTRIBUTING.md

Thank you for your interest in Deep Time.

## How to contribute

1. Check the [open issues](https://github.com/ScDomi/deep-time/issues).
   - `dt-03` — all Geological Memory milestone work.
2. Comment on an issue before starting to avoid duplicate effort.
3. Fork the repo, create a branch named `feat/issue-N-short-description`.
4. Keep changes focused: one issue per PR.

## Development

```bash
npm ci
npm run dev     # Vite dev server
npm run typecheck
npm test        # Vitest unit tests
npm run build   # TypeScript + production bundle
```

TypeScript strict mode is on.  The simulation engine (`src/simulation.ts`) must remain a set of pure functions with no React imports.

## Tests

Every new feature needs at least one test.  The acceptance criteria in each issue describe what to test.  Run `npm test` before opening a PR; CI will also run it.

## Commit style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: short description (#issue-number)
fix: short description (#issue-number)
test: add/update tests for ...
docs: update README / comments
refactor: internal change with no behaviour change
```

## License

By contributing you agree that your code is released under the [MIT License](LICENSE).
