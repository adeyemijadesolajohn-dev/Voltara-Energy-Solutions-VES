// Step5 -- Service Type
import React from "react";
import { Icons } from "../../../../data/Assets";

const Step5 = ({ formData, setFormData, error }) => {
  const options = [
    { label: "Prepaid", value: "Prepaid", icon: Icons.Prepaid },
    { label: "Postpaid", value: "Postpaid", icon: Icons.Postpaid },
    { label: "Hybrid", value: "Hybrid", icon: Icons.Hybrid },
    { label: "Maximum Demand", value: "MD", icon: Icons.Bulk },
  ];

  return (
    <div className="formStep">
      {options.map(({ label, value, icon: Icon }) => (
        <label
          key={value}
          className={`createCheckBox ${error.serviceType ? "hasError" : ""}`}
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
            name="serviceType"
            value={value}
            checked={formData.serviceType === value}
            onChange={() => setFormData({ ...formData, serviceType: value })}
          />
        </label>
      ))}
    </div>
  );
};

export default Step5;
