import React, { useState } from "react";
import "./CreateAccount.scss";
import { Icons } from "../../../data/Assets";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";

const CreateAccount = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    "Contact Details",
    "Identity Verification",
    "Meter Details",
    "User Type",
    "Service Type",
    "Tariff Type",
  ];

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < steps.length - 1) setStep(step + 1);
    else setIsComplete(true);
  };

  const handlePrev = () => {
    setError("");
    if (step > 0) setStep(step - 1);
  };

  const close = () => {
    onClose();
    setStep(0);
    setIsComplete(false);
    setFormData({});
  };

  const validateStep = () => {
    setError("");
    switch (step) {
      case 0:
        if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name))
          return setError("Valid name is required."), false;
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
          return setError("Valid email is required."), false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          return setError("Invalid email format."), false;
        if (!formData.phone || !/^\d{10,14}$/.test(formData.phone))
          return setError("Valid phone number required."), false;
        if (!/^[0-9]+$/.test(formData.phone))
          return setError("Phone must be numeric."), false;
        if (!formData.address) return setError("Address is required."), false;
        return true;
      case 1:
        if (
          !formData.customerId &&
          !formData.nin &&
          !formData.driversLicense &&
          !formData.passport
        )
          return setError("At least one identity field must be filled."), false;
        if (formData.nin && !/^\d{11}$/.test(formData.nin))
          return setError("NIN must be 11 digits."), false;
        if (formData.customerId && !/^\d{6,12}$/.test(formData.customerId))
          return setError("Customer ID must be 6-12 digits."), false;
        if (
          formData.driversLicense &&
          !/^[A-Za-z0-9]{6,16}$/.test(formData.driversLicense)
        )
          return setError("Invalid Driver's License."), false;
        if (formData.passport && !/^[A-Za-z0-9]{6,16}$/.test(formData.passport))
          return setError("Invalid Passport."), false;
        return true;
      case 2:
        if (!formData.meterId || !/^\d{6,12}$/.test(formData.meterId))
          return setError("Valid Meter ID required."), false;
        if (!formData.meterType) return setError("Select a Meter Type."), false;
        if (!formData.state) return setError("Select a State."), false;
        if (!formData.lga) return setError("Select an LGA."), false;
        return true;
      case 3:
        if (!formData.userType) return setError("Select a User Type."), false;
        return true;
      case 4:
        if (!formData.serviceType)
          return setError("Select a Service Type."), false;
        return true;
      case 5:
        if (!formData.tariffType)
          return setError("Select a Tariff Type."), false;
        return true;
      default:
        return true;
    }
  };

  const renderStep = () => {
    const props = { formData, setFormData, error };
    switch (step) {
      case 0:
        return <Step1 {...props} />;
      case 1:
        return <Step2 {...props} />;
      case 2:
        return <Step3 {...props} />;
      case 3:
        return <Step4 {...props} />;
      case 4:
        return <Step5 {...props} />;
      case 5:
        return <Step6 {...props} />;
      default:
        return null;
    }
  };

  return isOpen ? (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="formHeadingDiv">
          <h1 className="formHeading">Create Account</h1>
          <div className="closeIcon" onClick={close}>
            <Icons.Close className="iconCA" />
          </div>
        </div>

        <div className="progressForm">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`progressSteps ${
                step >= i ? "progressStepActive" : ""
              }`}
              data-title={steps[i]}
            ></div>
          ))}
          <div
            className="progress"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {!isComplete ? (
          <form className="formBody">
            {renderStep()}
            <div className="progressBtns">
              <button
                className="progressBtn"
                type="button"
                onClick={handlePrev}
                disabled={step === 0}
                style={{ visibility: step === 0 ? "hidden" : "visible" }}
              >
                <Icons.Previous className="btnIcon" />
                Prev
              </button>

              {error && <p className="formError">{error}</p>}

              <button
                className="progressBtn"
                type="button"
                onClick={handleNext}
                style={{
                  color: step === steps.length - 1 ? "yellowgreen" : "",
                }}
              >
                {step === steps.length - 1 ? (
                  <Icons.Checkmark className="btnIcon" />
                ) : (
                  <Icons.Next className="btnIcon" />
                )}
                {step === steps.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </form>
        ) : (
          <div className="formStep successStep">
            <div className="checkMark">
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
                <path
                  className="checkmark__check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
              <p>Congratulations! Account created.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default CreateAccount;
