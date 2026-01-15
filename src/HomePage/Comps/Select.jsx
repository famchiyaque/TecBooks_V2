import React, { useState } from "react";

function Select({ defaultVal, options }) {
  const [selectedOption, setSelectedOption] = useState(defaultVal);

  return (
    // From Uiverse.io by 3bdel3ziz-T
    <div className="select">
      <div className="selected" data-default={defaultVal}>
        {selectedOption}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className="arrow"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
        </svg>
      </div>
      <div className="options">
        {options.map((option, index) => (
          <div key={option} title={option}>
            <input
              id={option}
              name="option"
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
            />
            <label className="option" htmlFor={option} data-txt={option}>
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Select;
