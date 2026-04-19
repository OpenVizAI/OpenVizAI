import OpenVizRenderer from "./OpenVizRenderer.js";
import type { OpenVizDashboardProps } from "./types/dashboard.js";

/**
 * Renders multiple charts in a responsive grid layout.
 *
 * Accepts the output of `analyzeDashboard()` and renders each chart
 * as an independent `<OpenVizRenderer />` with its own chartSpec + meta.
 *
 * @param props - Data, chart configs, and optional grid/layout settings.
 *
 * @example
 * ```tsx
 * import { OpenVizDashboard } from "@openvizai/react";
 *
 * <OpenVizDashboard
 *   data={rows}
 *   chartLibrary="apexcharts"
 *   charts={result.charts}
 *   columns={2}
 * />
 * ```
 */
export default function OpenVizDashboard({
  data,
  chartLibrary,
  charts,
  config,
  columns = 2,
  className,
}: OpenVizDashboardProps) {
  if (!charts || charts.length === 0) {
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
        <p style={{ margin: 0, fontSize: "14px" }}>No charts to display.</p>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "16px",
        width: "100%",
      }}
    >
      {charts.map((chart, index) => (
        <div
          key={`${chart.chart_type}-${index}`}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#ffffff",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <h4
              style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 600 }}
            >
              {chart.meta.title}
            </h4>
            {chart.meta.query_explanation && (
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                {chart.meta.query_explanation}
              </p>
            )}
          </div>
          <OpenVizRenderer
            data={data}
            chartLibrary={chartLibrary}
            chartType={chart.chart_type}
            chartSpec={chart.chartSpec}
            meta={chart.meta}
            config={config}
          />
        </div>
      ))}
    </div>
  );
}
