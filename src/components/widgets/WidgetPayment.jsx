import React from "react";
import "./Widget.scss";
import { Icons } from "../../data/Assets";

let update = "Paid";

const Widget = ({ type }) => {
  let data;

  switch (type) {
    case "name":
      data = {
        title: "Welcome",
        response: "John Doe",
        isMoney: false,
        link: "See all users",
        icon: <Icons.AllUsers />,
      };
      break;
    case "account":
      data = {
        title: "Account ID",
        response: "#" + 1234567890,
        isMoney: true,
        link: "See all orders",
        icon: <Icons.Account />,
      };
      break;
    case "paymentStatus":
      data = {
        title: "Payment Status",
        response: (
          <span
            className="pending"
            style={{
              color:
                update === "Paid"
                  ? "yellowgreen"
                  : update === "Pending"
                  ? "orange"
                  : "red",
            }}
          >
            {update}
          </span>
        ),
        isMoney: false,
        link: "See all payments",
        icon: <Icons.Payment />,
      };
      break;
    case "currentBalance":
      data = {
        title: "Current Balance",
        response: "₦ " + 50000,
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
