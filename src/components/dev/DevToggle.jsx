import React, { useState, useEffect } from "react";
import config from "../../config";

const DevToggle = () => {
  const [devMode, setDevMode] = useState(config.DEV_MODE);

  useEffect(() => {
    localStorage.setItem("devMode", devMode ? "true" : "false");
  }, [devMode]);

  return (
    <div className="devToggle">
      <label style={{ display: "flex" }}>
        <input
          type="checkbox"
          checked={devMode}
          onChange={() => setDevMode(!devMode)}
        />
        <p>DEV Mode</p>
      </label>
    </div>
  );
};

export default DevToggle;
