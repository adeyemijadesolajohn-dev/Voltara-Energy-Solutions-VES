// Step1 — Contact Details
import React from "react";
import { Icons } from "../../../../data/Assets";

const Step1 = ({ formData, setFormData, error }) => {
  return (
    <div className="formStep">
      <div className={`createInput ${error.name ? "hasError" : ""}`}>
        <Icons.Client className="createIcon" />
        <input
          className="formInput"
          type="text"
          placeholder="Full Name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label className="formLabel">Full Name</label>
      </div>

      <div className={`createInput ${error.email ? "hasError" : ""}`}>
        <Icons.ClientEmail className="createIcon" />
        <input
          className="formInput"
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label className="formLabel">Email</label>
      </div>

      <div className={`createInput ${error.phone ? "hasError" : ""}`}>
        <Icons.PhoneNumber className="createIcon" />
        <input
          className="formInput"
          type="number"
          placeholder="Phone Number"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <label className="formLabel">Phone Number</label>
      </div>

      <div className={`createInput ${error.address ? "hasError" : ""}`}>
        <Icons.Address className="createIcon" />
        <input
          className="formInput"
          type="text"
          placeholder="Full Address"
          value={formData.address || ""}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <label className="formLabel">Full Address</label>
      </div>
    </div>
  );
};

export default Step1;
