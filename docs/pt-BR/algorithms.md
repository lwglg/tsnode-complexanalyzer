# Algoritmos

**Idioma:** [English](../en/algorithms.md) · [Português (Brasil)](algorithms.md)

[← Início da documentação](README.md)

Os algoritmos embutidos ficam em `src/algorithms/`. Cada um é exercitado pela suíte em `src/index.ts` com hipóteses teóricas correspondentes.

## Ordenações por comparação

| Nome | Módulo | Tempo (esperado) | Espaço extra | Notas |
|------|--------|------------------|--------------|-------|
| merge-sort | `merge-sort.ts` | \( O(n \log n) \) | \( O(n) \) | Mergesort estável top-down |
| quick-sort | `quick-sort.ts` | \( O(n \log n) \) médio | \( O(\log n) \) pilha | Partição de Lomuto; cópia na entrada |
| heap-sort | `heap-sort.ts` | \( O(n \log n) \) | \( O(1) \) | Heapify in-place |
| bubble-sort | `bubble-sort.ts` | \( O(n^2) \) | \( O(1) \) | Trocas adjacentes clássicas |
| insertion-sort | `insertion-sort.ts` | \( O(n^2) \) | \( O(1) \) | Adaptativo em dados quase ordenados |
| selection-sort | `selection-sort.ts` | \( O(n^2) \) | \( O(1) \) | Sempre ~\( n^2/2 \) comparações |

## Linear / especial

| Nome | Módulo | Tempo (esperado) | Espaço extra | Notas |
|------|--------|------------------|--------------|-------|
| counting-sort | `counting-sort.ts` | \( O(n + k) \approx O(n) \) | \( O(n + k) \) | Demo com valores em \( [1, n] \) |
| array-sum | `linear-scan.ts` | \( O(n) \) | \( O(1) \) | Linha de base |
| find-max | `linear-scan.ts` | \( O(n) \) | \( O(1) \) | Linha de base |
| array-copy | `linear-scan.ts` | \( O(n) \) | \( O(n) \) | Força alocação |

## Presets de tamanho

| Preset | Uso típico | Exemplos de tamanhos |
|--------|------------|----------------------|
| `efficient` | Ordenações \( O(n \log n) \) | 1k … 100k |
| `quadratic` | Ordenações \( O(n^2) \) | 500 … 8k |
| `linear` | Varreduras lineares | 10k … 1M |

## Testes de correção

Testes unitários em `src/algorithms/__tests__/` verificam invariantes de ordenação (vazio, unitário, embaralhado, ordenado, reverso, duplicatas) e o comportamento das varreduras lineares.

## Próximos passos

- [Referência da API](api.md)
- [Estendendo com o seu algoritmo](extending.md)
