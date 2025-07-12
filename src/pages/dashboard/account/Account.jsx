import React from "react";
import "./Account.scss";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import NavBadge from "../../../components/navBadge/NavBadge";
import Navbar from "../../../components/navbar/NavbarAccount";
import Widget from "../../../components/widgets/WidgetAccount";
import ProgressBar from "../../../components/charts/progressBar/ProgressBar";
import { Public, Icons } from "../../../data/Assets";

const Account = () => {
  const { id } = useParams(); // Get the ID from the URL

  return (
    <div className="accountPage">
      <div className="accountTitle">
        <div className="accountLogo">
          <img className="accountLogoImage" src={Public.Logo} alt="logo" />

          <div className="accountLogoName">
            <h4 className="accountLogoText">Voltara</h4>

            <p className="accountLogoSubText">Energy Solutions</p>
          </div>
        </div>
      </div>

      <div className="accountContent">
        <Sidebar />

        <div className="accountContainer">
          <NavBadge />
          <Navbar />

          <div className="accountWidgets">
            <Widget type="serviceType" />
            <Widget type="statusService" />
            <Widget type="tariffClass" />
            <Widget type="currentBalance" />
          </div>

          <div className="accountBars">
            <div className="accountBarsTitle">
              <h3 className="accountBarsText">
                Daily Meter Recharge Expenditure
              </h3>

              <div className="accountBarsButtons">
                <div className="accountDateContainer">
                  <p className="accountDate">Apr 20 - Apr 27</p>
                </div>

                <button className="accountBarsButton">
                  <Icons.Edit className="accountBarsIcon" />
                </button>

                <button className="accountBarsButton">
                  <Icons.Option className="accountBarsIcon" />
                </button>
              </div>
            </div>

            <div className="accountBarsContainer">
              <ProgressBar type="sunday" />
              <ProgressBar type="monday" />
              <ProgressBar type="tuesday" />
              <ProgressBar type="wednesday" />
              <ProgressBar type="thursday" />
              <ProgressBar type="friday" />
              <ProgressBar type="saturday" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
