import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../../../data/Assets";
import BulletChart from "../../../components/charts/bulletChart/BulletChart";

const Step0 = ({ formData, setFormData, goNext, formatCurrency }) => {
  const energyPurchaseDefault = 40000;
  const lateFeesDefault = 10000;

  const totalOutstanding = energyPurchaseDefault + lateFeesDefault; // 50,000
  const totalPayment = 35000;
  const remainingBalance = totalOutstanding - totalPayment; // 15,000

  const [energyPurchase, setEnergyPurchase] = useState("");
  const [lateFees, setLateFees] = useState("");
  const [bracketDelta, setBracketDelta] = useState(totalPayment);
  const [isAllocating, setIsAllocating] = useState(false);

  useEffect(() => {
    const ep = parseFloat(energyPurchase) || 0;
    const lf = parseFloat(lateFees) || 0;
    const sum = ep + lf;
    const remaining = totalPayment - sum;

    setFormData((prev) => ({
      ...prev,
      purchaseAmount: ep,
      outstandingAmount: lf,
    }));

    setBracketDelta(Math.max(remaining, 0));
  }, [energyPurchase, lateFees]);

  const autoAllocate = () => {
    const currentEP = parseFloat(energyPurchase) || 0;
    const currentLF = parseFloat(lateFees) || 0;
    const currentTotal = currentEP + currentLF;
    const remaining = totalPayment - currentTotal;

    if (remaining <= 0) return;

    const energyRatio = energyPurchaseDefault / totalOutstanding;
    const lateFeeRatio = lateFeesDefault / totalOutstanding;

    const epShare = Math.round(remaining * energyRatio);
    const lfShare = remaining - epShare;

    const newEP = currentEP + epShare;
    const newLF = currentLF + lfShare;

    setEnergyPurchase(newEP.toString());
    setLateFees(newLF.toString());
  };

  const handleChange = (setter, value, otherValue) => {
    const num = parseFloat(value) || 0;
    const other = parseFloat(otherValue) || 0;
    if (num + other > totalPayment) return;
    setter(value);
  };

  const percentFilled = Math.min(
    100,
    ((totalPayment - bracketDelta) / totalPayment) * 100
  );

  const handleProceed = () => {
    // Simulate auto allocation before proceeding
    setIsAllocating(true);
    autoAllocate();

    setTimeout(() => {
      setIsAllocating(false);
      goNext();
    }, 2000);
  };

  return (
    <div className="stepTransition">
      <div className="form">
        <div className="bulletChart">
          <BulletChart />
        </div>
        <div className="debitReceipt">
          {/* Total Outstanding */}
          <div className="receiptHeading">
            <div className="totalOutstanding">
              <h4>Total Outstanding</h4>
              <h2>
                {formatCurrency(totalOutstanding)}
                <span className="remnant">
                  | Remaining Balance: {formatCurrency(remainingBalance)}
                </span>
              </h2>
            </div>
          </div>

          {/* Energy Purchase */}
          <div className="receiptTable">
            <div className="receiptTableBody">
              <div className="leftMid">
                <p>Energy Purchase</p>
                <p>{formatCurrency(energyPurchaseDefault)}</p>
              </div>
              <div className="rightAmount">
                <div className="billInput">
                  <Icons.Naira className="paymentIcon" />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={energyPurchase}
                    onChange={(e) =>
                      handleChange(setEnergyPurchase, e.target.value, lateFees)
                    }
                  />
                  <label className="billLabel">Amount</label>
                </div>
              </div>
            </div>

            {/* Late Fees */}
            <div className="receiptTableBody">
              <div className="leftMid">
                <p>Late Fees</p>
                <p>{formatCurrency(lateFeesDefault)}</p>
              </div>
              <div className="rightAmount">
                <div className="billInput">
                  <Icons.Naira className="paymentIcon" />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={lateFees}
                    onChange={(e) =>
                      handleChange(setLateFees, e.target.value, energyPurchase)
                    }
                  />
                  <label className="billLabel">Amount</label>
                </div>
              </div>
            </div>
          </div>

          {/* Tooltip + Auto Allocate */}
          <div className="tooltipWrapper">
            <div className="autoAllocateTooltip">
              Remaining ₦ allocated by current ratio:
              <br />
              <strong>
                {Math.round((energyPurchaseDefault / totalOutstanding) * 100)}%
              </strong>{" "}
              Energy,{" "}
              <strong>
                {Math.round((lateFeesDefault / totalOutstanding) * 100)}%
              </strong>{" "}
              Late Fees
            </div>
            <div className="btn autoAllocate" onClick={autoAllocate}>
              <span>
                <p>Auto Allocate</p>
                <Icons.Allocate className="icon" />
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progressBarWrapper">
            <div className="barTrack">
              <div
                className="barFill"
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>
            <div className="barLabel">
              {formatCurrency(totalPayment - bracketDelta)} of{" "}
              {formatCurrency(totalPayment)} Allocated
            </div>
          </div>

          {/* Total Payment */}
          <div className="receiptHeading">
            <div className="totalOutstanding">
              <h4>Total Payment</h4>
              <h2 className={bracketDelta === 0 ? "green" : "red"}>
                {formatCurrency(totalPayment - bracketDelta)}
                <span className="bracket">
                  ({formatCurrency(bracketDelta)} remaining of{" "}
                  {formatCurrency(totalPayment)})
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="progressBtns">
          <Link to="/Dashboard/Payment" className="cancelBtn progressBtn">
            <span>
              <Icons.Cancel className="paymentIcon" />
              <p>Cancel</p>
            </span>
          </Link>

          <button
            className="progressBtn progressBtn"
            onClick={handleProceed}
            disabled={isAllocating}
          >
            <span>
              <p>{isAllocating ? "Allocating..." : "Proceed to Payment"}</p>
              <Icons.Payment className="paymentIcon" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step0;
