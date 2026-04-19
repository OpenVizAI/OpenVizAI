---
sidebar_position: 1
---

# OpenVizRenderer

`OpenVizRenderer` renders one chart from OpenVizAI metadata.

## Props

```ts
type OpenVizRendererProps = {
  data: Record<string, unknown>[];
  chartLibrary: "apexcharts" | "chartjs";
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
      chartLibrary="apexcharts"
      chartType={result.chart.chart_type}
      chartSpec={result.chart.chartSpec}
      meta={result.meta}
    />
  );
}
```

## Current Library Support

Currently supported libraries: **2**

- `apexcharts`
- `chartjs`

| Chart Type  | apexcharts | chartjs |
| ----------- | ---------- | ------- |
| `line`      | Yes        | Yes     |
| `bar`       | Yes        | Yes     |
| `range_bar` | Yes        | Not yet |
| `pie`       | Yes        | Yes     |
| `donut`     | Yes        | Yes     |
| `radar`     | Yes        | Yes     |

## Behavior

- Shows a message for unsupported library + chart type combinations
- Shows a fallback message for empty datasets
- Uses chart registry resolution internally (`getChartComponent`)

## Next Plan

- Add `range_bar` support for `chartjs`.
- Expand support for additional chart libraries incrementally.
