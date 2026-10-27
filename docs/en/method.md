# Mathematical foundation

**Language:** [English](method.md) · [Português (Brasil)](../pt-BR/method.md)

[← Documentation home](README.md)

This page explains asymptotic (Big-O) analysis and how **tsnode-complexanalyzer** turns those ideas into an experimental procedure for time and space.

---

## 1. Problem size and cost functions

Let \( n \in \mathbb{N} \) be the **problem size** (e.g. length of an input array).

A deterministic algorithm induces a **cost function**

\[
f : \mathbb{N} \to \mathbb{R}_{>0}
\]

where \( f(n) \) may count elementary operations, wall-clock milliseconds, or bytes of memory. In theory we often reason about operation counts; in practice we measure physical resources.

---

## 2. Big-O (asymptotic upper bound)

We say \( f(n) = O(g(n)) \) if there exist constants \( k > 0 \) and \( n_0 \in \mathbb{N} \) such that

\[
\forall\, n \ge n_0,\quad f(n) \le k \cdot g(n).
\]

Intuitively: for large enough inputs, \( f \) does not grow **faster** than a constant multiple of \( g \).

Common comparison functions \( g \):

| Class | \( g(n) \) | Typical algorithms |
|-------|------------|--------------------|
| Constant | \( 1 \) | Hash lookup (amortized) |
| Logarithmic | \( \log n \) | Binary search |
| Linear | \( n \) | Single pass over an array |
| Linearithmic | \( n \log n \) | Mergesort, heapsort |
| Quadratic | \( n^2 \) | Naïve nested loops |
| Cubic / polynomial | \( n^c \) | Dense matrix multiply (\( c = 3 \)) |
| Exponential | \( 2^n \) | Naïve recursive subsets |

Related notations (not all used in the tool, but useful context):

- \( f = \Omega(g) \): asymptotic **lower** bound  
- \( f = \Theta(g) \): tight bound (\( O \) and \( \Omega \) simultaneously)

---

## 3. From theory to measurement

Formal proofs of \( O(g) \) require analyzing the code. That is often hard for legacy systems, third-party libraries, or code with heavy constant factors and memory effects.

**Empirical approach:** measure the real cost \( T_{\mathrm{meas}}(n) \) (or \( S_{\mathrm{meas}}(n) \) for space) for increasing \( n \), and **test a hypothesis** \( g(n) \) by studying the dimensionless ratio

\[
k(n) \;=\; \frac{g(n)}{T_{\mathrm{meas}}(n)}.
\]

### 3.1 Interpretation of \( k(n) \)

| Behaviour of \( k(n) \) as \( n \) grows | Conclusion about the guess \( g \) |
|----------------------------------------|-------------------------------------|
| Converges to a **positive constant** | \( g \) is a plausible order for \( T_{\mathrm{meas}} \) |
| Tends to **0** | \( g \) grows **too slowly** (under-estimate) |
| Diverges to \( +\infty \) | \( g \) grows **too fast** (over-estimate) |

This mirrors the limit form of the Big-O definition:

\[
\limsup_{n \to \infty} \frac{f(n)}{g(n)} < \infty
\quad\Longleftrightarrow\quad f = O(g)
\]

(under mild positivity assumptions). Empirically we only observe a finite range of \( n \), so convergence of \( k(n) \) is **evidence**, not a proof.

### 3.2 Scaling / conversion factor

Operation counts and milliseconds live in different units. The tool optionally scales \( g \) by a machine-dependent factor (e.g. “operations per millisecond”) so that \( k(n) \) lands near order 1 when the shape is right:

\[
T_{\mathrm{theory}}(n) \;=\; \frac{g(n)}{\alpha},
\qquad
k(n) \;=\; \frac{T_{\mathrm{theory}}(n)}{T_{\mathrm{meas}}(n)}.
\]

The **shape** of \( k(n) \) matters more than the exact value of \( \alpha \). You can tune \( \alpha \) via `makeTimeGuess(shape, opsPerMs)`.

---

## 4. How the project applies this

### 4.1 Time

1. Generate random inputs of size \( n \) (seeded PRNG for reproducibility).
2. Warm up the JIT; optionally force GC.
3. Run the algorithm \( R \) times; take the **median** wall-clock time as \( T_{\mathrm{meas}}(n) \).
4. Evaluate the user-supplied guess \( g(n) \) (e.g. \( n \log_2 n \)).
5. Record \( k_{\mathrm{time}}(n) = T_{\mathrm{theory}}(n) / T_{\mathrm{meas}}(n) \).
6. Repeat for a geometric-like sequence of sizes and inspect the series.

Implementation: `src/core/measure.ts`, `src/core/runner.ts`, guesses in `src/core/guesses.ts`.

### 4.2 Space

The same ratio idea is applied to memory:

\[
k_{\mathrm{space}}(n) \;=\; \frac{S_{\mathrm{theory}}(n)}{S_{\mathrm{obs}}(n)},
\]

where \( S_{\mathrm{obs}} \) is derived from `process.memoryUsage().heapUsed` (delta and peak, with guards against negative GC deltas). Theoretical models include linear extra space, logarithmic stack depth, and constant extra space.

### 4.3 Statistical hygiene

| Practice | Why |
|----------|-----|
| Warm-up runs | Reduce V8 JIT noise |
| Multiple repetitions + median | Robust to outliers |
| Seeded inputs | Reproducible sequences |
| Optional `--expose-gc` | More stable heap deltas |
| Environment capture | CPU model, Node version recorded in JSON |

### 4.4 What this is *not*

- Not a formal proof of Big-O.
- Not a substitute for production profilers (`clinic`, Chrome DevTools, etc.).
- Ratios are machine- and runtime-dependent (caches, GC, turbo boost).

Use the tool to **screen** complexity hypotheses quickly and to compare implementations under the same conditions.

---

## 5. Worked intuition

Suppose mergesort is measured and we guess \( g(n) = n \log_2 n \).

- If \( k(n) \) stabilizes near \( 0.06 \) for large \( n \), the **order** is consistent; only the constant needs calibration.
- If we had guessed \( g(n) = n \), \( k(n) \) would tend to grow (guess too low relative to true \( n \log n \) growth when plotted as theory/measured in the opposite way—or, equivalently, measured/theory would blow up).
- If we guessed \( g(n) = n^2 \), \( k(n) \) would typically collapse toward 0 (theory grows much faster than reality).

Always read **both** the table of ratios and the raw times when judging a hypothesis.

---

## Next

- [Algorithms under test](algorithms.md)
- [API reference](api.md)
- [Visualization (nodeplotlib)](visualization.md) — plot \(k(n)\), time, and space interactively
