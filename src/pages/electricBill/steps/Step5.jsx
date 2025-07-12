import React from "react";
import InvoiceSummary from "./InvoiceSummary";

const Step5 = ({
  showInvoice,
  setShowInvoice,
  formData,
  token,
  overallTotal,
  commission,
  taxes,
  interest,
  discount,
  purchaseAmount,
  outstandingAmount,
  resetForm,
  customerName,
}) => {
  return showInvoice ? (
    <InvoiceSummary
      formData={formData}
      total={overallTotal}
      token={token}
      purchaseAmount={purchaseAmount}
      outstandingAmount={outstandingAmount}
      commission={commission}
      taxes={taxes}
      interest={interest}
      discount={discount}
      customerName={customerName}
      onRestart={resetForm}
    />
  ) : (
    <div className="stepTransition casing">
      <div className="successAnimation">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path className="checkmark__check" fill="none" d="M14 27l7 7 17-17" />
        </svg>
      </div>
      <h2>Payment Successful!</h2>
      <p>Token: {token}</p>
      <p className="customerName">Thank you, {customerName}</p>
      <div className="progressBtns">
        <button onClick={() => setShowInvoice(true)}>
          View Invoice Summary
        </button>
      </div>
    </div>
  );
};

export default Step5;
