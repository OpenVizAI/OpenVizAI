<div align="center">

# OpenVizAI

### Turn any dataset into the right chart. AI picks the chart. JavaScript renders it. Your full dataset never touches an LLM.

![openvizai/core](https://img.shields.io/badge/openvizai%2Fcore-v0.1.3-0A66C2)
![openvizai/react](https://img.shields.io/badge/openvizai%2Freact-v0.1.3-0A66C2)
![License](https://img.shields.io/badge/license-MIT-blue)


The missing intelligence layer between your data pipeline and your visualization.

Prompt and data in. Chart out. Under 3,000 tokens. Every time.

</div>

## Documentation

- Docs Home: https://openvizai.vercel.app/
- Intro: https://openvizai.vercel.app/docs/intro

## Packages

### Quick Install

```bash
npm install @openvizai/core @openvizai/react @openvizai/shared-types
```

| Package | Description | Downloads |
| --- | --- | --- |
| [`@openvizai/core`](https://www.npmjs.com/package/@openvizai/core) | Chart intelligence engine — analyzes datasets, calls LLM, returns chart metadata | ![npm](https://img.shields.io/npm/dt/@openvizai/core?style=flat-square) |
| [`@openvizai/react`](https://www.npmjs.com/package/@openvizai/react) | React components — renders charts from metadata + dataset using ApexCharts or Chart.js | ![npm](https://img.shields.io/npm/dt/@openvizai/react?style=flat-square) |
| [`@openvizai/shared-types`](https://www.npmjs.com/package/@openvizai/shared-types) | Shared TypeScript types and constants across packages | ![npm](https://img.shields.io/npm/dt/@openvizai/shared-types?style=flat-square) |

## The Problem

Every "AI + data" tool makes the same mistake: they treat the LLM like a database.

Send 1,000 rows of JSON to a model and ask it to generate chart data? Result into:

- **Context window overflow** on large datasets
- **High token cost** — paying for data transformation the LLM shouldn't be doing
- **Hallucinated structures** — invented fields, wrong aggregations
- **Slow responses** — seconds of latency for work that deterministic code handles in milliseconds

Most existing solutions follow this path:

```
Dataset → LLM transforms entire dataset → Chart
```

That's expensive, unreliable, and doesn't scale.

---

## The Solution

OpenVizAI takes a fundamentally different approach: **use the LLM for decisions, not data transformation.**

```
Dataset → Sample 2-3 rows → LLM decides chart type + field mapping → JS engine transforms full dataset → Chart
```

The LLM only sees a tiny sample of your data. It decides _what_ to visualize (chart type, axes, series, grouping) and outputs a `chartSpec`. Deterministic JavaScript code then transforms the full dataset for rendering.

The result: correct charts from any dataset shape, under 3,000 tokens, every time.

<div align="center">
<img src="./assets/architecture.png" alt="Architecture" width="450" />
</div>

---

## Demo

### Single Chart Intelligence

> Prompt: _"Plot a suitable chart for this data"_ → OpenVizAI analyzes the schema, picks the optimal chart type, and renders it — zero manual configuration.

<div align="center">
<img src="./assets/chart.gif" alt="Single chart generation demo" width="720" />
</div>

### Multi-Chart Dashboard

> Prompt: _"Generate a dashboard"_ → OpenVizAI creates multiple complementary charts from the same dataset, each showing a different analytical perspective.

<div align="center">
<img src="./assets/dashboard.gif" alt="Dashboard generation demo" width="720" />
</div>

---

## How It Works

> **Your Data** (any size)
> → **Smart Sampler** (2–3 rows)
> → **LLM** decides chart type, axes, series, labels
> → **Deterministic Chart Runtime** (JS) transforms the full dataset
> → **Selected Library** (ApexCharts/Chart.js) renders the final chart

**Key insight:** The LLM never sees your full dataset. It receives a small sample and returns a metadata object called a **chartSpec** — a declarative description of how to map fields to axes, series, and categories. Deterministic code does the rest.

Example LLM output:

```json
{
  "chart_type": "bar",
  "chartSpec": {
    "x": [{ "field": "month", "label": "Month" }],
    "y": [{ "field": "revenue", "label": "Revenue" }]
  },
  "meta": {
    "title": "Monthly Revenue",
    "subtitle": "Jan – Dec 2025"
  }
}
```

This metadata is all the rendering layer needs. The deterministic runtime takes this plus the original dataset and produces the final chart — no matter if the dataset has 100 or 500,000 rows.

## ChartSpec — The Universal Chart Contract

Every chart library speaks a different language. ApexCharts wants one config shape,
Recharts wants another, Chart.js wants a third. This makes AI-generated charts
fragile — if you swap your rendering library, everything breaks.

chartSpec solves this by sitting between the AI and the renderer.

The LLM outputs a `chartSpec` — a small, library-agnostic JSON object that describes
_what_ to visualize (chart type, which fields go where, labels, grouping).
A renderer adapter then translates that into whatever your chosen chart library expects.

```json
{
  "chart_type": "bar",
  "chartSpec": {
    "x": [{ "field": "month", "label": "Month" }],
    "y": [{ "field": "revenue", "label": "Revenue" }]
  },
  "meta": { "title": "Monthly Revenue", "subtitle": "Jan – Dec 2025" }
}
```

chartSpec is an open, versioned standard — `openvizai/spec/v1`. You can:

- Use `@openvizai/core` to generate it automatically from a prompt + dataset
- Call any LLM yourself and produce chartSpec-compatible JSON directly
- Write it by hand for static, pre-configured charts

Any tool that emits `openvizai/spec/v1`-compatible JSON works with every
OpenVizAI adapter. See the [chartSpec docs](docs/README.md) for the full schema
and per-chart examples.

## Token Cost


> Token counts include system prompt, data sample, user intent, and full chart config response.
> Sampling is statistically representative — chart quality doesn't degrade at scale.

---

## How OpenVizAI Is Different

Most AI visualization tools follow a pipeline like this:

|                           | Typical AI Viz Tool                                 | OpenVizAI                                          |
| ------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| **What LLM does**         | Transforms the entire dataset into chart structures | Decides chart type + field mappings only           |
| **Data sent to LLM**      | Full dataset (or large chunks)                      | 2-3 sampled rows                                   |
| **Data transformation**   | LLM-generated (unreliable at scale)                 | Deterministic JS functions                         |
| **Token usage**           | Scales with dataset size                            | Constant (~3K tokens)                              |
| **Visualization quality** | Data-science style (matplotlib, plotly)             | Production dashboard charts (ApexCharts, Chart.js) |
| **Rendering**             | Server-side or notebook                             | Client-side, embeddable React components           |

**Compared to tools like Vanna.ai:**

Vanna's pipeline: `User Question → LLM → SQL → Database → Pandas DataFrame → Rule-based visualization`

Their visualization step uses heuristics: _if categorical + numeric → bar chart, if time series → line chart, if percentage → pie chart._ It works for notebooks, but produces data-science-oriented visuals — not interactive, dashboard-grade charts.

**OpenVizAI's pipeline:** `Dataset → LLM decides visualization strategy → JS engine transforms data → Selected Renderer (ApexCharts/Chart.js)`

The LLM doesn't just match patterns — it understands user intent. Ask for _"show me workforce utilization trends"_ and it picks a line chart with the right axes. Ask for _"compare departments"_ from the same data and it picks a grouped bar chart. Same dataset, different insight, different chart — driven by reasoning, not rules.

---

## Use Cases

### Drop-in visualization for Text-to-SQL

Your SQL pipeline returns a JSON result set after executing a query. You don't know the result ahead of time. Just Pass that result to OpenVizAI with the original user prompt — get back a fully configured chart.

```
Text-to-SQL → Query result (JSON) → OpenVizAI → Interactive chart
```

### AI-powered dashboards

Feed a dataset and let OpenVizAI generate a multi-chart dashboard. Each chart covers a different analytical dimension of the same data — trends, comparisons, distributions — without any manual configuration.

### Visualization layer for analytics platforms

OpenVizAI is designed to be embedded. The core intelligence (`@openvizai/core`) runs server-side to decide chart configurations. The React renderer (`@openvizai/react`) renders them client-side. Wire them into any existing product.

---

### Basic Usage

**Server-side** — analyze a dataset:

```ts
import { analyzeChart } from "@openvizai/core";

const result = await analyzeChart({
  prompt: "Show revenue trends over time",
  data: myDataset,
  config: { provider: "openai", apiKey: process.env.OPENAI_API_KEY },
});

// result.result → { chart_type, chartSpec, meta }
```

**Client-side** — render the chart:

```tsx
import { OpenVizRenderer } from "@openvizai/react";

<OpenVizRenderer
  data={dataset}
  chartLibrary="apexcharts" // or "chartjs"
  chartType={result.chart_type}
  chartSpec={result.chartSpec}
  meta={result.meta}
/>;
```

---

## Playground Demo

The repo includes a full-stack playground application so you can try OpenVizAI immediately.

**See the [Playground Setup Guide](PLAYGROUND.md) for step-by-step instructions.**

The playground features built-in example datasets so you can start generating charts immediately — no data preparation needed.

---

## Roadmap

chart type coverage (heatmap, scatter, candlestick, treemap, etc.)

- [ ] Improved sampling strategies for highly skewed and sparse datasets
- [ ] Support more rendering libraries like Recharts or D3 (ApexCharts and Chart.js currently supported)

- [ ] **VizEngine abstraction** — pluggable renderer interface to target Chart.js, Recharts, or D3 from the same config
- [ ] **Data insights** — surface trends, anomalies, and statistical summaries from datasets without additional LLM calls
- [ ] **Multi-LLM support** — Anthropic Claude and local models

### Future

- [ ] **Prompt-driven theming** — _"Use custom brand colors"_ or _"dark mode"_ applied via natural language
- [ ] **Config export** — export generated chart configs as reusable JSON or component code

---

## Contributing

Contributions are welcome.

### Quick Start

1. Fork the repository
2. `git clone https://github.com/YOUR_USERNAME/OpenVizAI.git`
3. `git checkout -b feature/your-feature-name`
4. Make focused changes with clear commits
5. Open a Pull Request against `main`

### Good First Issues

| Area            | What's Needed                                                |
| --------------- | ------------------------------------------------------------ |
| New Chart Types | Expand ApexCharts coverage                                   |
| Examples        | Real-world integration examples (Next.js, Text-to-SQL, etc.) |
| Documentation   | Improve API docs and usage guides                            |

## Tech Stack

<p align="center">
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB" alt="React" /></a>
<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%23339933.svg?logo=node.js&logoColor=white" alt="Node.js" /></a>
<a href="https://www.langchain.com/"><img src="https://img.shields.io/badge/LangChain-121212?logo=chainlink&logoColor=white" alt="LangChain" /></a>
<a href="https://langchain-ai.github.io/langgraph/"><img src="https://img.shields.io/badge/LangGraph-1E293B?logo=graphql&logoColor=white" alt="LangGraph" /></a>
<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>
<a href="https://apexcharts.com/"><img src="https://img.shields.io/badge/ApexCharts-%23008FFB.svg?logo=apexcharts&logoColor=white" alt="ApexCharts" /></a>
<a href="https://zod.dev/"><img src="https://img.shields.io/badge/Zod-3E67B1?logo=typescript&logoColor=white" alt="Zod" /></a>
</p>

### Reporting Bugs

[Open an issue](https://github.com/OpenVizAI/OpenVizAI/issues) with a clear description, steps to reproduce, and sample data + prompt if relevant.

## License 📄

[MIT](https://github.com/OpenVizAI/OpenVizAI/blob/main/LICENSE.md)

---

<div align="center">

**If OpenVizAI fills a gap in your stack, please give this repo a star ⭐. It helps more developers discover it.**

</div>
