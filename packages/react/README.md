# @openvizai/react

React renderer components for OpenVizAI chart metadata.

`@openvizai/react` renders chart output produced by `@openvizai/core` using ApexCharts.

## New to OpenVizAI?

`@openvizai/react` is the frontend rendering layer.

OpenVizAI works as an interlinked backend + frontend flow:

1. Backend (`@openvizai/core`) analyzes prompt + sampled rows and returns chart metadata (`chart_type`, `chartSpec`, `meta`).
2. Frontend (`@openvizai/react`) uses that metadata to render production-ready charts.

This separation is the core idea behind generative charts in OpenVizAI: LLM for decision-making, deterministic code for full-data rendering.

If you're new to the repo, start here:

- Root architecture + end-to-end explanation: https://github.com/OpenVizAI/OpenVizAI#readme
- Playground setup guide: https://github.com/OpenVizAI/OpenVizAI/blob/main/PLAYGROUND.md
- Backend package docs (`@openvizai/core`): https://www.npmjs.com/package/@openvizai/core

## Install

```bash
npm install @openvizai/react
```

## Peer Dependencies

```bash
npm install react react-dom apexcharts react-apexcharts chart.js react-chartjs-2
```

## Library Selection (Required)

Pass `chartLibrary` in every render call.

```tsx
<OpenVizRenderer
  data={rows}
  chartLibrary="apexcharts"
  chartType={result.chart.chart_type}
  chartSpec={result.chart.chartSpec}
  meta={result.meta}
/>
```

```tsx
<OpenVizDashboard data={rows} chartLibrary="chartjs" charts={result.charts} />
```

## Current Library Support

OpenVizAI currently supports **2 chart libraries** in `@openvizai/react`:

- `apexcharts`
- `chartjs`

Support matrix:

| Chart Type  | apexcharts | chartjs |
| ----------- | ---------- | ------- |
| `line`      | Yes        | Yes     |
| `bar`       | Yes        | Yes     |
| `range_bar` | Yes        | Not yet |
| `pie`       | Yes        | Yes     |
| `donut`     | Yes        | Yes     |
| `radar`     | Yes        | Yes     |

## Full Example

```jsx
import { OpenVizRenderer } from "@openvizai/react";

const data = [
  { day: "Mon", kwh: 1480, peak_kw: 320, building: "HQ" },
  { day: "Tue", kwh: 1525, peak_kw: 338, building: "HQ" },
  { day: "Wed", kwh: 1410, peak_kw: 305, building: "HQ" },
  { day: "Mon", kwh: 2350, peak_kw: 520, building: "Plant-A" },
  { day: "Tue", kwh: 2415, peak_kw: 548, building: "Plant-A" },
  { day: "Wed", kwh: 2290, peak_kw: 502, building: "Plant-A" },
];

const chartSpec = {
  x: [{ field: "day", label: "Day" }],
  y: [
    { type: "bar", unit: "kWh", field: "kwh", label: "Energy Usage" },
    { type: "bar", unit: "kW", field: "peak_kw", label: "Peak Demand" },
  ],
  end: null,
  start: null,
  value: null,
  category: null,
  is_stacked: false,
  colorSemantic: "neutral",
  is_horizontal: false,
  isSemanticColors: false,
};

const meta = {
  title: "Daily Energy Usage vs. Peak Demand by Building",
  subtitle: "Comparison of kWh and Peak kW",
  query_explanation:
    "This chart displays the daily energy consumption in kWh and the peak power demand in kW.",
};

function App() {
  return (
    <div className="App">
      <OpenVizRenderer
        data={data}
        chartLibrary="apexcharts"
        chartType="bar"
        chartSpec={chartSpec}
        meta={meta}
      />
    </div>
  );
}

export default App;
```

## End-to-End with `@openvizai/core`

```tsx
import { analyzeChart } from "@openvizai/core";
import { OpenVizRenderer } from "@openvizai/react";

const { result } = await analyzeChart({
  prompt: "show revenue trends over time",
  data: rows,
  config: { provider: "google", apiKey: GEMINI_API_KEY },
});

<OpenVizRenderer
  data={rows}
  chartLibrary="apexcharts"
  chartType={result.chart.chart_type}
  chartSpec={result.chart.chartSpec}
  meta={result.meta}
/>;
```

## Exports

| Export                                            | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------------------ |
| `OpenVizRenderer`                                 | Renders a single chart from chartSpec metadata               |
| `OpenVizDashboard`                                | Renders a grid of charts from `analyzeDashboard` output      |
| `registerChart`                                   | Register a custom chart component for a library + chart type |
| `getChartComponent`                               | Get the registered component for a library + chart type      |
| `resetChartRegistry`                              | Reset the chart registry to built-in defaults                |
| `LineChart`, `BarChart`, `PieChart`, `RadarChart` | Individual chart components (for advanced usage)             |

## Notes

- Use this package in the frontend/UI layer.
- Pair with `@openvizai/core` for end-to-end prompt-to-chart flow.
- The `chartSpec` and `meta` objects come directly from the `analyzeChart()` / `analyzeDashboard()` response.

## Next Plan

- Complete `range_bar` support for `chartjs`.
- Extend additional chart types with the same library-dispatch pattern.
- Add new libraries (for example `recharts`) incrementally per chart type.

For full docs, see the root project README:
https://github.com/OpenVizAI/OpenVizAI
