import type {
  DashboardChartItem,
  ChartMeta,
  ChartSpec,
} from "@openvizai/shared-types";
import type { OpenVizConfig, ChartLibrary } from "./renderer.js";

/** A single chart item for the dashboard */
export type OpenVizDashboardChartItem = DashboardChartItem;

/** Props for the <OpenVizDashboard /> component */
export type OpenVizDashboardProps = {
  /** The dataset rows — shared across all charts */
  data: Record<string, unknown>[];
  /** Chart library applied to all chart cards in this dashboard */
  chartLibrary: ChartLibrary;
  /** Array of chart configurations returned by analyzeDashboard */
  charts: OpenVizDashboardChartItem[];
  /** Optional rendering config applied to all charts */
  config?: OpenVizConfig;
  /** Number of columns in the grid (default: 2) */
  columns?: number;
  /** Optional CSS class name for the wrapper */
  className?: string;
};

export type { ChartMeta, ChartSpec };
