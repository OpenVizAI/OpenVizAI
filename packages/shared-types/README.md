# @openvizai/shared-types

Shared TypeScript contracts and constants for OpenVizAI packages.

This package provides canonical chart constants and contracts used across backend prompts, validation schemas, and frontend rendering.

## Install

```bash
npm install @openvizai/shared-types
```

## Usage

```ts
import {
  SUPPORTED_CHART_TYPES,
  SUPPORTED_CHART_LIBRARIES,
} from "@openvizai/shared-types";
import type { ChartType, ChartLibrary } from "@openvizai/shared-types";

const preferredLibrary: ChartLibrary = "apexcharts";
```

## Current Library Support

`SUPPORTED_CHART_LIBRARIES` currently contains **2 libraries**:

- `apexcharts`
- `chartjs`

## Why this package exists

- Prevents chart type drift between packages
- Prevents chart library drift between packages
- Keeps core and react contracts aligned
- Improves type safety across package boundaries

For full context, see:
https://github.com/OpenVizAI/OpenVizAI
