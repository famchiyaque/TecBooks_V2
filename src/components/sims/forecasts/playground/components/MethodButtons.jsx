import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MethodBtn from "./MethodBtn";
import {
  selectSelectedMethods,
  toggleMethod,
} from "@/store/playground.slice.js";
import { forecasts as FORECAST_METHODS } from "@/utils/sims/forecasts/dataForecaster.js";

const MethodButtons = () => {
  const dispatch = useDispatch();
  const selectedMethods = useSelector(selectSelectedMethods);

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {Object.keys(FORECAST_METHODS).map((method) => (
        <div key={method} className="grow basis-auto [&>button]:w-full">
          <MethodBtn
            key={method}
            label={method}
            isSelected={selectedMethods.includes(method)}
            onClick={() => dispatch(toggleMethod(method))}
          />
        </div>
      ))}
    </div>
  );
};

export default MethodButtons;
