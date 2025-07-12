import React from "react";
import "./Report.scss";
import { Icons } from "../../data/Assets";
import AreaBarChart from "../charts/areaBarChart/AreaBarChart";

const Report = () => {
  return (
    <div className="gridReport">
      <div className="reportTitle">
        <div className="reportTitleContainer">
          <Icons.WeeklyOverview className="titleIcon" />
          <h3 className="reportTitleText">Weekly Overview</h3>
        </div>

        <div className="reportRightContainer">
          <div className="reportDateContainer">
            <p className="reportDate">Apr 20 - Apr 27</p>
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

      <AreaBarChart />
    </div>
  );
};

export default Report;
