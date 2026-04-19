---
sidebar_position: 1
---

# OpenVizRenderer

`OpenVizRenderer` renders one chart from OpenVizAI metadata.

## Props

```ts
type OpenVizRendererProps = {
  data: Record<string, unknown>[];
  chartType: "line" | "radar" | "bar" | "range_bar" | "pie" | "donut";
  chartSpec: ChartSpec;
  meta?: {
    title: string;
    subtitle: string | null;
    query_explanation: string;
  };
  config?: unknown;
  className?: string;
};
```

## Example

```tsx
import { OpenVizRenderer } from "@openvizai/react";

export function ChartPanel({ rows, result }) {
  return (
    <OpenVizRenderer
      data={rows}
      chartType={result.chart.chart_type}
      chartSpec={result.chart.chartSpec}
      meta={result.meta}
    />
  );
}
```

## Behavior

- Shows a fallback message for unsupported chart types
- Shows a fallback message for empty datasets
- Uses chart registry resolution internally (`getChartComponent`)
