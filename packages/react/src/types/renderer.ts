import type {
  ChartType,
  ChartSpecField,
  ChartSpec,
  ChartMeta,
} from "@openvizai/shared-types";

/** Chart library key used to resolve renderer components. */
export type ChartLibrary = "apexcharts" | "chartjs" | (string & {});

/** Optional rendering configuration */
export type OpenVizConfig = {
  height?: number;
  width?: string | number;
  legendPosition?: "top" | "bottom" | "left" | "right";
  dataLabelsEnabled?: boolean;
  toolbarVisible?: boolean;
  animations?: boolean;
};

/** Props for the main <OpenVizRenderer /> component */
export type OpenVizRendererProps = {
  /** The dataset rows to visualize */
  data: Record<string, unknown>[];
  /** Chart library to resolve the renderer component from */
  chartLibrary: ChartLibrary;
  /** Chart type to render */
  chartType: ChartType;
  /** Chart specification describing field mappings */
  chartSpec: ChartSpec;
  /** Optional chart metadata (title, subtitle) */
  meta?: ChartMeta;
  /** Optional rendering config overrides */
  config?: OpenVizConfig;
  /** Optional CSS class name for the wrapper */
  className?: string;
};

export type { ChartSpecField, ChartSpec, ChartMeta };
