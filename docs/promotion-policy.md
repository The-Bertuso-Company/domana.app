Promotion Policy - Preview to Staging to Prod

Branches
- main = Production
- staging = Staging (candidate for next Prod)
- Feature or PR branches = Preview deploys

Promotion Rules
Preview to Staging:
- Source: PR from feature branch into staging
- Required: build, typecheck, lint, unit tests pass in CI; 1 code-owner approval
- Result: deploys to staging.domana.app

Staging to Prod:
- Source: PR from staging into main
- Required: all checks above plus quick smoke test on staging
- Result: deploys to domana.app

Indexing
- Only Production is indexable. Staging and Preview are noindex via robots and X-Robots-Tag.

Release Notes
- Keep a short changelog in the PR description.
