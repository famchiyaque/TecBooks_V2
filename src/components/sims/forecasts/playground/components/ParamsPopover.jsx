import { forecastParams as PARAM_META } from "@/utils/sims/forecasts/dataForecaster";

const ParamsPopover = ({ method, params, onChange, onReset }) => (
  <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
    <p className="mb-2 text-xs font-semibold text-slate-700">{method}</p>
    <div className="flex flex-col gap-3">
      {Object.entries(params).map(([param, value]) => {
        const meta = PARAM_META[param] ?? {
          label: param,
          min: 0,
          max: 1,
          step: 0.01,
        };
        return (
          <label
            key={param}
            className="flex flex-col gap-1 text-xs text-slate-600"
          >
            <span className="flex justify-between">
              {meta.label}
              <span className="tabular-nums font-medium text-slate-900">
                {value}
              </span>
            </span>
            <input
              type="range"
              min={meta.min}
              max={meta.max}
              step={meta.step}
              value={value}
              onChange={(e) => onChange(param, Number(e.target.value))}
            />
          </label>
        );
      })}
    </div>
    <button
      type="button"
      onClick={onReset}
      className="mt-3 text-xs text-slate-500 underline hover:text-slate-800"
    >
      Reset
    </button>
  </div>
);

export default ParamsPopover;
