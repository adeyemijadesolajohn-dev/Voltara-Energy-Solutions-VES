import React from "react";
import "./Widget.scss";
import { Icons } from "../../data/Assets";

const Widget = ({ type }) => {
  let data;

  switch (type) {
    case "status":
      data = {
        title: (
          <span style={{ color: "white", fontSize: "22px" }}>
            <span style={{ color: "red", fontSize: "22px" }}>●</span>{" "}
            Disconnected
          </span>
        ),
        response: (
          <span style={{ color: "white", fontSize: "22px" }}>
            <span style={{ color: "yellowgreen", fontSize: "22px" }}>●</span>{" "}
            Connected
          </span>
        ),
        isMoney: false,
        link: "See all Meters",
        icon: <Icons.Meter />,
      };
      break;
    case "active":
      data = {
        title: "Active Meters",
        response: (
          <span>
            <span
              style={{
                color: "yellowgreen",
                marginRight: "12px",
                fontSize: "22px",
              }}
            >
              <Icons.Active />
            </span>
            12456
          </span>
        ),
        isMoney: true,
        link: "See all Active Meters",
        icon: <Icons.Meter style={{ color: "yellowgreen" }} />,
      };
      break;
    case "inactive":
      data = {
        title: "Inactive Meters",
        response: (
          <span>
            <span
              style={{
                color: "red",
                marginRight: "12px",
                fontSize: "22px",
              }}
            >
              <Icons.Inactive />
            </span>
            86
          </span>
        ),
        isMoney: true,
        link: "See all Inactive Meters",
        icon: <Icons.Meter style={{ color: "red" }} />,
      };
      break;
    case "pending":
      data = {
        title: "Pending Installations",
        response: (
          <span>
            <span
              style={{
                color: "orange",
                marginRight: "12px",
                fontSize: "22px",
              }}
            >
              <Icons.Pending />
            </span>
            112
          </span>
        ),
        isMoney: true,
        link: "See details",
        icon: <Icons.Meter style={{ color: "orange" }} />,
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
