---
sidebar_position: 1
---

# OpenVizAI Spec v1

OpenVizAI uses a versioned chart contract: `openvizai/spec/v1`.

## Supported Chart Types

- `line`
- `radar`
- `bar`
- `range_bar`
- `pie`
- `donut`

## Core Object

```json
{
  "response_type": "graphical",
  "meta": {
    "title": "Monthly Revenue",
    "subtitle": "FY 2025",
    "query_explanation": "Line chart shows trend over time."
  },
  "chart": {
    "chart_type": "line",
    "chartSpec": {
      "x": [{ "field": "month", "label": "Month", "unit": null }],
      "y": [{ "field": "revenue", "label": "Revenue", "unit": "USD", "type": "line" }],
      "group": null,
      "category": null,
      "value": null,
      "source": null,
      "target": null,
      "start": null,
      "end": null,
      "series": null,
      "path": null,
      "is_stacked": false,
      "is_horizontal": false,
      "isSemanticColors": false,
      "colorSemantic": "neutral"
    }
  }
}
```

## Validation

Use `@openvizai/shared-types` to validate payloads.

```ts
import { SingleChartResultSchema } from "@openvizai/shared-types";

const parsed = SingleChartResultSchema.safeParse(payload);

if (!parsed.success) {
  console.error(parsed.error.issues);
}
```

## Related Samples

- [Canonical sample](https://github.com/OpenVizAI/OpenVizAI/blob/main/docs/openvizai-spec-v1.sample.json)
- [Line sample](https://github.com/OpenVizAI/OpenVizAI/blob/main/docs/openvizai-spec-v1.line.sample.json)
- [Bar sample](https://github.com/OpenVizAI/OpenVizAI/blob/main/docs/openvizai-spec-v1.bar.sample.json)
