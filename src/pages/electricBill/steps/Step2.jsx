import React from "react";

const Step2 = ({ formData, energyPurchase, lateFees, goPrev, goNext }) => {
  const fullLocation = `${formData.state || ""}, ${formData.lga || ""}`;
  const commission = energyPurchase * 0.1;
  const interest = lateFees * 0.02;
  const taxes = 0.1 * (energyPurchase + commission + lateFees);
  const subtotal = energyPurchase + commission + lateFees + interest + taxes;
  const discount = subtotal * 0.2;
  const overallTotal = subtotal - discount;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value || 0);

  return (
    <div className="stepTransition casing">
      <h2>Review Your Order</h2>
      <table>
        <tbody>
          <tr>
            <td>Customer Name</td>
            <td>John Doe</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>+234 812 345 6789</td>
          </tr>
          <tr>
            <td>Account Number</td>
            <td>{formData.accountNumber}</td>
          </tr>
          <tr>
            <td>Meter Number</td>
            <td>{formData.meterNumber}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>{fullLocation}</td>
          </tr>
          <tr>
            <td>Full Address</td>
            <td>{formData.fullAddress}</td>
          </tr>
          <tr>
            <td>Meter Type</td>
            <td>{formData.meterType}</td>
          </tr>
          <tr>
            <td>Service Provider</td>
            <td>{formData.provider}</td>
          </tr>
          <tr>
            <td>Energy Purchase</td>
            <td>{formatCurrency(energyPurchase)}</td>
          </tr>
          <tr>
            <td>Outstanding Amount</td>
            <td>{formatCurrency(lateFees)}</td>
          </tr>
          <tr>
            <td>Commission (10%)</td>
            <td>{formatCurrency(commission)}</td>
          </tr>
          <tr>
            <td>Taxes (10%)</td>
            <td>{formatCurrency(taxes)}</td>
          </tr>
          <tr>
            <td>Interest (2%)</td>
            <td>{formatCurrency(interest)}</td>
          </tr>
          <tr>
            <td>Discount (20%)</td>
            <td>-{formatCurrency(discount)}</td>
          </tr>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>{formatCurrency(overallTotal)}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="progressBtns">
        <button onClick={goPrev}>Back</button>
        <button onClick={goNext}>Continue to Payment</button>
      </div>
    </div>
  );
};

export default Step2;
