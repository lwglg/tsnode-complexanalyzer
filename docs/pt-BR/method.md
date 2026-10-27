# Fundamento matemático

**Idioma:** [English](../en/method.md) · [Português (Brasil)](method.md)

[← Início da documentação](README.md)

Esta página explica a análise assintótica (Big-O) e como o **tsnode-complexanalyzer** transforma essas ideias em um procedimento experimental para tempo e espaço.

---

## 1. Tamanho do problema e funções de custo

Seja \( n \in \mathbb{N} \) o **tamanho do problema** (por exemplo, o comprimento de um vetor de entrada).

Um algoritmo determinístico induz uma **função de custo**

\[
f : \mathbb{N} \to \mathbb{R}_{>0}
\]

em que \( f(n) \) pode contar operações elementares, milissegundos de parede ou bytes de memória. Na teoria costumamos raciocinar em contagens de operações; na prática medimos recursos físicos.

---

## 2. Big-O (limitante superior assintótico)

Dizemos que \( f(n) = O(g(n)) \) se existem constantes \( k > 0 \) e \( n_0 \in \mathbb{N} \) tais que

\[
\forall\, n \ge n_0,\quad f(n) \le k \cdot g(n).
\]

Intuitivamente: para entradas suficientemente grandes, \( f \) **não cresce mais rápido** do que um múltiplo constante de \( g \).

Funções de comparação \( g \) comuns:

| Classe | \( g(n) \) | Algoritmos típicos |
|--------|------------|--------------------|
| Constante | \( 1 \) | Busca em hash (amortizado) |
| Logarítmica | \( \log n \) | Busca binária |
| Linear | \( n \) | Uma passagem pelo vetor |
| Quase linear | \( n \log n \) | Mergesort, heapsort |
| Quadrática | \( n^2 \) | Laços aninhados ingênuos |
| Cúbica / polinomial | \( n^c \) | Multiplicação densa de matrizes (\( c = 3 \)) |
| Exponencial | \( 2^n \) | Subconjuntos recursivos ingênuos |

Notações relacionadas:

- \( f = \Omega(g) \): limitante **inferior** assintótico  
- \( f = \Theta(g) \): limitante justo (\( O \) e \( \Omega \) ao mesmo tempo)

---

## 3. Da teoria à medição

Provas formais de \( O(g) \) exigem analisar o código — o que pode ser inviável em legado, bibliotecas de terceiros ou código com constantes grandes e efeitos de memória.

**Abordagem empírica:** medir o custo real \( T_{\mathrm{meas}}(n) \) (ou \( S_{\mathrm{meas}}(n) \) para espaço) para \( n \) crescentes e **testar uma hipótese** \( g(n) \) estudando a razão adimensional

\[
k(n) \;=\; \frac{g(n)}{T_{\mathrm{meas}}(n)}.
\]

### 3.1 Interpretação de \( k(n) \)

| Comportamento de \( k(n) \) conforme \( n \) cresce | Conclusão sobre a hipótese \( g \) |
|-----------------------------------------------------|--------------------------------------|
| Converge para uma **constante positiva** | \( g \) é uma ordem plausível para \( T_{\mathrm{meas}} \) |
| Tende a **0** | \( g \) cresce **devagar demais** (subestimativa) |
| Diverge para \( +\infty \) | \( g \) cresce **rápido demais** (superestimativa) |

Isso espelha a forma limite da definição de Big-O:

\[
\limsup_{n \to \infty} \frac{f(n)}{g(n)} < \infty
\quad\Longleftrightarrow\quad f = O(g)
\]

(sob hipóteses leves de positividade). Empiricamente só observamos um intervalo finito de \( n \); a convergência de \( k(n) \) é **evidência**, não prova.

### 3.2 Fator de escala / conversão

Contagens de operações e milissegundos vivem em unidades diferentes. A ferramenta pode escalar \( g \) por um fator dependente da máquina (por exemplo, “operações por milissegundo”) para que \( k(n) \) fique perto da ordem 1 quando o formato estiver correto:

\[
T_{\mathrm{theory}}(n) \;=\; \frac{g(n)}{\alpha},
\qquad
k(n) \;=\; \frac{T_{\mathrm{theory}}(n)}{T_{\mathrm{meas}}(n)}.
\]

O **formato** de \( k(n) \) importa mais do que o valor exato de \( \alpha \). Ajuste \( \alpha \) via `makeTimeGuess(shape, opsPerMs)`.

---

## 4. Como o projeto aplica isso

### 4.1 Tempo

1. Gera entradas aleatórias de tamanho \( n \) (PRNG com semente para reprodutibilidade).
2. Aquece o JIT; opcionalmente força o GC.
3. Executa o algoritmo \( R \) vezes; usa a **mediana** do tempo de parede como \( T_{\mathrm{meas}}(n) \).
4. Avalia a hipótese \( g(n) \) fornecida pelo usuário (ex.: \( n \log_2 n \)).
5. Registra \( k_{\mathrm{time}}(n) = T_{\mathrm{theory}}(n) / T_{\mathrm{meas}}(n) \).
6. Repete para uma sequência de tamanhos e inspeciona a série.

Implementação: `src/core/measure.ts`, `src/core/runner.ts`, hipóteses em `src/core/guesses.ts`.

### 4.2 Espaço

A mesma ideia de razão vale para memória:

\[
k_{\mathrm{space}}(n) \;=\; \frac{S_{\mathrm{theory}}(n)}{S_{\mathrm{obs}}(n)},
\]

em que \( S_{\mathrm{obs}} \) deriva de `process.memoryUsage().heapUsed` (delta e pico, com proteção contra deltas negativos do GC). Modelos teóricos incluem espaço extra linear, profundidade de pilha logarítmica e espaço extra constante.

### 4.3 Higiene estatística

| Prática | Motivo |
|---------|--------|
| Execuções de aquecimento | Reduz ruído do JIT do V8 |
| Várias repetições + mediana | Robustez a outliers |
| Entradas com semente | Sequências reproduzíveis |
| `--expose-gc` opcional | Deltas de heap mais estáveis |
| Captura de ambiente | Modelo de CPU e versão do Node no JSON |

### 4.4 O que isto *não* é

- Não é prova formal de Big-O.
- Não substitui profilers de produção (`clinic`, Chrome DevTools, etc.).
- As razões dependem de máquina e runtime (caches, GC, turbo).

Use a ferramenta para **triagem rápida** de hipóteses de complexidade e para comparar implementações nas mesmas condições.

---

## 5. Intuição prática

Suponha que o mergesort foi medido e a hipótese é \( g(n) = n \log_2 n \).

- Se \( k(n) \) estabiliza perto de \( 0{,}06 \) para \( n \) grandes, a **ordem** é consistente; só a constante precisa de calibração.
- Se a hipótese fosse \( g(n) = n \), o comportamento de \( k \) tenderia a indicar subestimativa da ordem verdadeira.
- Se a hipótese fosse \( g(n) = n^2 \), \( k(n) \) em geral colapsaria em direção a 0 (a teoria cresce bem mais rápido que a realidade).

Sempre leia **tanto** a tabela de razões quanto os tempos brutos ao julgar uma hipótese.

---

## Próximos passos

- [Algoritmos sob teste](algorithms.md)
- [Referência da API](api.md)
- [Visualização (nodeplotlib)](visualization.md) — plotar \(k(n)\), tempo e espaço interativamente
