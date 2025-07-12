// Step2 — Identity Verification
import React from "react";
import { Icons } from "../../../../data/Assets";

const Step2 = ({ formData, setFormData, error }) => {
  const fields = [
    { key: "customerId", label: "Customer ID", icon: Icons.ID },
    { key: "nin", label: "NIN", icon: Icons.Badge },
    {
      key: "driversLicense",
      label: "Driver's License",
      icon: Icons.DriversLicense,
    },
    { key: "passport", label: "Passport", icon: Icons.Passport },
  ];

  return (
    <div className="formStep">
      {fields.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className={`createInput ${error[key] ? "hasError" : ""}`}
        >
          <Icon className="createIcon" />
          <input
            className="formInput"
            type="number"
            placeholder={label}
            value={formData[key] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
          />
          <label className="formLabel">
            {label}
            {error[key] && <span className="error">{error[key]}</span>}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Step2;
