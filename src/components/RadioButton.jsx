import React from "react";

const RadioButton = ({ label, options }) => {
  return (
    <div>
      <label>{label}:</label>
      {options.map((option, index) => (
        <label key={index}>
          <input type="radio" name={label} value={option} />
          {option}
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
