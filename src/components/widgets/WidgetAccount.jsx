import React from "react";
import "./Widget.scss";
import { Icons } from "../../data/Assets";

const Widget = ({ type }) => {
  let data;

  switch (type) {
    case "serviceType":
      data = {
        title: "Service Type",
        response: "Prepaid",
        isMoney: false,
        link: "See all users",
        icon: <Icons.AllUsers />,
      };
      break;
    case "statusService":
      data = {
        title: "Status Service",
        response: 120 + " kWh",
        isMoney: false,
        link: "See all packages",
        icon: <Icons.Power />,
      };
      break;
    case "tariffClass":
      data = {
        title: "Tariff Class",
        response: "Residential",
        isMoney: false,
        link: "See all users",
        icon: <Icons.AllUsers />,
      };
      break;
    case "currentBalance":
      data = {
        title: "Current Balance",
        response: 50000,
        isMoney: true,
        link: "See details",
        icon: <Icons.Wallet />,
      };
      break;
    default:
      break;
  }

  return (
    <div className="widgetContainer">
      <div className="widgetTop">
        <span className="widgetTitle">{data.title}</span>
      </div>
      <div className="widgetDown">
        <span className="widgetResponse">
          {data.isMoney && "₦ "}
          {data.response}
        </span>
      </div>

      <a href="#" className="widgetBottom">
        <span className="widgetLink">{data.link}</span>
        <div className="widgetIconContainer">{data.icon}</div>
      </a>
    </div>
  );
};

export default Widget;
