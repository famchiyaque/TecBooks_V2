import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MethodBtn from "./MethodBtn";
import {
  DEFAULT_METHOD_PARAMS,
  selectMethodParams,
  selectSelectedMethods,
  setMethodParam,
  toggleMethod,
} from "@/store/playground.slice.js";
import { forecasts as FORECAST_METHODS } from "@/utils/sims/forecasts/dataForecaster.js";
import ParamsPopover from "./ParamsPopover";

const MethodButtons = () => {
  const dispatch = useDispatch();
  const selectedMethods = useSelector(selectSelectedMethods);
  const methodParams = useSelector(selectMethodParams);
  const [openMethod, setOpenMethod] = useState(null);
  const containerRef = useRef(null);

  // Cierra el dropdown al hacer click fuera o con Escape.
  useEffect(() => {
    const onMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenMethod(null);
      }
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpenMethod(null);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const resetMethod = (method) => {
    Object.entries(DEFAULT_METHOD_PARAMS[method] ?? {}).forEach(
      ([param, value]) => dispatch(setMethodParam({ method, param, value })),
    );
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {Object.keys(FORECAST_METHODS).map((method) => {
        const params = methodParams[method] ?? {};
        const hasParams = Object.keys(params).length > 0;
        const isOpen = openMethod === method;

        return (
          <div key={method} className="relative flex grow basis-auto gap-1">
            <div className="grow [&>button]:w-full">
              <MethodBtn
                label={method}
                isSelected={selectedMethods.includes(method)}
                onClick={() => dispatch(toggleMethod(method))}
              />
            </div>

            {hasParams && (
              <button
                type="button"
                aria-label={`Configurar ${method}`}
                aria-expanded={isOpen}
                onClick={() => setOpenMethod(isOpen ? null : method)}
                className={`flex-none rounded-lg border px-2 text-sm transition-colors ${
                  isOpen
                    ? "border-slate-400 bg-slate-100"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                ⚙
              </button>
            )}

            {isOpen && (
              <ParamsPopover
                method={method}
                params={params}
                onChange={(param, value) =>
                  dispatch(setMethodParam({ method, param, value }))
                }
                onReset={() => resetMethod(method)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MethodButtons;
