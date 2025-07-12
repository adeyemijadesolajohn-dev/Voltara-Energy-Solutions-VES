import React from "react";
import "./PaymentTrends.scss";
import { Icons } from "../../data/Assets";
import LineChartAnalytics from "../charts/lineChart/LineChart";

const PaymentTrends = () => {
  return (
    <div className="trendContainer">
      <div className="trendTitle">
        <div className="trendTitleContainer">
          <div className="trendIcon">
            <Icons.Calendar className="bGIcon" />
            <Icons.LineChart className="topIcon" />
          </div>

          <h3 className="trendTitleText">Payment Trends</h3>
        </div>

        <div className="trendRightContainer">
          <div className="trendDateContainer">
            <p className="trendDate">Apr 20 - Apr 27</p>
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

      <LineChartAnalytics />
    </div>
  );
};

export default PaymentTrends;
