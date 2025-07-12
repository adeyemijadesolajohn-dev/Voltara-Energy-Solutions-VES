import React from "react";
import "./Payment.scss";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import NavBadge from "../../../components/navBadge/NavBadge";
import Navbar from "../../../components/navbar/NavbarPayment";
import Widget from "../../../components/widgets/WidgetPayment";
import Table from "../../../components/tables/PaymentTable";
import { Public, Icons } from "../../../data/Assets";

const Payment = () => {
  const { id } = useParams(); // Get the ID from the URL

  return (
    <div className="paymentPage">
      <div className="paymentTitle">
        <div className="paymentLogo">
          <img className="paymentLogoImage" src={Public.Logo} alt="logo" />

          <div className="paymentLogoName">
            <h4 className="paymentLogoText">Voltara</h4>

            <p className="paymentLogoSubText">Energy Solutions</p>
          </div>
        </div>
      </div>

      <div className="paymentContent">
        <Sidebar />

        <div className="paymentContainer">
          <NavBadge />
          <Navbar />

          <div className="paymentWidgets">
            <Widget type="name" />
            <Widget type="account" />
            <Widget type="paymentStatus" />
            <Widget type="currentBalance" />
          </div>

          <div className="paymentTable">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
