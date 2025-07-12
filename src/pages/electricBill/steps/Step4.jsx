import React, { useState } from "react";

const Step4 = ({ formData, onChange, goPrev, goNext }) => {
  const [showPin, setShowPin] = useState(false);
  const [tempPin, setTempPin] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setTempPin(value);
    onChange({ target: { name: "pin", value } });

    if (!showPin) {
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => setTempPin("*".repeat(value.length)), 500);
      setTimeoutId(id);
    }
  };

  const togglePinVisibility = () => {
    setShowPin((prev) => !prev);
    if (!showPin) {
      setTempPin(formData.pin);
    } else {
      setTempPin("*".repeat(formData.pin.length));
    }
  };

  return (
    <div className="stepTransition casing">
      <h2>Enter PIN</h2>
      <div className="input-wrapper">
        <div className="pin-input">
          <input
            type="text"
            name="pin"
            placeholder="Enter 10-digit PIN"
            value={showPin ? formData.pin : tempPin}
            onChange={handlePinChange}
            inputMode="numeric"
            maxLength={10}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={togglePinVisibility}
            className="togglePinBtn"
          >
            {showPin ? "Hide" : "Show"}
          </button>
        </div>
        <p className="note">PIN must be exactly 10 digits</p>
      </div>

      <div className="progressBtns">
        <button onClick={goPrev}>Back</button>
        <button onClick={goNext} disabled={formData.pin.length !== 10}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step4;
