// Step4 -- User Type
import React from "react";
import { Icons } from "../../../../data/Assets";

const Step4 = ({ formData, setFormData, error }) => {
  const options = [
    { label: "Tenant", value: "tenant", icon: Icons.Tenant },
    { label: "Landlord", value: "landlord", icon: Icons.Landlord },
    { label: "Realtor", value: "realtor", icon: Icons.Realtor },
    { label: "Government", value: "government", icon: Icons.Government },
  ];

  return (
    <div className="formStep">
      {options.map(({ label, value, icon: Icon }) => (
        <label
          key={value}
          className={`createCheckBox ${error.userType ? "hasError" : ""}`}
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
            name="userType"
            value={value}
            checked={formData.userType === value}
            onChange={() => setFormData({ ...formData, userType: value })}
          />
        </label>
      ))}
    </div>
  );
};

export default Step4;
