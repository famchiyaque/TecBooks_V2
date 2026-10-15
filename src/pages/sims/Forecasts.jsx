import React, { useState } from "react";
import { Provider } from "react-redux";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import GenericSubheader from "@/components/global/GenericSubheader";
import GenericHeader from "@/components/global/GenericHeader";
import Graph from "@/components/sims/forecasts/Graph";
import MethodsSidebar from "@/components/sims/forecasts/MethodsSidebar";
import DataOptionsHeader from "@/components/sims/forecasts/DataOptionsHeader";
import GraphOptions from "@/components/sims/forecasts/GraphOptions";
import TimelineSliders from "@/components/sims/forecasts/TimelineSliders";
import useBaseSalesData from "@/hooks/sims/forecasts/useBaseSalesData";
import useSeriesData from "@/hooks/sims/forecasts/useSeriesData";
import { createForecastStore } from "@/store/forecast-playground.store";
import { createErrorsStore } from "@/store/forecasts-errors.store";
import ForecastErrorsContent from "@/components/sims/forecasts/playground/ForecastErrorsContent";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            background: "#fee",
            color: "#900",
            fontFamily: "monospace",
          }}
        >
          <strong>Crash capturado:</strong>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
            {this.state.error.toString()}
            {"\n"}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function ForecastsPlaygroundContent() {
  useBaseSalesData();
  useSeriesData();

  return (
    <ErrorBoundary>
      <div style={{ backgroundColor: "white" }}>
        <div className="w-screen flex">
          <MethodsSidebar />
          <div className="flex-1 h-screen min-h-[800]">
            <DataOptionsHeader />
            <div className="flex justify-around">
              <div className="flex-6 flex-col gap-4">
                <TimelineSliders className="my-4" />
                <Graph />
              </div>
              <GraphOptions className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Owns both Redux stores so App.jsx stays provider-free.
 * Stores are created once per mount. Both trees stay mounted so a toggle
 * does not recreate a store or re-run the playground hooks.
 */
function ForecastsSim() {
  const [view, setView] = useState("playground");
  const [playgroundStore] = useState(() => createForecastStore());
  const [errorsStore] = useState(() => createErrorsStore());

  const handleViewChange = (_, next) => {
    if (next) setView(next);
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <GenericHeader pageName={"Simulator"} />
      <GenericSubheader subheader={"Sales Forecaster"}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          onChange={handleViewChange}
          aria-label="Forecast view"
          sx={{
            "& .MuiToggleButton-root": {
              color: "white",
              borderColor: "rgba(255,255,255,0.6)",
              textTransform: "none",
              px: 1.5,
              py: 0.25,
            },
            "& .Mui-selected": {
              color: "#0077b6 !important",
              backgroundColor: "white !important",
            },
          }}
        >
          <ToggleButton value="errors">Errors</ToggleButton>
          <ToggleButton value="playground">Playground</ToggleButton>
        </ToggleButtonGroup>
      </GenericSubheader>
      <div hidden={view !== "playground"}>
        <Provider store={playgroundStore}>
          <ForecastsPlaygroundContent />
        </Provider>
      </div>
      <div hidden={view !== "errors"}>
        <Provider store={errorsStore}>
          <ForecastErrorsContent />
        </Provider>
      </div>
    </div>
  );
}

export default ForecastsSim;
