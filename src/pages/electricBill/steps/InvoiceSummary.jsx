import React from "react";

const InvoiceSummary = ({
  formData,
  total,
  token,
  purchaseAmount,
  outstandingAmount,
  commission,
  taxes,
  interest,
  discount,
  customerName,
  onRestart,
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value || 0);

  return (
    <div className="invoiceSummary">
      <div className="invoiceHeader">
        <h2>Invoice Summary</h2>
        <p>
          Token: <strong>{token}</strong>
        </p>
      </div>

      <div className="invoiceDetails">
        <p>
          <strong>Customer:</strong> {customerName}
        </p>
        <p>
          <strong>Phone:</strong> 08012345678
        </p>
        <p>
          <strong>Meter Number:</strong> {formData.meterNumber}
        </p>
        <p>
          <strong>Location:</strong> {formData.state}, {formData.lga}
        </p>
        <p>
          <strong>Full Address:</strong> {formData.address}
        </p>
        <p>
          <strong>Meter Type:</strong> {formData.meterType}
        </p>
      </div>

      <div className="invoiceBreakdown">
        <p>
          <strong>Purchase Amount:</strong> {formatCurrency(purchaseAmount)}
        </p>
        <p>
          <strong>Outstanding:</strong> {formatCurrency(outstandingAmount)}
        </p>
        <p>
          <strong>Commission (10%):</strong> {formatCurrency(commission)}
        </p>
        <p>
          <strong>Taxes (10%):</strong> {formatCurrency(taxes)}
        </p>
        <p>
          <strong>Interest (2%):</strong> {formatCurrency(interest)}
        </p>
        <p>
          <strong>Discount (20%):</strong> -{formatCurrency(discount)}
        </p>
      </div>

      <div className="invoiceTotal">
        <h3>Total Paid: {formatCurrency(total)}</h3>
      </div>

      <div className="invoiceActions">
        <button onClick={onRestart}>Start New Payment</button>
      </div>
    </div>
  );
};

export default InvoiceSummary;
