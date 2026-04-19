---
sidebar_position: 2
---

# Field Reference

This page summarizes common `chartSpec` fields used across chart types.

| Field | Type | Meaning |
| --- | --- | --- |
| `x` | `ChartSpecField[] \| null` | X-axis dimension fields |
| `y` | `ChartSpecFieldWithType[] \| null` | Numeric series fields with visual type |
| `group` | `ChartSpecField[] \| null` | Grouping dimensions |
| `category` | `ChartSpecField[] \| null` | Category dimensions for pie/donut |
| `value` | `ChartSpecField[] \| null` | Primary measure for pie/donut |
| `start` / `end` | `ChartSpecField[] \| null` | Range start/end fields |
| `is_stacked` | `boolean` | Stacked series behavior |
| `is_horizontal` | `boolean` | Horizontal orientation |
| `colorSemantic` | enum \| `null` | Semantic color intent |

Color semantic values:

- `positive`
- `negative`
- `neutral`
- `warning`
- `caution`
- `target`
- `highlight`
- `missing`
- `forecast`
