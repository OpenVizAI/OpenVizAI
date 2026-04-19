/**
 * Canonical list of supported ApexChart types for OpenVizAI.
 * Single source of truth used across:
 *   - Frontend: type safety, ChartRenderer dispatch, config examples
 *   - Backend:  Zod schema validation, LLM prompt generation
 *
 * To add a new chart type, add it here — the Zod enum, prompt, and TS types
 * all update automatically wherever SUPPORTED_CHART_TYPES is referenced.
 */
export const SUPPORTED_CHART_TYPES = [
  "line",
  "radar",
  "bar",
  "range_bar",
  "pie",
  "donut",
] as const;

/** Canonical list of chart library keys supported out of the box. */
export const SUPPORTED_CHART_LIBRARIES = ["apexcharts", "chartjs"] as const;

/** Union of all supported chart type strings: "line" | "radar" | "bar" | "range_bar" | "pie" | "donut" */
export type ChartType = (typeof SUPPORTED_CHART_TYPES)[number];

/** Chart library key used by renderer dispatch. Allows custom user-registered libraries. */
export type ChartLibrary =
  | (typeof SUPPORTED_CHART_LIBRARIES)[number]
  | (string & {});

export {
  SERIES_VISUAL_TYPES,
  COLOR_SEMANTICS,
  LINE_CURVES,
  ChartSpecFieldSchema,
  ChartSpecFieldWithTypeSchema,
  ChartSpecSchema,
  ChartMetaSchema,
  ChartConfigSchema,
  SingleChartResultSchema,
  DashboardChartItemSchema,
  DashboardResultSchema,
} from "./chartSpec.js";

export type {
  SeriesVisualType,
  ColorSemantic,
  LineCurve,
  ChartSpecField,
  ChartSpecFieldWithType,
  ChartSpec,
  ChartMeta,
  ChartConfig,
  SingleChartResult,
  DashboardChartItem,
  DashboardResult,
} from "./chartSpec.js";
