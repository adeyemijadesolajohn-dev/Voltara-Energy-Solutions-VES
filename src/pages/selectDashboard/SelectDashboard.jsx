import React from "react";
import { Link, useParams } from "react-router-dom";
import "./SelectDashboard.scss";
import "../../App.scss";
import { Icons, Public } from "../../data/Assets";
import DevToggle from "../../components/dev/DevToggle";

const dashboardCards = [
  {
    path: "/Dashboard/Customer",
    icon: <Icons.Customer className="imgIcon" />,
    label: "Customer",
  },
  {
    path: "/Dashboard/Account",
    icon: <Icons.Account className="imgIcon" />,
    label: "Account",
  },
  {
    path: "/Dashboard/Payment",
    icon: <Icons.Payment className="imgIcon" />,
    label: "Bill & Payment",
  },
  {
    path: "/Dashboard/Meter",
    icon: <Icons.Meter className="imgIcon" />,
    label: "Meter",
  },
  {
    path: "/Dashboard/Partner",
    icon: <Icons.Partner className="imgIcon" />,
    label: "Partner",
  },
  {
    path: "/Dashboard/Analytics",
    icon: <Icons.Analysis className="imgIcon" />,
    label: "Analytics",
  },
];

const SelectDashboard = () => {
  const { id } = useParams(); // Get the ID from the URL

  return (
    <div className="flex loginPage">
      <div className="flex container">
        <div className="loginBGDiv">
          <img src={Public.BG} alt="Login Background" />
          <div className="loginBGText">
            <h2 className="loginBGHeading">Connecting you to the future</h2>
            <p>Create your Connection</p>
          </div>
        </div>

        <div className="flex formDiv">
          <DevToggle />
          <div className="headerDiv">
            <h3 className="header">Select your Dashboard</h3>
            <p className="subHeader">
              Choose the dashboard that suits your needs
            </p>
          </div>

          <div className="selectDashboardOptions">
            {dashboardCards.map(({ path, icon, label }) => {
              // Construct the dynamic path using the ID from the URL
              const dynamicPath = `${path}/${id}`;
              return (
                <Link to={dynamicPath} key={label}>
                  <div className="selectDashboardCard">
                    {icon}
                    <h3 className="selectDashboardCardHeader">{label}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDashboard;
