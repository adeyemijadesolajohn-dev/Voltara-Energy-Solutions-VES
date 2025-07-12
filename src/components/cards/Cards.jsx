import React from "react";
import "./Cards.scss";
import { Icons } from "../../data/Assets";
import { CustomerSummary } from "../../data/CustomerSummary";

const Cards = () => {
  return (
    <div className="gridCard">
      <div className="cardTitle">
        <div className="cardTitleContainer">
          <Icons.Summary className="titleIcon" />
          <h3 className="cardTitleText">Customer Summary</h3>
        </div>

        <div className="buttonContainer">
          <button className="buttonItem">
            <Icons.Edit className="buttonIcon" />
          </button>
          <button className="buttonItem">
            <Icons.Option className="buttonIcon" />
          </button>
        </div>
      </div>

      <div className="cardContent">
        {CustomerSummary.map((summary) => (
          <div className="cardItems" key={summary.id}>
            <div className="cardItemLeft">
              <summary.icon className="cardIcon" />
              <p className="cardText">{summary.title}:</p>
            </div>
            <div className="cardItemRight">
              <p className="cardNumber">{summary.data}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
