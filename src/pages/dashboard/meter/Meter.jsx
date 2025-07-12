import React from "react";
import "./Meter.scss";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import NavBadge from "../../../components/navBadge/NavBadge";
import Navbar from "../../../components/navbar/NavbarMeter";
import Widget from "../../../components/widgets/WidgetMeter";
import { Public } from "../../../data/Assets";
import NigeriaMap from "../../../components/map/Map";

const Meter = () => {
  const { id } = useParams(); // Get the ID from the URL

  return (
    <div className="meterPage">
      <div className="meterTitle">
        <div className="meterLogo">
          <img className="meterLogoImage" src={Public.Logo} alt="logo" />

          <div className="meterLogoName">
            <h4 className="meterLogoText">Voltara</h4>

            <p className="meterLogoSubText">Energy Solutions</p>
          </div>
        </div>
      </div>

      <div className="meterContent">
        <Sidebar />

        <div className="meterContainer">
          <NavBadge />
          <Navbar />

          <div className="meterWidgets">
            <Widget type="status" />
            <Widget type="active" />
            <Widget type="inactive" />
            <Widget type="pending" />
          </div>

          <div
            style={{
              height: "444px",
              width: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <NigeriaMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meter;
