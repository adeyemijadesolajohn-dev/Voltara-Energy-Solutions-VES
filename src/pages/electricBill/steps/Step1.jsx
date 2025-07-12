import React, { useEffect, useRef, useState } from "react";
import { nigeria } from "../../../data/States";

const Step1 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  errors,
  setErrors,
}) => {
  const [filteredStates, setFilteredStates] = useState(Object.keys(nigeria));
  const [filteredLGAs, setFilteredLGAs] = useState([]);
  const [stateSearch, setStateSearch] = useState(formData.state || "");
  const [lgaSearch, setLGASearch] = useState(formData.lga || "");
  const [showStates, setShowStates] = useState(false);
  const [showLGAs, setShowLGAs] = useState(false);
  const [highlightedState, setHighlightedState] = useState(0);
  const [highlightedLGA, setHighlightedLGA] = useState(0);

  const stateRef = useRef();
  const lgaRef = useRef();

  const handleInput = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    const search = stateSearch.toLowerCase();
    const matches = Object.keys(nigeria).filter((state) =>
      state.toLowerCase().includes(search)
    );
    setFilteredStates(matches);
    setHighlightedState(0);
  }, [stateSearch]);

  useEffect(() => {
    if (formData.state && formData.state !== "invalid") {
      const search = lgaSearch.toLowerCase();
      const lgas = nigeria[formData.state] || [];
      const matches = lgas.filter((lga) => lga.toLowerCase().includes(search));
      setFilteredLGAs(matches);
      setHighlightedLGA(0);
    } else {
      setFilteredLGAs([]);
    }
  }, [formData.state, lgaSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!stateRef.current?.contains(e.target)) setShowStates(false);
      if (!lgaRef.current?.contains(e.target)) setShowLGAs(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showStates || showLGAs ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showStates, showLGAs]);

  const handleKeyDown = (e, type) => {
    if (type === "state" && showStates) {
      if (e.key === "ArrowDown") {
        setHighlightedState((prev) =>
          Math.min(prev + 1, filteredStates.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedState((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        const selected = filteredStates[highlightedState];
        if (selected) {
          handleInput("state", selected);
          setStateSearch(selected);
          setShowStates(false);
        }
      }
    }

    if (type === "lga" && showLGAs) {
      if (e.key === "ArrowDown") {
        setHighlightedLGA((prev) =>
          Math.min(prev + 1, filteredLGAs.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedLGA((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        const selected = filteredLGAs[highlightedLGA];
        if (selected) {
          handleInput("lga", selected);
          setLGASearch(selected);
          setShowLGAs(false);
        }
      }
    }
  };

  return (
    <div className="stepTransition casing">
      <h2>Bill Order</h2>

      <div
        className={`input-wrapper ${errors.accountNumber ? "has-error" : ""}`}
      >
        <input
          type="number"
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber || ""}
          onChange={(e) => handleInput("accountNumber", e.target.value)}
        />
        {errors.accountNumber && (
          <p className="error">{errors.accountNumber}</p>
        )}
      </div>

      <div
        className={`dropdown ${errors.state ? "has-error" : ""}`}
        ref={stateRef}
      >
        <label>State</label>
        <input
          placeholder="Select State"
          value={stateSearch}
          onChange={(e) => setStateSearch(e.target.value)}
          onClick={() => {
            setShowStates(true);
            handleInput("lga", "");
            setLGASearch("");
          }}
          onKeyDown={(e) => handleKeyDown(e, "state")}
        />
        {formData.state && <span className="tick success">&#10003;</span>}
        {showStates && (
          <div className="dropdown-menu scrollable">
            {filteredStates.map((state, index) => (
              <div
                key={state}
                className={index === highlightedState ? "highlighted" : ""}
                onClick={() => {
                  handleInput("state", state);
                  setStateSearch(state);
                  setShowStates(false);
                }}
              >
                {state}
              </div>
            ))}
          </div>
        )}
        {errors.state && <p className="error">{errors.state}</p>}
      </div>

      <div className={`dropdown ${errors.lga ? "has-error" : ""}`} ref={lgaRef}>
        <label>LGA</label>
        <input
          placeholder="Select LGA"
          value={lgaSearch}
          onChange={(e) => setLGASearch(e.target.value)}
          onClick={() => {
            if (!formData.state || formData.state === "invalid") return;
            setShowLGAs(true);
          }}
          onKeyDown={(e) => handleKeyDown(e, "lga")}
          disabled={!formData.state || formData.state === "invalid"}
        />
        {formData.lga && <span className="tick success">&#10003;</span>}
        {showLGAs && (
          <div className="dropdown-menu scrollable">
            {filteredLGAs.map((lga, index) => (
              <div
                key={lga}
                className={index === highlightedLGA ? "highlighted" : ""}
                onClick={() => {
                  handleInput("lga", lga);
                  setLGASearch(lga);
                  setShowLGAs(false);
                }}
              >
                {lga}
              </div>
            ))}
          </div>
        )}
        {errors.lga && <p className="error">{errors.lga}</p>}
      </div>

      <div className={`input-wrapper ${errors.address ? "has-error" : ""}`}>
        <input
          name="address"
          placeholder="Full Address"
          value={formData.fullAddress || ""}
          onChange={(e) => handleInput("fullAddress", e.target.value)}
        />
        {errors.address && <p className="error">{errors.address}</p>}
      </div>

      <div className={`input-wrapper ${errors.meterType ? "has-error" : ""}`}>
        <select
          name="meterType"
          value={formData.meterType || ""}
          onChange={(e) => handleInput("meterType", e.target.value)}
        >
          <option value="">-- Select Meter Type --</option>
          <option value="Prepaid">Prepaid</option>
          <option value="Postpaid">Postpaid</option>
        </select>
        {errors.meterType && <p className="error">{errors.meterType}</p>}
      </div>

      <div className={`input-wrapper ${errors.provider ? "has-error" : ""}`}>
        <select
          name="provider"
          value={formData.provider || ""}
          onChange={(e) => handleInput("provider", e.target.value)}
        >
          <option value="">-- Select Provider --</option>
          <option value="Ikeja Electric">Ikeja Electric</option>
          <option value="Eko Electric">Eko Electric</option>
          <option value="Abuja Electric">Abuja Electric</option>
        </select>
        {errors.provider && <p className="error">{errors.provider}</p>}
      </div>

      <div className="progressBtns">
        <button onClick={goPrev} className="backBtn">
          Previous
        </button>
        <button onClick={goNext}>Submit Payment Info</button>
      </div>
    </div>
  );
};

export default Step1;
