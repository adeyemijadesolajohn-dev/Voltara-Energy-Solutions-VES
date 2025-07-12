import React from "react";
import "./Partner.scss";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import NavBadge from "../../../components/navBadge/NavBadge";
import Navbar from "../../../components/navbar/NavbarPartner";
import Widget from "../../../components/widgets/WidgetPartner";
import Table from "../../../components/tables/Partner";
import { Public, Icons } from "../../../data/Assets";

const Partner = () => {
  const { id } = useParams(); // Get the ID from the URL

  return (
    <div className="partnerPage">
      <div className="partnerTitle">
        <div className="partnerLogo">
          <img className="partnerLogoImage" src={Public.Logo} alt="logo" />

          <div className="partnerLogoName">
            <h4 className="partnerLogoText">Voltara</h4>

            <p className="partnerLogoSubText">Energy Solutions</p>
          </div>
        </div>
      </div>

      <div className="partnerContent">
        <Sidebar />

        <div className="partnerContainer">
          <NavBadge />
          <Navbar />

          <div className="partnerWidgets">
            <Widget type="users" />
            <Widget type="orders" />
            <Widget type="outstanding" />
            <Widget type="revenue" />
          </div>

          <div className="partnerTable">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
