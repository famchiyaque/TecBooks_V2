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
  const openRef = useRef(null); // ref del método abierto

  useEffect(() => {
    if (!openMethod) return;

    const onMouseDown = (e) => {
      if (openRef.current && !openRef.current.contains(e.target)) {
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
  }, [openMethod]);

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
            <div
              ref={isOpen ? openRef : null}
              className={`relative flex grow basis-auto items-stretch rounded-lg border transition-colors ${
                isOpen ? "border-slate-400" : "border-slate-300"
              }`}
            >
              {/* Quita borde y radio propios de MethodBtn; el contenedor los pone */}
              <div
                className={`grow [&>button]:h-full [&>button]:w-full [&>button]:border-0 ${
                  hasParams
                    ? "[&>button]:rounded-l-lg [&>button]:rounded-r-none"
                    : "[&>button]:rounded-lg"
                }`}
              >
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
                  className={`flex-none rounded-r-lg border-l border-slate-300 px-2.5 text-sm transition-colors hover:bg-slate-100 ${
                    isOpen ? "bg-slate-100" : "bg-transparent"
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
          </div>
        );
      })}
    </div>
  );
};

export default MethodButtons;
