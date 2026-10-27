# Qualidade

**Idioma:** [English](../en/quality.md) · [Português (Brasil)](quality.md)

[← Início da documentação](README.md)

## Comandos locais

```bash
pnpm format          # Prettier (escreve)
pnpm format:check
pnpm lint            # ESLint
pnpm lint:fix
pnpm test            # Vitest
pnpm test:coverage   # falha se cobertura < 80%
pnpm check           # typecheck + lint + format + cobertura
```

## ESLint (flat config)

| Regra | Papel |
|-------|-------|
| `complexity` | Complexidade ciclomática de McCabe (aviso se > 10) |
| `simple-import-sort/*` | Ordem de imports / exports |
| `@typescript-eslint/consistent-type-imports` | Preferir `import type` |
| `no-multiple-empty-lines` | No máximo uma linha em branco consecutiva |
| `padding-line-between-statements` | Linha em branco após imports |

Arquivo: `eslint.config.js`. Configs de tooling (`*.config.ts`) ficam fora do project service tipado.

## Prettier

Configuração: **`.prettierrc.json`**. Lista de ignore: `.prettierignore`.

## Testes e cobertura

- Runner: **Vitest** + `@vitest/coverage-v8`
- Limiares (linhas, funções, branches, statements): **≥ 80%**
- Config: `vitest.config.ts`
- Suítes em `src/**/__tests__/`

`src/index.ts` (suíte CLI) e arquivos só de tipos são excluídos do denominador de cobertura.

## CI

| Plataforma | Manifesto |
|------------|-----------|
| GitHub Actions | `.github/workflows/ci.yml` |
| GitLab CI | `.gitlab-ci.yml` |

Pipeline: install → typecheck → lint → format check → test + cobertura → build.
