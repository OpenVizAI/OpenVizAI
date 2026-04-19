# @openvizai/core

Core chart intelligence engine for OpenVizAI.

`@openvizai/core` analyzes a user prompt and a small sample of dataset rows, then returns deterministic chart metadata:

- chart type
- chartSpec (x/y/series/category field mappings)
- chart title and explanatory metadata

The package is designed for server-side use in APIs, copilots, and analytics systems.

`@openvizai/core` does **not** choose a rendering library. Library selection is done in `@openvizai/react` via `chartLibrary` prop.

## New to OpenVizAI?

`@openvizai/core` is the backend intelligence layer.

OpenVizAI works in two connected steps:

1. Backend (`@openvizai/core`) reads your prompt + a tiny sample of rows and returns chart metadata (`chart_type`, `chartSpec`, `meta`).
2. Frontend (`@openvizai/react`) renders that metadata against the full dataset.

This is how generative charts stay accurate and cost-efficient: the LLM decides the visualization strategy, while deterministic code handles full data mapping.

If you're new to the repo, start here:

- Root architecture + full explanation: https://github.com/OpenVizAI/OpenVizAI#readme
- Playground setup guide: https://github.com/OpenVizAI/OpenVizAI/blob/main/PLAYGROUND.md
- Renderer package docs (`@openvizai/react`): https://www.npmjs.com/package/@openvizai/react

## Install

```bash
npm install @openvizai/core
```

## Peer Dependencies

Install one supported LLM provider (for example Gemini or OpenAI):

```bash
npm install @langchain/core @langchain/google-genai
```

## Full Example

```js
import { analyzeChart } from "@openvizai/core";

const result = await analyzeChart({
  prompt: "show revenue trends over time",
  data: [
    { date: "2023-01-01", revenue: 1000 },
    { date: "2023-02-01", revenue: 1500 },
    { date: "2023-03-01", revenue: 1200 },
  ],
  config: {
    provider: "google",
    apiKey: process.env.GEMINI_API_KEY,
  },
});

console.log(result.result.chart.chart_type); // e.g. "line"
console.log(result.result.chart.chartSpec); // { x: [...], y: [...], ... }
console.log(result.result.meta.title); // "Revenue Trends Over Time"
```

## Dashboard (Multi-Chart)

```js
import { analyzeDashboard } from "@openvizai/core";

const { result } = await analyzeDashboard({
  prompt: "give me a full overview of energy usage",
  data: rows,
  config: { provider: "google", apiKey: process.env.GEMINI_API_KEY },
  maxCharts: 4,
});

// result.charts → array of { chart_type, chartSpec, meta }
```

## API Surface

| Export                                 | Description                                                             |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `analyzeChart(options)`                | Analyze a prompt + dataset → single chart type, chartSpec, and metadata |
| `analyzeDashboard(options)`            | Analyze a prompt + dataset → multiple chart configs for a dashboard     |
| `inspectSchema(sample)`                | Infer column names and types from dataset rows                          |
| `validateChartSpecConsistency(result)` | Post-LLM fix: ensure chart_type matches filled chartSpec fields         |
| `responseFormatterPrompt`              | Raw LLM prompt template (for advanced customization)                    |
| `responseFormatterSchema`              | Zod schema used to validate LLM output                                  |
| `SUPPORTED_CHART_TYPES`                | Array of all supported chart type strings                               |

## Error Classes

| Error               | When                                         |
| ------------------- | -------------------------------------------- |
| `InvalidInputError` | Missing or invalid `prompt` / `data`         |
| `LLMError`          | LLM call failed or returned unparseable JSON |
| `ConfigError`       | Invalid provider or missing API key          |
| `OpenVizAIError`    | Base class for all errors above              |

## Notes

- LLM is used for decision-making only (chart selection + field mapping).
- Full dataset transformation is deterministic code.
- This package does not render charts — use `@openvizai/react` for rendering.
- Pass the `result` object directly into `<OpenVizRenderer />` or `<OpenVizDashboard />`.

For full docs, see the root project README:
https://github.com/OpenVizAI/OpenVizAI
