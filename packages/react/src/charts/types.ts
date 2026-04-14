import type { ChartType } from "@openvizai/shared-types";
import type {
  ChartSpec,
  ChartMeta,
  OpenVizConfig,
  ChartLibrary,
} from "../types/index.js";

export type ChartComponentProps = {
  data: Record<string, unknown>[];
  chartLibrary: ChartLibrary;
  chartType: ChartType;
  chartSpec: ChartSpec;
  meta?: ChartMeta;
  config?: OpenVizConfig;
};
