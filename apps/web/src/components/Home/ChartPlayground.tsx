import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { OpenVizRenderer, OpenVizDashboard } from "@openvizai/react";
import {
  SUPPORTED_CHART_TYPES,
  SUPPORTED_CHART_LIBRARIES,
} from "@openvizai/shared-types";
import type { ChartType, ChartLibrary } from "@openvizai/shared-types";
import { useChartState } from "../../context/chartContext";
import { PLAYGROUND_EXAMPLES } from "../../config/playgroundExamples";

interface Props {
  onGenerate: (payload: {
    prompt: string;
    data: Record<string, unknown>[];
    sessionId: string;
    dashboardMode?: boolean;
    maxCharts?: number;
    charts?: ChartType[];
  }) => void;
  loading: boolean;
  error?: string;
}

const isArrayOfObjects = (
  value: unknown,
): value is Record<string, unknown>[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null && typeof item === "object" && !Array.isArray(item),
    )
  );
};

export default function ChartPlayground({ onGenerate, loading, error }: Props) {
  const [dataError, setDataError] = useState("");
  const [chartDropdownOpen, setChartDropdownOpen] = useState(false);
  const [selectedExampleId, setSelectedExampleId] = useState("");
  const [chartLibrary, setChartLibrary] = useState<ChartLibrary>("apexcharts");

  const {
    rows,
    setRows,
    prompt,
    setPrompt,
    dataInput,
    setDataInput,
    chartResult,
    dashboardMode,
    setDashboardMode,
    maxCharts,
    setMaxCharts,
    preferredCharts,
    setPreferredCharts,
  } = useChartState();

  const toggleChartType = (type: ChartType) => {
    setPreferredCharts(
      preferredCharts.includes(type)
        ? preferredCharts.filter((t) => t !== type)
        : [...preferredCharts, type],
    );
  };

  const applyExample = (exampleId: string) => {
    const selected = PLAYGROUND_EXAMPLES.find((item) => item.id === exampleId);
    if (!selected) {
      return;
    }

    setPrompt(selected.prompt);
    setRows(selected.data);
    setDataInput(JSON.stringify(selected.data, null, 2));
    setDataError("");
  };

  const handleJsonUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setDataError("");

    try {
      const content = await file.text();
      const parsed = JSON.parse(content);

      if (!isArrayOfObjects(parsed)) {
        setDataError("Uploaded JSON must be an array of objects");
        return;
      }

      setRows(parsed);
      setDataInput(JSON.stringify(parsed, null, 2));
    } catch {
      setDataError("Invalid JSON file. Please upload a valid .json file");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDataError("");

    if (!prompt.trim()) return setDataError("Prompt is required");
    if (!dataInput.trim()) return setDataError("Data input is required");

    try {
      const parsedData = JSON.parse(dataInput);

      if (!isArrayOfObjects(parsedData)) {
        setDataError("Data must be a JSON array of objects");
        return;
      }

      setRows(parsedData);

      onGenerate({
        prompt,
        data: parsedData,
        sessionId: uuidv4(),
        ...(dashboardMode && {
          dashboardMode: true,
          maxCharts,
          ...(preferredCharts.length > 0 && { charts: preferredCharts }),
        }),
      });
    } catch {
      setDataError("Invalid JSON format in data input");
    }
  };

  const isDashboardResult =
    chartResult && chartResult.response_type === "dashboard";
  const isSingleResult =
    chartResult && chartResult.response_type === "graphical";

  return (
    <main className="col-12 col-md-8 col-lg-9 col-xl-10">
      <div className="card mb-4 home-card composer-card">
        <div className="card-body composer-body">
          <form onSubmit={handleSubmit} className="composer-form">
            <div className="mb-3">
              <label className="form-label composer-label">Try Example</label>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <select
                  className="form-select composer-input"
                  value={selectedExampleId}
                  onChange={(e) => {
                    const exampleId = e.target.value;
                    setSelectedExampleId(exampleId);
                    if (exampleId) {
                      applyExample(exampleId);
                    }
                  }}
                >
                  <option value="">Select sample prompt + data</option>
                  {PLAYGROUND_EXAMPLES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  disabled={!selectedExampleId}
                  onClick={() => applyExample(selectedExampleId)}
                >
                  Fill Example
                </button>
              </div>
              <small className="text-muted">
                Selecting an example auto-fills both prompt and JSON data.
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label composer-label">Prompt</label>
              <textarea
                className="form-control composer-input"
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label composer-label">Data (JSON)</label>
              <div className="d-flex gap-2 align-items-center flex-wrap mb-2">
                <input
                  type="file"
                  accept="application/json,.json"
                  className="form-control composer-input"
                  onChange={handleJsonUpload}
                />
              </div>
              <textarea
                className="form-control font-monospace composer-input composer-json"
                rows={4}
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label composer-label">Chart Library</label>
              <select
                className="form-select composer-input"
                value={chartLibrary}
                onChange={(e) =>
                  setChartLibrary(e.target.value as ChartLibrary)
                }
              >
                {SUPPORTED_CHART_LIBRARIES.map((library) => (
                  <option key={library} value={library}>
                    {library}
                  </option>
                ))}
              </select>
              <small className="text-muted">
                Renderer requires chart library selection. Unregistered
                library/chart pairs show an explicit error.
              </small>
            </div>

            {/* Dashboard Mode Toggle */}
            <div className="mb-3 d-flex align-items-center gap-3">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="dashboardModeSwitch"
                  checked={dashboardMode}
                  onChange={(e) => setDashboardMode(e.target.checked)}
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor="dashboardModeSwitch"
                >
                  Dashboard Mode
                </label>
              </div>
              {dashboardMode && (
                <small className="text-muted">
                  Generate multiple charts from one dataset
                </small>
              )}
            </div>

            {/* Dashboard Config */}
            {dashboardMode && (
              <div
                className="mb-3 p-3 rounded-3"
                style={{
                  backgroundColor: "rgba(15, 126, 242, 0.06)",
                  border: "1px solid rgba(15, 126, 242, 0.15)",
                }}
              >
                <div className="row g-3">
                  {/* Max Charts Slider */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold d-flex justify-content-between">
                      <span>Max Charts</span>
                      <span className="badge bg-primary rounded-pill">
                        {maxCharts}
                      </span>
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min={1}
                      max={5}
                      step={1}
                      value={maxCharts}
                      onChange={(e) => setMaxCharts(Number(e.target.value))}
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">1</small>
                      <small className="text-muted">5</small>
                    </div>
                  </div>

                  {/* Chart Type Multi-Select */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold">
                      Preferred Chart Types{" "}
                      <small className="text-muted fw-normal">(optional)</small>
                    </label>
                    <div className="position-relative">
                      <div
                        className="form-control d-flex flex-wrap gap-1 align-items-center"
                        style={{
                          cursor: "pointer",
                          minHeight: "38px",
                        }}
                        onClick={() => setChartDropdownOpen(!chartDropdownOpen)}
                      >
                        {preferredCharts.length === 0 ? (
                          <span className="text-muted">All types</span>
                        ) : (
                          preferredCharts.map((type) => (
                            <span
                              key={type}
                              className="badge bg-primary d-flex align-items-center gap-1"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {type.replace("_", " ")}
                              <span
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleChartType(type);
                                }}
                                style={{ cursor: "pointer", lineHeight: 1 }}
                              >
                                &times;
                              </span>
                            </span>
                          ))
                        )}
                      </div>
                      {chartDropdownOpen && (
                        <ul
                          className="list-group position-absolute w-100 shadow-sm"
                          style={{
                            zIndex: 10,
                            top: "100%",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {SUPPORTED_CHART_TYPES.map((type) => (
                            <li
                              key={type}
                              className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                                preferredCharts.includes(type) ? "active" : ""
                              }`}
                              style={{
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                              onClick={() => toggleChartType(type)}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input m-0"
                                checked={preferredCharts.includes(type)}
                                readOnly
                              />
                              {type.replace("_", " ")}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dataError && (
              <div className="alert alert-danger composer-alert">
                {dataError}
              </div>
            )}

            {error && (
              <div className="alert alert-danger composer-alert">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold generate-btn"
              disabled={loading}
            >
              {loading
                ? dashboardMode
                  ? "Generating Dashboard..."
                  : "Generating Chart..."
                : dashboardMode
                  ? "Generate Dashboard"
                  : "Generate Chart"}
            </button>
          </form>
        </div>
      </div>

      {/* Single chart result */}
      {isSingleResult && (
        <div className="card home-card result-card">
          <div className="card-header text-white d-flex flex-column result-card-header">
            <h5 className="mb-1">{chartResult.meta.title}</h5>
            <small className="result-subtitle">
              {chartResult.meta.query_explanation}
            </small>
          </div>

          <div className="card-body result-card-body">
            <OpenVizRenderer
              data={rows}
              chartLibrary={chartLibrary}
              chartType={chartResult.chart.chart_type}
              chartSpec={chartResult.chart.chartSpec}
              meta={chartResult.meta}
            />
          </div>
        </div>
      )}

      {/* Dashboard result */}
      {isDashboardResult && chartResult.charts.length > 0 && (
        <OpenVizDashboard
          data={rows}
          chartLibrary={chartLibrary}
          charts={chartResult.charts as any}
          columns={chartResult.charts.length === 1 ? 1 : 2}
        />
      )}
    </main>
  );
}
