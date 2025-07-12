import React from "react";
import "./ProgressBar.scss";

const ProgressBar = ({ type }) => {
  let data;

  switch (type) {
    case "sunday":
      data = {
        date: "Sunday",
        percentage: 90,
        voltage: 300,
      };
      break;
    case "monday":
      data = {
        date: "Monday",
        percentage: 90,
        voltage: 300,
      };
      break;
    case "tuesday":
      data = {
        date: "Tuesday",
        percentage: 20,
        voltage: 350,
      };
      break;
    case "wednesday":
      data = {
        date: "Wednesday",
        percentage: 70,
        voltage: 400,
      };
      break;
    case "thursday":
      data = {
        date: "Thursday",
        percentage: 30,
        voltage: 360,
      };
      break;
    case "friday":
      data = {
        date: "Friday",
        percentage: 60,
        voltage: 360,
      };
      break;
    case "saturday":
      data = {
        date: "Saturday",
        percentage: 50,
        voltage: 200,
      };
      break;
    default:
      break;
  }

  return (
    <div className="progressContainer">
      <div className="progressTitle">
        <h3>{data.date}:</h3>
      </div>
      <div className="progressWrapper">
        <div id="myProgress">
          <div
            id="myBar"
            style={{
              width: `${data.percentage}%`,
            }}
          ></div>
          <span className="progressPercentage">{data.percentage}%</span>
        </div>
      </div>
      <div className="progressVoltage">
        <span>{data.voltage}kWh</span>
      </div>
    </div>
  );
};

export default ProgressBar;
