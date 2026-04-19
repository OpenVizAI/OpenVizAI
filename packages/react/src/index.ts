// Main component
export { default as OpenVizRenderer } from "./OpenVizRenderer.js";

// Dashboard component
export { default as OpenVizDashboard } from "./OpenVizDashboard.js";

// Chart registry (for plugin system)
export {
  registerChart,
  getChartComponent,
  resetChartRegistry,
} from "./charts/registry.js";

// Individual chart components (for advanced usage)
export { LineChart, BarChart, PieChart, RadarChart } from "./charts/index.js";

// Types
export type {
  ChartLibrary,
  ChartSpecField,
  ChartSpec,
  ChartMeta,
  OpenVizConfig,
  OpenVizRendererProps,
  OpenVizDashboardChartItem,
  OpenVizDashboardProps,
} from "./types/index.js";

// Internal chart component props type (for custom chart registration)
export type { ChartComponentProps } from "./charts/types.js";

// Re-export chart type constants
export { SUPPORTED_CHART_TYPES } from "@openvizai/shared-types";
export type { ChartType } from "@openvizai/shared-types";
