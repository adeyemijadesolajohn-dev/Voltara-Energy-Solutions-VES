import React from "react";
import "./Featured.scss";
import { Icons } from "../../data/Assets";
import DonutChart from "../charts/donutChart/DonutChart";

const Featured = () => {
  return (
    <div className="featuredContainer">
      <div className="featuredTitle">
        <div className="featuredTitleContainer">
          <div className="featuredIcon">
            <Icons.DonutChart className="bGIcon" />
            <Icons.Voltage className="topIcon" />
          </div>

          <h3 className="featuredTitleText">Weekly Overview</h3>
        </div>

        <div className="featuredRightContainer">
          <div className="featuredDateContainer">
            <p className="featuredDate">Apr 20 - Apr 27</p>
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

      <div className="featuredContent">
        <div className="featuredChart">
          <div className="percent">
            <section className="contentAreaCards">
              <DonutChart
                colors={["#bdbdbd", "#003b6d"]}
                percentFillValue={80}
                cardInfo={{
                  title: "Power Usage",
                  value: "80%",
                  text: "Last 24 hours",
                  icon: Icons.PowerUsage,
                }}
              />
            </section>

            <div className="number">
              <h3 className="numberValue">
                80<span className="numberPercent">%</span>
              </h3>
            </div>
          </div>
        </div>

        <ul className="dataList">
          <li className="dataItem textSilverV1">
            <span className="dataItemText">Average</span>
            <span className="dataItemValue">50kWh</span>
          </li>

          <li className="dataItem textSilverV1">
            <span className="dataItemText">Today</span>
            <span className="dataItemValue">25kWh</span>
          </li>

          <li className="dataItem textSilverV1">
            <span className="dataItemText">Target</span>
            <span className="dataItemValue">22kWh</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Featured;
