import Chart from "react-apexcharts";
import { Radar as ChartJsRadar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { ChartComponentProps } from "./types.js";
import { buildApexBaseOptions } from "../chartSpec/apexBaseOptions.js";
import {
  buildCategorySeriesLabels,
  buildNumericSeries,
} from "../chartSpec/seriesBuilder.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

const CHARTJS_RADAR_COLORS = [
  "rgb(59, 130, 246)",
  "rgb(16, 185, 129)",
  "rgb(245, 158, 11)",
  "rgb(239, 68, 68)",
  "rgb(139, 92, 246)",
  "rgb(14, 165, 233)",
];

function toRadarFillColor(rgb: string): string {
  return rgb.replace("rgb(", "rgba(").replace(")", ", 0.25)");
}

function renderError(message: string) {
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

function renderApexRadar(args: {
  labels: string[];
  series: ReturnType<typeof buildNumericSeries>;
  chartSpec: ChartComponentProps["chartSpec"];
  meta: ChartComponentProps["meta"];
  config: ChartComponentProps["config"];
}) {
  const { labels, series, chartSpec, meta, config } = args;

  const baseOptions = buildApexBaseOptions({
    chartId: meta?.title || "radar-chart",
    title: meta?.title,
    subtitle: meta?.subtitle,
    legendPosition: config?.legendPosition ?? "top",
    dataLabelsEnabled: config?.dataLabelsEnabled ?? false,
    toolbarVisible: config?.toolbarVisible,
  });

  const options = {
    ...baseOptions,
    labels,
    xaxis: {
      categories: labels,
      title: {
        text: chartSpec.x?.[0]?.label ?? undefined,
      },
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.2,
    },
    markers: {
      size: chartSpec.markers_size ?? 3,
    },
  };

  return (
    <Chart
      type="radar"
      width={config?.width ?? "100%"}
      height={config?.height ?? 350}
      options={options}
      series={series}
    />
  );
}

function renderChartJsRadar(args: {
  labels: string[];
  series: ReturnType<typeof buildNumericSeries>;
  chartSpec: ChartComponentProps["chartSpec"];
  meta: ChartComponentProps["meta"];
  config: ChartComponentProps["config"];
}) {
  const { labels, series, chartSpec, meta, config } = args;

  const chartJsData: ChartData<"radar", (number | null)[], string> = {
    labels,
    datasets: series.map((seriesItem, index) => {
      const color = CHARTJS_RADAR_COLORS[index % CHARTJS_RADAR_COLORS.length];
      return {
        label: seriesItem.name,
        data: seriesItem.data,
        borderColor: color,
        backgroundColor: toRadarFillColor(color),
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointRadius: chartSpec.markers_size ?? 3,
        fill: true,
      };
    }),
  };

  const chartJsOptions: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: config?.legendPosition ?? "top",
      },
      title: {
        display: Boolean(meta?.title),
        text: meta?.title ?? "",
      },
    },
    scales: {
      r: {
        beginAtZero: true,
      },
    },
    ...(config?.animations === false ? { animation: false } : {}),
  };

  return (
    <div
      style={{
        width: config?.width ?? "100%",
        height: config?.height ?? 350,
      }}
    >
      <ChartJsRadar data={chartJsData} options={chartJsOptions} />
    </div>
  );
}

export default function RadarChart({
  data,
  chartLibrary,
  chartSpec,
  meta,
  config,
}: ChartComponentProps) {
  const xField = chartSpec.x?.[0]?.field;
  const yFields = chartSpec.y ?? [];

  if (!xField) {
    return renderError(
      "Unable to render radar chart: missing required x-axis field.",
    );
  }

  const labels = buildCategorySeriesLabels(data, xField);
  const series = buildNumericSeries(data, yFields);

  switch (chartLibrary) {
    case "apexcharts":
      return renderApexRadar({ labels, series, chartSpec, meta, config });
    case "chartjs":
      return renderChartJsRadar({ labels, series, chartSpec, meta, config });
    default:
      return renderError(
        `Chart library "${chartLibrary}" is not implemented for radar yet.`,
      );
  }
}
