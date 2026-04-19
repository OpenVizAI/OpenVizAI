import Chart from "react-apexcharts";
import {
  Doughnut as ChartJsDoughnut,
  Pie as ChartJsPie,
} from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { ChartComponentProps } from "./types.js";
import { buildApexBaseOptions } from "../chartSpec/apexBaseOptions.js";
import {
  buildCategorySeriesLabels,
  buildSingleValueSeries,
} from "../chartSpec/seriesBuilder.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CHARTJS_SLICE_BG = [
  "rgba(59, 130, 246, 0.65)",
  "rgba(16, 185, 129, 0.65)",
  "rgba(245, 158, 11, 0.65)",
  "rgba(239, 68, 68, 0.65)",
  "rgba(139, 92, 246, 0.65)",
  "rgba(14, 165, 233, 0.65)",
  "rgba(236, 72, 153, 0.65)",
  "rgba(132, 204, 22, 0.65)",
];

const CHARTJS_SLICE_BORDER = [
  "rgb(59, 130, 246)",
  "rgb(16, 185, 129)",
  "rgb(245, 158, 11)",
  "rgb(239, 68, 68)",
  "rgb(139, 92, 246)",
  "rgb(14, 165, 233)",
  "rgb(236, 72, 153)",
  "rgb(132, 204, 22)",
];

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

function renderApexPie(args: {
  pieType: "pie" | "donut";
  labels: string[];
  series: number[];
  meta: ChartComponentProps["meta"];
  config: ChartComponentProps["config"];
}) {
  const { pieType, labels, series, meta, config } = args;

  const baseOptions = buildApexBaseOptions({
    chartId: meta?.title || "pie-chart",
    title: meta?.title,
    subtitle: meta?.subtitle,
    legendPosition: config?.legendPosition ?? "right",
    dataLabelsEnabled: config?.dataLabelsEnabled ?? true,
    toolbarVisible: config?.toolbarVisible,
  });

  const options = {
    ...baseOptions,
    labels,
    dataLabels: {
      ...baseOptions.dataLabels,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: pieType === "donut" ? "60%" : "0%",
          labels: {
            show: pieType === "donut",
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Chart
      type={pieType}
      width={config?.width ?? "100%"}
      height={config?.height ?? 350}
      options={options}
      series={series}
    />
  );
}

function renderChartJsPie(args: {
  pieType: "pie" | "donut";
  labels: string[];
  series: number[];
  meta: ChartComponentProps["meta"];
  config: ChartComponentProps["config"];
}) {
  const { pieType, labels, series, meta, config } = args;

  const pieData: ChartData<"pie", number[], string> = {
    labels,
    datasets: [
      {
        label: meta?.title ?? "Values",
        data: series,
        backgroundColor: labels.map(
          (_, idx) => CHARTJS_SLICE_BG[idx % CHARTJS_SLICE_BG.length],
        ),
        borderColor: labels.map(
          (_, idx) => CHARTJS_SLICE_BORDER[idx % CHARTJS_SLICE_BORDER.length],
        ),
        borderWidth: 1,
      },
    ],
  };

  const doughnutData: ChartData<"doughnut", number[], string> = {
    labels,
    datasets: [
      {
        label: meta?.title ?? "Values",
        data: series,
        backgroundColor: labels.map(
          (_, idx) => CHARTJS_SLICE_BG[idx % CHARTJS_SLICE_BG.length],
        ),
        borderColor: labels.map(
          (_, idx) => CHARTJS_SLICE_BORDER[idx % CHARTJS_SLICE_BORDER.length],
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: config?.legendPosition ?? "right",
      },
      title: {
        display: Boolean(meta?.title),
        text: meta?.title ?? "",
      },
    },
  };

  return (
    <div
      style={{
        width: config?.width ?? "100%",
        height: config?.height ?? 350,
      }}
    >
      {pieType === "donut" ? (
        <ChartJsDoughnut
          data={doughnutData}
          options={chartJsOptions as ChartOptions<"doughnut">}
        />
      ) : (
        <ChartJsPie
          data={pieData}
          options={chartJsOptions as ChartOptions<"pie">}
        />
      )}
    </div>
  );
}

export default function PieChart({
  data,
  chartLibrary,
  chartType,
  chartSpec,
  meta,
  config,
}: ChartComponentProps) {
  const categoryField = chartSpec.category?.[0]?.field;
  const valueField = chartSpec.value?.[0]?.field;

  if (!categoryField || !valueField) {
    return renderError(
      "Unable to render pie chart: missing required category or value fields.",
    );
  }

  const labels = buildCategorySeriesLabels(data, categoryField);
  const series = buildSingleValueSeries(data, valueField);

  const pieType =
    chartType === "donut" || chartSpec.is_donut
      ? ("donut" as const)
      : ("pie" as const);

  switch (chartLibrary) {
    case "apexcharts":
      return renderApexPie({
        pieType,
        labels,
        series,
        meta,
        config,
      });
    case "chartjs":
      return renderChartJsPie({ pieType, labels, series, meta, config });
    default:
      return renderError(
        `Chart library "${chartLibrary}" is not implemented for ${pieType} yet.`,
      );
  }
}
