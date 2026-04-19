import type { ChartResult } from "../types/chart.js";
import type { ChartSpec } from "../types/chartSpec.js";

/**
 * Post-LLM validation: ensure `chart_type` matches the filled chartSpec fields.
 *
 * If the LLM placed fields in the wrong slots (e.g. `x/y` for a pie chart
 * instead of `category/value`), this function attempts automatic recovery.
 *
 * @param result - The raw `ChartResult` from the LLM.
 * @returns The validated (and possibly corrected) `ChartResult`.
 *
 * @example
 * ```ts
 * const fixed = validateEmbeddingConsistency(rawResult);
 * // fixed.chart.chartSpec is now consistent with fixed.chart.chart_type
 * ```
 */
export function validateChartSpecConsistency(result: ChartResult): ChartResult {
  const { chart_type } = result.chart;
  const chartSpec = { ...result.chart.chartSpec };

  if (chart_type === "pie" || chart_type === "donut") {
    // Pie/donut needs category + value, NOT x + y
    if (
      (!chartSpec.category || chartSpec.category.length === 0) &&
      (!chartSpec.value || chartSpec.value.length === 0)
    ) {
      // LLM filled x/y instead of category/value — attempt recovery
      if (
        chartSpec.x &&
        chartSpec.x.length > 0 &&
        chartSpec.y &&
        chartSpec.y.length > 0
      ) {
        chartSpec.category = [
          {
            field: chartSpec.x[0].field,
            label: chartSpec.x[0].label,
            unit: chartSpec.x[0].unit,
          },
        ];
        chartSpec.value = [
          {
            field: chartSpec.y[0].field,
            label: chartSpec.y[0].label,
            unit: chartSpec.y[0].unit,
          },
        ];
      }
    }
    chartSpec.x = null;
    chartSpec.y = null;
  } else if (chart_type === "range_bar") {
    // range_bar needs x, start, end
    // Recovery path: if start/end are missing but y has at least 2 fields,
    // map y[0] -> start and y[1] -> end.
    if (
      (!chartSpec.start || chartSpec.start.length === 0) &&
      (!chartSpec.end || chartSpec.end.length === 0) &&
      chartSpec.y &&
      chartSpec.y.length >= 2
    ) {
      chartSpec.start = [
        {
          field: chartSpec.y[0].field,
          label: chartSpec.y[0].label,
          unit: chartSpec.y[0].unit,
        },
      ];
      chartSpec.end = [
        {
          field: chartSpec.y[1].field,
          label: chartSpec.y[1].label,
          unit: chartSpec.y[1].unit,
        },
      ];
    }

    // Recovery path: if x is missing but category exists, reuse category as x.
    if (
      (!chartSpec.x || chartSpec.x.length === 0) &&
      chartSpec.category &&
      chartSpec.category.length > 0
    ) {
      chartSpec.x = [
        {
          field: chartSpec.category[0].field,
          label: chartSpec.category[0].label,
          unit: chartSpec.category[0].unit,
        },
      ];
    }

    chartSpec.is_horizontal = true;
    chartSpec.y = null;
    chartSpec.category = null;
    chartSpec.value = null;
  } else if (
    chart_type === "line" ||
    chart_type === "bar" ||
    chart_type === "radar"
  ) {
    // line/bar/radar needs x + y
    if (
      (!chartSpec.x || chartSpec.x.length === 0) &&
      (!chartSpec.y || chartSpec.y.length === 0)
    ) {
      // LLM filled category/value instead of x/y — attempt recovery
      if (
        chartSpec.category &&
        chartSpec.category.length > 0 &&
        chartSpec.value &&
        chartSpec.value.length > 0
      ) {
        chartSpec.x = [
          {
            field: chartSpec.category[0].field,
            label: chartSpec.category[0].label,
            unit: chartSpec.category[0].unit,
          },
        ];
        chartSpec.y = [
          {
            field: chartSpec.value[0].field,
            label: chartSpec.value[0].label,
            unit: chartSpec.value[0].unit,
            type: "bar" as const,
          },
        ];
      }
    }
    chartSpec.category = null;
    chartSpec.value = null;
    chartSpec.start = null;
    chartSpec.end = null;
  }

  return {
    ...result,
    chart: {
      ...result.chart,
      chartSpec: chartSpec as ChartSpec,
    },
  };
}
