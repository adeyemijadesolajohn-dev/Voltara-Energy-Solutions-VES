import React from "react";
import "./Widget.scss";
import { Icons } from "../../data/Assets";

const Widget = ({ type }) => {
  let data;

  switch (type) {
    case "users":
      data = {
        title: "Users",
        response: 1256,
        isMoney: true,
        link: "See all users",
        icon: <Icons.AllUsers />,
      };
      break;
    case "orders":
      data = {
        title: "Status Service",
        response: 26,
        isMoney: true,
        link: "See all orders",
        icon: <Icons.Power />,
      };
      break;
    case "outstanding":
      data = {
        title: "Outstanding",
        response: <span style={{ color: "red" }}>₦ 50000</span>,
        isMoney: true,
        link: "See all outstanding",
        icon: <Icons.Outstanding />,
      };
      break;
    case "revenue":
      data = {
        title: "Revenue",
        response: "₦ " + 50000000,
        isMoney: true,
        link: "See all transactions",
        icon: <Icons.Revenue />,
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
          {data.isMoney}
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
