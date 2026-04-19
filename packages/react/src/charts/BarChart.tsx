import { useId } from "react";
import Chart from "react-apexcharts";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { ChartComponentProps } from "./types.js";
import type { ChartSpecField } from "../types/index.js";
import { buildApexBaseOptions } from "../chartSpec/apexBaseOptions.js";
import {
  buildCategorySeriesLabels,
  buildNumericSeries,
  buildRangeBarPoints,
} from "../chartSpec/seriesBuilder.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const CHARTJS_BACKGROUND_COLORS = [
  "rgba(59, 130, 246, 0.55)",
  "rgba(16, 185, 129, 0.55)",
  "rgba(245, 158, 11, 0.55)",
  "rgba(239, 68, 68, 0.55)",
  "rgba(139, 92, 246, 0.55)",
  "rgba(14, 165, 233, 0.55)",
];

const CHARTJS_BORDER_COLORS = [
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

type StandardSeries = Array<{
  name: string;
  data: (number | null)[];
}>;

type RangeSeries = Array<{
  name: string;
  data: Array<{ x: string; y: [number, number] }>;
}>;

function renderApexStandardBar(args: {
  chartId: string;
  categories: string[];
  series: StandardSeries;
  chartSpec: ChartComponentProps["chartSpec"];
  config: ChartComponentProps["config"];
  baseOptions: ReturnType<typeof buildApexBaseOptions>;
}) {
  const { chartId, categories, series, chartSpec, config, baseOptions } = args;

  const apexBarOptions = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      stacked: chartSpec.is_stacked,
    },
    plotOptions: {
      bar: {
        horizontal: chartSpec.is_horizontal,
      },
    },
    xaxis: {
      categories,
      title: {
        text: chartSpec.x?.[0]?.label ?? undefined,
      },
    },
  };

  return (
    <Chart
      key={chartId}
      type="bar"
      width={config?.width ?? "100%"}
      height={config?.height ?? 350}
      options={apexBarOptions}
      series={series}
    />
  );
}

function renderApexRangeBar(args: {
  chartId: string;
  series: RangeSeries;
  chartSpec: ChartComponentProps["chartSpec"];
  config: ChartComponentProps["config"];
  baseOptions: ReturnType<typeof buildApexBaseOptions>;
  hasDatetimeRange: boolean;
}) {
  const { chartId, series, chartSpec, config, baseOptions, hasDatetimeRange } =
    args;

  const rangeOptions = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      id: chartId,
    },
    plotOptions: {
      bar: {
        horizontal: chartSpec.is_horizontal,
      },
    },
    xaxis: {
      type: hasDatetimeRange ? ("datetime" as const) : ("category" as const),
    },
  };

  return (
    <Chart
      key={chartId}
      type="rangeBar"
      width={config?.width ?? "100%"}
      height={config?.height ?? 350}
      options={rangeOptions}
      series={series}
    />
  );
}

function renderChartJsStandardBar(args: {
  chartId: string;
  categories: string[];
  series: StandardSeries;
  chartSpec: ChartComponentProps["chartSpec"];
  config: ChartComponentProps["config"];
  meta: ChartComponentProps["meta"];
}) {
  const { chartId, categories, series, chartSpec, config, meta } = args;
  const legendPosition = config?.legendPosition ?? "top";

  const chartJsData: ChartData<"bar", (number | null)[], string> = {
    labels: categories,
    datasets: series.map((seriesItem, index) => ({
      label: seriesItem.name,
      data: seriesItem.data,
      backgroundColor:
        CHARTJS_BACKGROUND_COLORS[index % CHARTJS_BACKGROUND_COLORS.length],
      borderColor: CHARTJS_BORDER_COLORS[index % CHARTJS_BORDER_COLORS.length],
      borderWidth: 1,
    })),
  };

  const chartJsOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartSpec.is_horizontal ? "y" : "x",
    plugins: {
      legend: {
        display: true,
        position: legendPosition,
      },
      title: {
        display: Boolean(meta?.title),
        text: meta?.title ?? "",
      },
    },
    scales: {
      x: {
        stacked: chartSpec.is_stacked,
        title: {
          display: Boolean(chartSpec.x?.[0]?.label),
          text: chartSpec.x?.[0]?.label ?? "",
        },
        beginAtZero: chartSpec.is_horizontal,
      },
      y: {
        stacked: chartSpec.is_stacked,
        beginAtZero: !chartSpec.is_horizontal,
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
      <Bar key={chartId} data={chartJsData} options={chartJsOptions} />
    </div>
  );
}

// Normalize start/end which can be either a single field or field array.
function normalizeField(
  field: ChartSpecField | ChartSpecField[] | null | undefined,
): ChartSpecField | undefined {
  if (!field) return undefined;
  if (Array.isArray(field)) return field[0];
  return field;
}

function isNumericLike(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;
  if (typeof value === "number") return Number.isFinite(value);
  const parsed = Number(value);
  return Number.isFinite(parsed);
}

function inferRangeFields(
  rows: Record<string, unknown>[],
  xField: string | undefined,
  yFields: ChartSpecField[],
  startField: ChartSpecField | undefined,
  endField: ChartSpecField | undefined,
): {
  xField: string | undefined;
  startField: ChartSpecField | undefined;
  endField: ChartSpecField | undefined;
} {
  let resolvedX = xField;
  let resolvedStart = startField;
  let resolvedEnd = endField;

  if ((!resolvedStart || !resolvedEnd) && yFields.length >= 2) {
    resolvedStart = resolvedStart ?? {
      field: yFields[0].field,
      label: yFields[0].label,
      unit: yFields[0].unit,
    };
    resolvedEnd = resolvedEnd ?? {
      field: yFields[1].field,
      label: yFields[1].label,
      unit: yFields[1].unit,
    };
  }

  if ((!resolvedStart || !resolvedEnd) && rows.length > 0) {
    const sample = rows[0] ?? {};
    const keys = Object.keys(sample);
    const numericKeys = keys.filter(
      (key) => key !== resolvedX && rows.some((row) => isNumericLike(row[key])),
    );

    if (!resolvedStart && numericKeys[0]) {
      resolvedStart = {
        field: numericKeys[0],
        label: numericKeys[0],
        unit: null,
      };
    }
    if (!resolvedEnd && numericKeys[1]) {
      resolvedEnd = {
        field: numericKeys[1],
        label: numericKeys[1],
        unit: null,
      };
    }
  }

  if (!resolvedX && rows.length > 0) {
    const sample = rows[0] ?? {};
    const keys = Object.keys(sample);
    const categoricalKey = keys.find(
      (key) =>
        key !== resolvedStart?.field &&
        key !== resolvedEnd?.field &&
        !rows.some((row) => isNumericLike(row[key])),
    );

    resolvedX = categoricalKey ?? keys[0];
  }

  return {
    xField: resolvedX,
    startField: resolvedStart,
    endField: resolvedEnd,
  };
}

export default function BarChart({
  data,
  chartLibrary,
  chartType,
  chartSpec,
  meta,
  config,
}: ChartComponentProps) {
  const instanceId = useId();
  const isRangeChart = chartType === "range_bar" || chartSpec.is_range;
  const chartMode = isRangeChart ? "rangeBar" : "bar";
  const chartId = `${meta?.title || "bar-chart"}-${chartMode}-${instanceId}`;

  const xField = chartSpec.x?.[0]?.field;
  const yFields = chartSpec.y ?? [];
  const startField = normalizeField(chartSpec.start);
  const endField = normalizeField(chartSpec.end);

  const resolvedRangeFields = inferRangeFields(
    data,
    xField,
    yFields,
    startField,
    endField,
  );

  // Guard: bar/column needs either x+y or range fields
  if (
    !xField &&
    !resolvedRangeFields.xField &&
    !startField &&
    !resolvedRangeFields.startField
  ) {
    return renderError(
      "Unable to render bar chart: missing required axis fields.",
    );
  }

  const baseOptions = buildApexBaseOptions({
    chartId,
    title: meta?.title,
    subtitle: meta?.subtitle,
    legendPosition: config?.legendPosition ?? "top",
    dataLabelsEnabled: config?.dataLabelsEnabled ?? false,
    toolbarVisible: config?.toolbarVisible,
  });

  const categories = xField ? buildCategorySeriesLabels(data, xField) : [];
  const standardSeries = buildNumericSeries(data, yFields);

  if (
    isRangeChart &&
    resolvedRangeFields.startField &&
    resolvedRangeFields.endField &&
    resolvedRangeFields.xField
  ) {
    const rangeSeries = [
      {
        name: `${resolvedRangeFields.startField.label ?? "Start"} - ${resolvedRangeFields.endField.label ?? "End"}`,
        data: buildRangeBarPoints(
          data,
          resolvedRangeFields.xField,
          resolvedRangeFields.startField.field,
          resolvedRangeFields.endField.field,
        ),
      },
    ];

    if (!rangeSeries[0].data || rangeSeries[0].data.length === 0) {
      return renderError(
        "Unable to render range bar chart: no valid range points found.",
      );
    }

    const hasDatetimeRange =
      resolvedRangeFields.startField?.unit === "datetime" ||
      resolvedRangeFields.endField?.unit === "datetime";

    switch (chartLibrary) {
      case "apexcharts":
        return renderApexRangeBar({
          chartId,
          series: rangeSeries,
          chartSpec,
          config,
          baseOptions,
          hasDatetimeRange,
        });
      case "chartjs":
        return renderError(
          'Range bar rendering is not implemented for chart library "chartjs" yet.',
        );
      default:
        return renderError(
          `Chart library "${chartLibrary}" is not implemented for range bar yet.`,
        );
    }
  }

  if (isRangeChart) {
    return renderError(
      "Unable to render range bar chart: missing start/end fields.",
    );
  }

  switch (chartLibrary) {
    case "apexcharts":
      return renderApexStandardBar({
        chartId,
        categories,
        series: standardSeries,
        chartSpec,
        config,
        baseOptions,
      });
    case "chartjs":
      return renderChartJsStandardBar({
        chartId,
        categories,
        series: standardSeries,
        chartSpec,
        config,
        meta,
      });
    default:
      return renderError(
        `Chart library "${chartLibrary}" is not implemented for bar yet.`,
      );
  }
}
