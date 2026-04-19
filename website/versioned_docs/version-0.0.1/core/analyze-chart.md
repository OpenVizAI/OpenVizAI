---
sidebar_position: 1
---

# analyzeChart

`analyzeChart` is the main backend entrypoint in `@openvizai/core`.

## Signature

```ts
analyzeChart(input: AnalyzeChartOptions): Promise<AnalyzeChartResult>
```

## Input

```ts
interface AnalyzeChartOptions {
  prompt: string;
  data: Record<string, unknown>[];
  config?: {
    provider?: "openai" | "google";
    apiKey?: string;
    model?: string;
    sampleRows?: number;
  };
  chatHistory?: BaseMessage[];
}
```

## Output

```ts
interface AnalyzeChartResult {
  result: {
    response_type: "graphical";
    meta: {
      title: string;
      subtitle: string | null;
      query_explanation: string;
    };
    chart: {
      chart_type: "line" | "radar" | "bar" | "range_bar" | "pie" | "donut";
      chartSpec: ChartSpec;
    };
  };
  sampleUsed: Record<string, unknown>[];
}
```

## Example

```ts
import { analyzeChart } from "@openvizai/core";

const { result, sampleUsed } = await analyzeChart({
  prompt: "show revenue trends over time",
  data: rows,
  config: {
    provider: "google",
    apiKey: process.env.GEMINI_API_KEY,
    sampleRows: 50,
  },
});

console.log(result.chart.chart_type);
console.log(result.chart.chartSpec);
console.log(sampleUsed.length);
```

## Errors

- `InvalidInputError`: prompt/data missing or invalid
- `LLMError`: provider call failed or output cannot be parsed
- `ConfigError`: provider/API key/model configuration is invalid
