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
  return <OpenVizDashboard data={rows} charts={dashboardResult.charts} />;
}
```

![OpenVizAI dashboard demo](/img/docs/dashboard.gif)
