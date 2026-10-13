import React, { useState } from "react";
import HistoricalDemand, { createYear } from "./components/HistoricalDemand";

const INITIAL_DEMAND = {
  2024: [81, 84, 92, 90, 88, 96, 105, 102, 109, 111, 115, 114],
  2025: [123, 130, 125, 138, 145, 142, 141, 146, 147, 157, 150, 160],
};

const PlaygroundPage = () => {
  const [demand, setDemand] = useState(INITIAL_DEMAND);

  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <HistoricalDemand
        value={demand}
        onChange={setDemand}
        maxYears={5}
        testMonths={3}
        defaultValue={100}
      />

      {/* Ejemplo de cambio desde el padre */}
      <button
        type="button"
        onClick={() => setDemand({ 2025: createYear(0) })}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
      >
        Reset desde el padre
      </button>

      <pre className="text-xs text-slate-500">{JSON.stringify(demand)}</pre>
    </div>
  );
};

export default PlaygroundPage;
