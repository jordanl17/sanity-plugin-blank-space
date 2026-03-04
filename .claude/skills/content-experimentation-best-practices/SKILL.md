---
name: content-experimentation-best-practices
description: A/B testing and content experimentation methodology for data-driven content optimization. Use when implementing experiments, analyzing results, or building experimentation infrastructure.
license: MIT
metadata:
  author: sanity
  version: '1.0.0'
---

# Content Experimentation Best Practices

Principles and patterns for running effective content experiments to improve conversion rates, engagement, and user experience.

## When to Apply

Reference these guidelines when:

- Setting up A/B or multivariate testing infrastructure
- Designing experiments for content changes
- Analyzing and interpreting test results
- Building CMS integrations for experimentation
- Deciding what to test and how

## Core Concepts

### A/B Testing

Comparing two variants (A vs B) to determine which performs better.

### Multivariate Testing

Testing multiple variables simultaneously to find optimal combinations.

### Statistical Significance

The confidence level that results aren't due to random chance.

### Experimentation Culture

Making decisions based on data rather than opinions (HiPPO avoidance).

## Resources

See `resources/` for detailed guidance:

- `resources/experiment-design.md` — Hypothesis framework, metrics, sample size, and what to test
- `resources/statistical-foundations.md` — p-values, confidence intervals, power analysis, Bayesian methods
- `resources/cms-integration.md` — CMS-managed variants, field-level variants, external platforms
- `resources/common-pitfalls.md` — 17 common mistakes across statistics, design, execution, and interpretation
