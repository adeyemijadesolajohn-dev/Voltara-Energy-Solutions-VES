import React from "react";
import "./Daily.scss";
import Chart from "../charts/areaChart/AreaChart";
import { Icons } from "../../data/Assets";

const Daily = () => {
  return (
    <div className="dailyContainer">
      <div className="dailyTitle">
        <div className="dailyTitleContainer">
          <div className="dailyIcon">
            <Icons.Calendar className="bGIcon" />
            <Icons.Chart className="topIcon" />
          </div>

          <h3 className="dailyTitleText">Daily Usage</h3>
        </div>

        <div className="dailyRightContainer">
          <div className="dailyDateContainer">
            <p className="dailyDate">Apr 20 - Apr 27</p>
          </div>

          <div className="buttonContainer">
            <button className="buttonItem">
              <Icons.Edit className="buttonIcon" />
            </button>
            <button className="buttonItem">
              <Icons.Option className="buttonIcon" />
            </button>
          </div>
        </div>
      </div>

      <Chart />
    </div>
  );
};

export default Daily;
