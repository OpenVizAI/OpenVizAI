import { getChartComponent } from "./charts/registry.js";
import type { OpenVizRendererProps } from "./types/renderer.js";

function ChartError({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "24px",
        textAlign: "center",
        color: "#6b7280",
        border: "1px dashed #d1d5db",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px" }}>{message}</p>
    </div>
  );
}

/**
 * Renders a single chart from OpenVizAI chart specification metadata.
 *
 * Accepts the output of `analyzeChart()` and visualizes it using ApexCharts.
 * Supports bar, line, pie, donut, radar, and range bar charts out of the box.
 *
 * @param props - Chart data, type, chartSpec, and optional config.
 *
 * @example
 * ```tsx
 * import { OpenVizRenderer } from "@openvizai/react";
 *
 * <OpenVizRenderer
 *   data={rows}
 *   chartLibrary="apexcharts"
 *   chartType={result.chart.chart_type}
 *   chartSpec={result.chart.chartSpec}
 *   meta={result.meta}
 * />
 * ```
 */
export default function OpenVizRenderer({
  data,
  chartLibrary,
  chartType,
  chartSpec,
  meta,
  config,
  className,
}: OpenVizRendererProps) {
  const ChartComponent = getChartComponent(chartLibrary, chartType);

  if (!ChartComponent) {
    return (
      <div className={className}>
        <ChartError
          message={`Unsupported chart type "${chartType}" for chart library "${chartLibrary}".`}
        />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={className}>
        <ChartError message="No data available to render the chart." />
      </div>
    );
  }

  return (
    <div className={className}>
      <ChartComponent
        data={data}
        chartLibrary={chartLibrary}
        chartType={chartType}
        chartSpec={chartSpec}
        meta={meta}
        config={config}
      />
    </div>
  );
}
