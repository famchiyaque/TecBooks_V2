import React, { useState } from "react";
import HistoricalDemand, { createYear } from "./components/HistoricalDemand";
import Graph from "./components/Graph";
import { useForecast } from "@/hooks/sims/forecasts/useForecast";

const INITIAL_DEMAND = {
  2024: [81, 84, 92, 90, 88, 96, 105, 102, 109, 111, 115, 114],
  2025: [123, 130, 125, 138, 145, 142, 141, 146, 147, 157, 150, 160],
};

const ForecastErrorsContent = () => {
  const [demand, setDemand] = useState(INITIAL_DEMAND);
  const forecast = useForecast(demand, { futurePeriods: 12 });

  return (
    <div className="flex items-start gap-4 p-6">
      <HistoricalDemand
        value={demand}
        onChange={setDemand}
        setDefault={() => setDemand(INITIAL_DEMAND)}
        maxYears={5}
        testMonths={3}
        defaultValue={100}
      />

      <Graph forecast={forecast} />
    </div>
  );
};

export default ForecastErrorsContent;
