---
sidebar_position: 2
---

# analyzeDashboard

`analyzeDashboard` generates multiple complementary charts from one prompt and dataset.

## Signature

```ts
analyzeDashboard(input: AnalyzeDashboardInput): Promise<AnalyzeDashboardResult>
```

## Example

```ts
import { analyzeDashboard } from "@openvizai/core";

const { result } = await analyzeDashboard({
  prompt: "give me a full overview of energy usage",
  data: rows,
  maxCharts: 4,
  config: {
    provider: "google",
    apiKey: process.env.GEMINI_API_KEY,
  },
});

console.log(result.response_type); // "dashboard"
console.log(result.charts.length);
```

## Return Shape

Each item in `result.charts` includes:

- `chart_type`
- `meta`
- `chartSpec`

Use the output with `OpenVizDashboard` in `@openvizai/react`.
