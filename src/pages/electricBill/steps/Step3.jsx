import React, { useState, useEffect } from "react";

const Step3 = ({ formData, onChange, goPrev, goNext, overallTotal }) => {
  const [rememberCard, setRememberCard] = useState(false);
  const [showPrediction, setShowPrediction] = useState({
    cardNumber: false,
    expiry: false,
    cvc: false,
  });

  useEffect(() => {
    if (rememberCard) {
      localStorage.setItem(
        "rememberedCard",
        JSON.stringify({
          cardNumber: formData.cardNumber,
          expiry: formData.expiry,
          cvc: formData.cvc,
        })
      );
    } else {
      localStorage.removeItem("rememberedCard");
    }
  }, [rememberCard, formData]);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedCard");
    if (remembered) {
      const { cardNumber, expiry, cvc } = JSON.parse(remembered);
      onChange({ target: { name: "cardNumber", value: cardNumber } });
      onChange({ target: { name: "expiry", value: expiry } });
      onChange({ target: { name: "cvc", value: cvc } });
      setRememberCard(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    if (value.length > 0) {
      setShowPrediction((prev) => ({ ...prev, [name]: true }));
    } else {
      setShowPrediction((prev) => ({ ...prev, [name]: false }));
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value || 0);

  return (
    <div className="stepTransition casing">
      <h2>Select Card</h2>

      <div className="input-wrapper">
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={handleInputChange}
        />
        {showPrediction.cardNumber && (
          <div className="predictBox">
            <label>
              <input type="checkbox" /> Predict based on typing
            </label>
          </div>
        )}
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={formData.expiry}
          onChange={handleInputChange}
        />
        {showPrediction.expiry && (
          <div className="predictBox">
            <label>
              <input type="checkbox" /> Predict based on typing
            </label>
          </div>
        )}
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          name="cvc"
          placeholder="CVC"
          value={formData.cvc}
          onChange={handleInputChange}
        />
        {showPrediction.cvc && (
          <div className="predictBox">
            <label>
              <input type="checkbox" /> Predict based on typing
            </label>
          </div>
        )}
      </div>

      <div className="rememberBox">
        <label>
          <input
            type="checkbox"
            checked={rememberCard}
            onChange={() => setRememberCard(!rememberCard)}
          />
          Use card for future transactions
        </label>
      </div>

      <div className="progressBtns">
        <button onClick={goPrev}>Back</button>
        <button onClick={goNext}>Pay {formatCurrency(overallTotal)}</button>
      </div>
    </div>
  );
};

export default Step3;
