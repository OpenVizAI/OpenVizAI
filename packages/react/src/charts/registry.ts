import type { ComponentType } from "react";
import type { ChartLibrary } from "../types/renderer.js";
import type { ChartComponentProps } from "./types.js";

import LineChart from "./LineChart.js";
import BarChart from "./BarChart.js";
import PieChart from "./PieChart.js";
import RadarChart from "./RadarChart.js";

type ChartRegistry = Record<
  string,
  Record<string, ComponentType<ChartComponentProps>>
>;

const defaultRegistry: ChartRegistry = {
  apexcharts: {
    line: LineChart,
    bar: BarChart,
    range_bar: BarChart,
    pie: PieChart,
    donut: PieChart,
    radar: RadarChart,
  },
  chartjs: {
    line: LineChart,
    bar: BarChart,
    pie: PieChart,
    donut: PieChart,
    radar: RadarChart,
  },
};

function cloneRegistry(source: ChartRegistry): ChartRegistry {
  const cloned: ChartRegistry = {};

  for (const [library, chartMap] of Object.entries(source)) {
    cloned[library] = { ...chartMap };
  }

  return cloned;
}

let registry: ChartRegistry = cloneRegistry(defaultRegistry);

/**
 * Register a custom chart component for a chart library + chart type pair.
 *
 * Use this to extend the built-in chart registry with your own
 * chart components (e.g. a custom heatmap or treemap).
 *
 * @param chartLibrary - The chart library key (e.g. `"chartjs"`).
 * @param chartType - The chart type key (e.g. `"heatmap"`).
 * @param component - The React component to render for that type.
 *
 * @example
 * ```tsx
 * import { registerChart } from "@openvizai/react";
 * import MyHeatmap from "./MyHeatmap";
 *
 * registerChart("chartjs", "heatmap", MyHeatmap);
 * ```
 */
export function registerChart(
  chartLibrary: ChartLibrary,
  chartType: string,
  component: ComponentType<ChartComponentProps>,
): void {
  if (!registry[chartLibrary]) {
    registry[chartLibrary] = {};
  }

  registry[chartLibrary][chartType] = component;
}

/**
 * Get the registered React component for a chart library + chart type pair.
 *
 * Returns `undefined` if no component is registered for the given pair.
 *
 * @param chartLibrary - The chart library key.
 * @param chartType - The chart type key to look up.
 * @returns The registered component, or `undefined`.
 */
export function getChartComponent(
  chartLibrary: ChartLibrary,
  chartType: string,
): ComponentType<ChartComponentProps> | undefined {
  return registry[chartLibrary]?.[chartType];
}

/**
 * Reset the chart registry to the built-in defaults.
 *
 * Useful in tests to restore the original registry after custom registrations.
 */
export function resetChartRegistry(): void {
  registry = cloneRegistry(defaultRegistry);
}
