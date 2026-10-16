import React, { useState } from "react";
import MethodBtn from "./MethodBtn";

const METHODS = [
  { label: "Simple Linear Regression", key: "slr" },
  { label: "Double Linear Regression", key: "dlr" },
  { label: "Simple Moving Average", key: "sma" },
  { label: "Double Moving Average", key: "dma" },
  { label: "Simple Exponential Smoothing", key: "se" },
  { label: "Double Exponential Smoothing", key: "de" },
  { label: "Winter's", key: "w" },
];

const MethodButtons = () => {
  const [selected, setSelected] = useState({
    slr: true,
    dlr: false,
    sma: false,
    dma: false,
    se: false,
    de: false,
    w: false,
  });

  const toggleSelect = (key) => {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {METHODS.map((method) => (
        <MethodBtn
          key={method.key}
          label={method.label}
          isSelected={selected[method.key]}
          onClick={() => toggleSelect(method.key)}
        />
      ))}
    </div>
  );
};

export default MethodButtons;
