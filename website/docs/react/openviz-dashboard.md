---
sidebar_position: 2
---

# OpenVizDashboard

`OpenVizDashboard` renders a dashboard grid from multi-chart output.

## Typical Input

Pass `result.charts` from `analyzeDashboard()`.

```tsx
import { OpenVizDashboard } from "@openvizai/react";

export function DashboardView({ rows, dashboardResult }) {
  return (
    <OpenVizDashboard
      data={rows}
      chartLibrary="apexcharts"
      charts={dashboardResult.charts}
    />
  );
}
```

Current supported libraries: **2** (`apexcharts`, `chartjs`).

Next plan: extend chart coverage per library while keeping the same dashboard API.

![OpenVizAI dashboard demo](/img/docs/dashboard.gif)
