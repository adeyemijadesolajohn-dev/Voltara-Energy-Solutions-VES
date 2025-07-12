import React from "react";
import { useParams } from "react-router-dom";
import "./Customer.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import NavBadge from "../../../components/navBadge/NavBadge";
import Navbar from "../../../components/navbar/NavbarCustomer";
import Cards from "../../../components/cards/Cards";
import Report from "../../../components/report/Report";
import Daily from "../../../components/daily/Daily";
import Featured from "../../../components/featured/Featured";
import Table from "../../../components/tables/HistoryTable";
import { Public } from "../../../data/Assets";

const Customer = () => {
  const { id } = useParams(); // Get the ID from the URL

  return (
    <div className="customerPage">
      <div className="customerTitle">
        <div className="customerLogo">
          <img className="customerLogoImage" src={Public.Logo} alt="logo" />
          <div className="customerLogoName">
            <h4 className="customerLogoText">Voltara</h4>
            <p className="customerLogoSubText">Energy Solutions</p>
          </div>
        </div>
      </div>

      <div className="customerContent">
        <Sidebar />
        <div className="customerContainer">
          <NavBadge />
          <Navbar />
          <div className="customerTop">
            <Cards />
            <Report />
          </div>

          <div className="customerCharts">
            <Daily />
            <Featured />
          </div>

          <div className="customerTable">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
