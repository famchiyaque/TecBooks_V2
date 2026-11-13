import React from "react";

const MethodBtn = ({ onClick, isSelected, label }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border-2 px-4 py-2 font-medium transition-colors text-sm ${
        isSelected
          ? "border-blue-600 bg-blue-50 text-blue-600"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );
};

export default MethodBtn;
