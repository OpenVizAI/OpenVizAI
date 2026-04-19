import Chart from "react-apexcharts";
import { Line as ChartJsLine } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { ChartComponentProps } from "./types.js";
import { buildApexBaseOptions } from "../chartSpec/apexBaseOptions.js";
import {
  buildCategorySeriesLabels,
  buildDatetimePoints,
  buildNumericDataByField,
} from "../chartSpec/seriesBuilder.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const CHARTJS_LINE_COLORS = [
  "rgb(59, 130, 246)",
  "rgb(16, 185, 129)",
  "rgb(245, 158, 11)",
  "rgb(239, 68, 68)",
  "rgb(139, 92, 246)",
  "rgb(14, 165, 233)",
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

function renderApexLine(args: {
  data: ChartComponentProps["data"];
  xField: string;
  isDatetime: boolean;
  yFields: NonNullable<ChartComponentProps["chartSpec"]["y"]>;
  chartSpec: ChartComponentProps["chartSpec"];
  meta: ChartComponentProps["meta"];
  config: ChartComponentProps["config"];
}) {
  const { data, xField, isDatetime, yFields, chartSpec, meta, config } = args;

  const baseOptions = buildApexBaseOptions({
    chartId: meta?.title || "line-chart",
    title: meta?.title,
    subtitle: meta?.subtitle,
    legendPosition: config?.legendPosition ?? "top",
    dataLabelsEnabled: config?.dataLabelsEnabled ?? false,
    toolbarVisible: config?.toolbarVisible,
  });

  const categories =
    xField && !isDatetime ? buildCategorySeriesLabels(data, xField) : undefined;

  // Build distinct units to drive multi-axis behavior
  const unitKeys = Array.from(
    new Set(yFields.map((yField) => (yField.unit ? yField.unit : "default"))),
  );

  const series = yFields.map((yField) => {
    const axisKey = yField.unit ? yField.unit : "default";
    const yAxisIndex = unitKeys.indexOf(axisKey);

    const base = {
      name: yField.label || yField.field,
      type: (yField.type as "line" | "column" | undefined) ?? "line",
      yAxisIndex,
    };

    if (isDatetime && xField) {
      return {
        ...base,
        data: buildDatetimePoints(data, xField, yField.field),
      };
    }

    return {
      ...base,
      data: buildNumericDataByField(data, yField.field),
    };
  });

  const yaxis =
    unitKeys.length > 1
      ? unitKeys.map((unit, idx) => ({
          title: {
            text: unit === "default" ? undefined : unit,
          },
          opposite: idx % 2 === 1,
        }))
      : {
          labels: {
            formatter: (val: number) => `${val}`,
          },
        };

  const options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      stacked: chartSpec.is_stacked,
      animations: {
        enabled: config?.animations ?? true,
      },
    },
    xaxis: {
      ...(categories ? { categories } : {}),
      type: isDatetime ? ("datetime" as const) : ("category" as const),
      title: {
        text: chartSpec.x?.[0]?.label ?? undefined,
      },
    },
    yaxis,
    tooltip: {
      shared: true,
      intersect: false,
    },
    stroke: {
      curve: (chartSpec.line_curve ?? "smooth") as
        | "smooth"
        | "straight"
        | "stepline",
      width: 2,
    },
    markers: {
      size: chartSpec.markers_size ?? 0,
    },
    ...(chartSpec.forecast_points
      ? {
          forecastDataPoints: {
            count: chartSpec.forecast_points,
          },
        }
      : {}),
  };

  return (
    <Chart
      type="line"
      width={config?.width ?? "100%"}
      height={config?.height ?? 350}
      options={options}
      series={series}
    />
  );
}

function renderChartJsLine(args: {
  data: ChartComponentProps["data"];
  xField: string;
  yFields: NonNullable<ChartComponentProps["chartSpec"]["y"]>;
  chartSpec: ChartComponentProps["chartSpec"];
  meta: ChartComponentProps["meta"];
  config: ChartComponentProps["config"];
}) {
  const { data, xField, yFields, chartSpec, meta, config } = args;
  const labels = buildCategorySeriesLabels(data, xField);

  const curve = chartSpec.line_curve ?? "smooth";
  const stepped = curve === "stepline";
  const tension = curve === "smooth" ? 0.4 : 0;

  const chartJsData: ChartData<"line", (number | null)[], string> = {
    labels,
    datasets: yFields.map((yField, index) => ({
      label: yField.label || yField.field,
      data: buildNumericDataByField(data, yField.field),
      borderColor: CHARTJS_LINE_COLORS[index % CHARTJS_LINE_COLORS.length],
      backgroundColor: CHARTJS_LINE_COLORS[index % CHARTJS_LINE_COLORS.length],
      fill: yField.type === "area",
      tension,
      stepped,
      pointRadius: chartSpec.markers_size ?? 0,
      pointHoverRadius: Math.max((chartSpec.markers_size ?? 0) + 1, 2),
      spanGaps: true,
    })),
  };

  const chartJsOptions: ChartOptions<"line"> = {
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
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: chartSpec.is_stacked,
        title: {
          display: Boolean(chartSpec.x?.[0]?.label),
          text: chartSpec.x?.[0]?.label ?? "",
        },
      },
      y: {
        stacked: chartSpec.is_stacked,
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
      <ChartJsLine data={chartJsData} options={chartJsOptions} />
    </div>
  );
}

export default function LineChart({
  data,
  chartLibrary,
  chartSpec,
  meta,
  config,
}: ChartComponentProps) {
  const xField = chartSpec.x?.[0]?.field;
  const isDatetime = chartSpec.x?.[0]?.unit === "datetime";
  const yFields = chartSpec.y ?? [];

  if (!xField || yFields.length === 0) {
    return renderError(
      "Unable to render line chart: missing required x-axis or y-axis fields.",
    );
  }

  switch (chartLibrary) {
    case "apexcharts":
      return renderApexLine({
        data,
        xField,
        isDatetime,
        yFields,
        chartSpec,
        meta,
        config,
      });
    case "chartjs":
      return renderChartJsLine({
        data,
        xField,
        yFields,
        chartSpec,
        meta,
        config,
      });
    default:
      return renderError(
        `Chart library "${chartLibrary}" is not implemented for line yet.`,
      );
  }
}
