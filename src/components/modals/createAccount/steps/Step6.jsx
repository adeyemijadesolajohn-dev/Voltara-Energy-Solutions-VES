// Step6 -- Tariff Type
import React from "react";
import { Icons } from "../../../../data/Assets";

const Step6 = ({ formData, setFormData, error }) => {
  const options = [
    { label: "Residential", value: "Residential", icon: Icons.Residential },
    { label: "Commercial", value: "Commercial", icon: Icons.Commercial },
    { label: "Estate", value: "Estate", icon: Icons.Estate },
    { label: "Government", value: "Government", icon: Icons.Government },
  ];

  return (
    <div className="formStep">
      {options.map(({ label, value, icon: Icon }) => (
        <label
          key={value}
          className={`createCheckBox ${error.tariffType ? "hasError" : ""}`}
        >
          <div className="createCheckBoxInput">
            <Icon className="checkIcon" />

            <p className="createCheckBoxText">
              {label}
              {error[value] && <span className="error">{error[value]}</span>}
            </p>
          </div>

          <input
            className="formInput"
            type="radio"
            name="tariffType"
            value={value}
            checked={formData.tariffType === value}
            onChange={() => setFormData({ ...formData, tariffType: value })}
          />
        </label>
      ))}
    </div>
  );
};

export default Step6;
