import React, { useState, useEffect } from "react";
import "./ElectricBill.scss";
import { Icons, Public } from "../../data/Assets";
import Step0 from "./steps/DebitSummary";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import CongratsModal from "../../components/modals/congrats/CongratsModal";

const ElectricBill = () => {
  const stepLabels = [
    "Bill Order",
    "Review Order",
    "Payment",
    "Complete Order",
  ];

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    accountNumber: "",
    meterNumber: "",
    state: "",
    lga: "",
    fullAddress: "",
    provider: "",
    amount: "",
    meterType: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    pin: "",
    discount: 0,
    purchaseAmount: 0,
    outstandingAmount: 0,
    rememberCard: false,
    predictedCard: false,
  });
  const [errors, setErrors] = useState({});
  const [total, setTotal] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const token = "34587905721861864583";
  const customer = {
    name: "John Doe",
    phone: "08012345678",
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value || 0);

  const resetForm = () => {
    setStep(0);
    setFormData({
      accountNumber: "",
      meterNumber: "",
      state: "",
      lga: "",
      fullAddress: "",
      provider: "",
      amount: "",
      meterType: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      pin: "",
      discount: 0,
      purchaseAmount: 0,
      outstandingAmount: 0,
      rememberCard: false,
      predictedCard: false,
    });
    setShowInvoice(false);
    setShowCongrats(false);
    setErrors({});
  };

  const goNext = () => {
    const isValid = validateStep(step);
    if (isValid) setStep((prev) => prev + 1);
  };

  const goPrev = () => setStep((prev) => Math.max(prev - 1, 0));

  const validateStep = (currentStep) => {
    const stepErrors = {};

    if (currentStep === 1) {
      if (!formData.accountNumber)
        stepErrors.accountNumber = "Account number is required.";
      if (!formData.meterNumber)
        stepErrors.meterNumber = "Meter number is required.";
      if (!formData.state) stepErrors.state = "State is required.";
      if (!formData.lga) stepErrors.lga = "LGA is required.";
      if (!formData.fullAddress)
        stepErrors.address = "Full address is required.";
      if (!formData.provider) stepErrors.provider = "Provider is required.";
      if (!formData.meterType) stepErrors.meterType = "Meter type is required.";
    }

    if (currentStep === 3) {
      if (!formData.cardNumber)
        stepErrors.cardNumber = "Card number is required.";
      if (!formData.expiry) stepErrors.expiry = "Expiry is required.";
      if (!formData.cvc) stepErrors.cvc = "CVC is required.";
    }

    if (currentStep === 4) {
      if (!formData.pin || formData.pin.length !== 10)
        stepErrors.pin = "PIN must be 10 digits.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  useEffect(() => {
    const purchase = parseFloat(formData.purchaseAmount || 0);
    const outstanding = parseFloat(formData.outstandingAmount || 0);
    const commission = 0.1 * purchase;
    const tax = 0.1 * (purchase + outstanding + commission);
    const interest = 0.02 * outstanding;
    const discount =
      0.2 * (purchase + outstanding + commission + tax + interest);
    const totalValue =
      purchase + outstanding + commission + tax + interest - discount;

    setTotal(totalValue);
  }, [formData.purchaseAmount, formData.outstandingAmount, formData.discount]);

  const renderStepContent = () => {
    const props = {
      formData,
      setFormData,
      goNext,
      goPrev,
      formatCurrency,
      errors,
      setErrors,
      customer,
      total,
      setTotal,
      token,
      resetForm,
      setShowCongrats,
    };

    if (step === 0) return <Step0 {...props} />;
    if (step === 1) return <Step1 {...props} />;
    if (step === 2) return <Step2 {...props} />;
    if (step === 3) return <Step3 {...props} />;
    if (step === 4) return <Step4 {...props} />;
    if (step === 5) return <Step5 {...props} />;
    return null;
  };

  return (
    <div className="electricBill">
      <div className="billBG">
        <img className="bgImage" src={Public.BG} alt="Login Background" />
        <div className="leftHeading">
          <h2 className="billHeading">
            {step === 0
              ? "Debit Summary"
              : step === 5
              ? "Invoice Summary"
              : "Electric Bill"}
          </h2>
          <div className="stepContent">
            {stepLabels.map((label, i) => (
              <p
                key={i}
                className={`stepNumberContent ${
                  step === i + 1 ? "active" : "dNone"
                }`}
              >
                Step {i + 1}
              </p>
            ))}
          </div>
          <ul
            className={`progressBar ${step === 0 ? "dimmed" : ""} ${
              step === 5 ? "glow" : ""
            }`}
          >
            {stepLabels.map((label, i) => (
              <li
                key={i}
                className={
                  step > i ? "active" : step === i + 1 ? "current" : ""
                }
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="billForm">
        <div className="billHeader">
          <div className="logoHeader">
            <div className="logoText">
              <h4 className="clientName">{customer.name}</h4>
              <p className="meterNumber">
                Meter: #<span>{formData.meterNumber || "00000000000000"}</span>
              </p>
              <p className="meterNumber">
                Balance: <span>{formatCurrency(100000)}</span>
              </p>
            </div>
          </div>
          <div className="logoside">
            <div className="voltara">
              <h4 className="voltaraName">Voltara</h4>
              <p className="voltaraSubText">Energy Solutions</p>
            </div>
            <div className="voltaraLogo">
              <img className="voltaraLogoImage" src={Public.Logo} alt="logo" />
            </div>
          </div>
        </div>

        {renderStepContent()}
      </div>

      {showCongrats && (
        <CongratsModal
          onClose={() => setShowCongrats(false)}
          onContinue={() => {
            setShowCongrats(false);
            setStep(5); // Show Invoice Summary
          }}
        />
      )}
    </div>
  );
};

export default ElectricBill;
