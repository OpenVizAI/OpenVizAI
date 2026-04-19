---
sidebar_position: 2
---

# Architecture

OpenVizAI separates AI reasoning from deterministic rendering.

## Pipeline

1. Input: user prompt + dataset rows
2. Sampling: the runtime selects a limited row sample
3. AI decision: model selects chart type and field mappings
4. Runtime transform: deterministic code maps full dataset using the chart spec
5. Render: React components render with ApexCharts

## Why This Scales

- Token cost is stable because row sampling is bounded
- Full dataset transformation remains deterministic and auditable
- Rendering logic is isolated from provider/model changes

![OpenVizAI architecture](/img/docs/architecture.png)
