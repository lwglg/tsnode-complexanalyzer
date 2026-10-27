# Quality assurance

**Language:** [English](quality.md) · [Português (Brasil)](../pt-BR/quality.md)

[← Documentation home](README.md)

## Local commands

```bash
pnpm format          # Prettier write
pnpm format:check
pnpm lint            # ESLint
pnpm lint:fix
pnpm test            # Vitest
pnpm test:coverage   # fails if coverage < 80%
pnpm check           # typecheck + lint + format + coverage
```

## ESLint (flat config)

| Rule | Role |
|------|------|
| `complexity` | McCabe cyclomatic complexity (warn if > 10) |
| `simple-import-sort/*` | Import / export order |
| `@typescript-eslint/consistent-type-imports` | Prefer `import type` |
| `no-multiple-empty-lines` | At most one consecutive blank line |
| `padding-line-between-statements` | Blank line after imports |

Config file: `eslint.config.js`. Tooling configs (`*.config.ts`) are ignored by the type-aware project service.

## Prettier

Config: **`.prettierrc.json`** (explicit JSON). Ignore list: `.prettierignore`.

## Tests & coverage

- Runner: **Vitest** + `@vitest/coverage-v8`
- Thresholds (lines, functions, branches, statements): **≥ 80%**
- Config: `vitest.config.ts`
- Suites under `src/**/__tests__/`

`src/index.ts` (CLI suite) and pure type files are excluded from coverage denominators.

## CI

| Platform | Manifest |
|----------|----------|
| GitHub Actions | `.github/workflows/ci.yml` |
| GitLab CI | `.gitlab-ci.yml` |

Pipeline: install → typecheck → lint → format check → test + coverage → build.
