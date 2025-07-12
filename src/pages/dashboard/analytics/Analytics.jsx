import React from "react";
import "./Analytics.scss";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import NavBadge from "../../../components/navBadge/NavBadge";
import Navbar from "../../../components/navbar/NavbarAnalytics";
import Report from "../../../components/report/Report";
import Daily from "../../../components/daily/Daily";
import Featured from "../../../components/featured/Featured";
import PaymentTrends from "../../../components/paymentTrends/PaymentTrends";
import { Public } from "../../../data/Assets";

const Customer = () => {
  const { id } = useParams(); // Get the ID from the URL

  return (
    <div className="analyticsPage">
      <div className="analyticsTitle">
        <div className="analyticsLogo">
          <img className="analyticsLogoImage" src={Public.Logo} alt="logo" />

          <div className="analyticsLogoName">
            <h4 className="analyticsLogoText">Voltara</h4>

            <p className="analyticsLogoSubText">Energy Solutions</p>
          </div>
        </div>
      </div>

      <div className="analyticsContent">
        <Sidebar />

        <div className="analyticsContainer">
          <NavBadge />
          <Navbar />

          <div className="analyticsTop">
            <Featured />
            <Report />
          </div>

          <div className="analyticsCharts">
            <Daily />
            <PaymentTrends />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
