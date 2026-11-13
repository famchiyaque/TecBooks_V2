import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { forecasts as FORECAST_METHODS } from "@/utils/sims/forecasts/dataForecaster.js";
import {
  selectSelectedMethods,
  selectMethodParams,
  toggleMethod,
  setMethodParam,
} from "@/store/playground.slice.js";

const METHOD_NAMES = Object.keys(FORECAST_METHODS);

// RF6 - que parametros tiene cada metodo (ninguno para los de regresion -
// esos no tienen perilla que mover). Cada metodo guarda los suyos aparte en
// methodParams[method] - cambiar uno nunca toca los de otro metodo.
const METHOD_PARAM_SPECS = {
  "Simple Moving Average": [{ key: "compound", label: "Window", min: 2, max: 12, step: 1 }],
  "Simple Exponential Smoothing": [{ key: "alpha", label: "α", min: 0, max: 1, step: 0.05 }],
  "Double Exponential Smoothing": [
    { key: "alpha", label: "α", min: 0, max: 1, step: 0.05 },
    { key: "beta", label: "β", min: 0, max: 1, step: 0.05 },
  ],
  "Winter's": [
    { key: "alpha", label: "α", min: 0, max: 1, step: 0.05 },
    { key: "beta", label: "β", min: 0, max: 1, step: 0.05 },
    { key: "gamma", label: "γ", min: 0, max: 1, step: 0.05 },
  ],
};

function MethodParamSliders({ method }) {
  const dispatch = useDispatch();
  const methodParams = useSelector(selectMethodParams);
  const specs = METHOD_PARAM_SPECS[method];
  if (!specs) return null;

  const values = methodParams[method] ?? {};

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-slate-50/60 px-3 py-2">
      <span className="text-xs font-medium text-slate-500">{method}</span>
      {specs.map((spec) => (
        <label key={spec.key} className="flex items-center gap-2 text-xs text-slate-600">
          {spec.label}
          <input
            type="range"
            min={spec.min}
            max={spec.max}
            step={spec.step}
            value={values[spec.key] ?? spec.min}
            onChange={(event) =>
              dispatch(
                setMethodParam({ method, param: spec.key, value: Number(event.target.value) }),
              )
            }
          />
          <span className="tabular-nums">{values[spec.key] ?? spec.min}</span>
        </label>
      ))}
    </div>
  );
}

/** RF5/6 - Banco de Metodos: boton por metodo (toggle) + sus propios parametros. */
const MethodsBank = () => {
  const dispatch = useDispatch();
  const selectedMethods = useSelector(selectSelectedMethods);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Forecast Models</h2>
      <div className="mb-3 flex flex-wrap gap-2">
        {METHOD_NAMES.map((method) => {
          const active = selectedMethods.includes(method);
          return (
            <button
              key={method}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch(toggleMethod(method))}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {method}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        {selectedMethods.map((method) => (
          <MethodParamSliders key={method} method={method} />
        ))}
      </div>
    </section>
  );
};

export default MethodsBank;
