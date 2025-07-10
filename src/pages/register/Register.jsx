import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import "../../App.scss";
import { Icons, Public } from "../../data/Assets";

const Register = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" }); // { type: 'success' | 'error', text: 'message' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password guide state
  const [passwordGuide, setPasswordGuide] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const navigate = useNavigate();

  const togglePasswordType = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear specific error and API messages when input changes
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiMessage({ type: "", text: "" });

    // Update password guide on password input change
    if (name === "password") {
      setPasswordGuide({
        minLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value), // Common symbols
      });
    }
  };

  /**
   * Client-side validation rules
   */
  const validate = () => {
    const newErrors = {};

    // Validate first name and last name
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password complexity validation
    let passwordErrors = [];
    if (formData.password.length < 8) {
      passwordErrors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(formData.password)) {
      passwordErrors.push("An uppercase letter (A-Z)");
    }
    if (!/[a-z]/.test(formData.password)) {
      passwordErrors.push("A lowercase letter (a-z)");
    }
    if (!/[0-9]/.test(formData.password)) {
      passwordErrors.push("A number (0-9)");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(formData.password)) {
      passwordErrors.push("A symbol (!@#$...)");
    }
    if (passwordErrors.length > 0) {
      newErrors.password =
        "Password must include: " + passwordErrors.join(", ");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and privacy policy.";
    }

    return newErrors;
  };

  // Helper to determine if an input should have a green border
  const isValidInput = (id) => {
    // Check if there's no error for the specific ID and the field is not empty
    const hasValue = formData[id] && formData[id].toString().trim() !== "";

    // Special handling for password: it's valid only if all guide requirements are met and no other errors
    if (id === "password") {
      const allPasswordRequirementsMet =
        Object.values(passwordGuide).every(Boolean);
      return hasValue && allPasswordRequirementsMet && !errors.password;
    }
    // Special handling for confirmPassword: it's valid if matches password and not empty
    if (id === "confirmPassword") {
      return (
        hasValue &&
        formData.password === formData.confirmPassword &&
        !errors.confirmPassword
      );
    }
    // For other fields
    return hasValue && !errors[id];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setApiMessage({ type: "", text: "" }); // Clear previous API message

    if (Object.keys(validationErrors).length > 0) {
      setApiMessage({
        type: "error",
        text: "Please fix the validation errors.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://45.55.133.211:5144/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
          created_at: new Date().toISOString(), // Generate current ISO 8601 timestamp
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorText =
          data.message || "Registration failed. Please try again.";

        // Check for specific "email already in use" message
        if (
          data.message &&
          data.message.toLowerCase().includes("email already in use")
        ) {
          errorText =
            "This email is already registered. Please try logging in or use a different email.";
        } else if (
          data.errors &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          // Attempt to get more specific error from an errors array if available
          const specificError = data.errors.find(
            (err) => err.field === "email" && err.code === "duplicate_email"
          ); // Example
          if (specificError) {
            errorText = specificError.description;
          } else {
            errorText =
              data.errors
                .map((err) => err.description || err.message)
                .join(", ") || errorText;
          }
        }
        setApiMessage({ type: "error", text: errorText });
        return; // Stop execution if API call failed
      }

      // Success
      setApiMessage({
        type: "success",
        text:
          data.message ||
          "Registration successful! Redirecting to dashboard...",
      });

      // NEW: Store user ID upon successful registration
      if (data.id) {
        // Assuming your API returns the new user's ID on success
        localStorage.setItem("userId", data.id);
      }
      // END NEW

      // Redirect after a short delay to allow success message to be seen
      setTimeout(() => {
        navigate("/SelectDashboard");
      }, 3500); // Redirect after 3.5 seconds
    } catch (err) {
      console.error("Registration API error:", err);
      setApiMessage({
        type: "error",
        text: "Network error or server unavailable. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Condition to render the password guide container
  const shouldRenderPasswordGuideContainer =
    formData.password && !Object.values(passwordGuide).every(Boolean);

  return (
    <div className="flex registerPage">
      <div className="flex container">
        {/* Background Section */}
        <div className="loginBGDiv">
          <img src={Public.BG} alt="Login Background" />

          <div className="loginBGText">
            <h2 className="loginBGHeading">Connecting you to the future</h2>

            <p>Create your Connection</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex formDiv">
          <div className="headerDiv">
            <Link to="/" className="logo">
              <img src={Public.Logo} alt="Voltara logo" />

              <h4>Voltara</h4>

              <p>Energy Solutions</p>
            </Link>

            <h3>Join Us</h3>
          </div>

          <form className="grid form" onSubmit={handleSubmit} noValidate>
            <h2>Sign Up</h2>

            {/* API Message Display */}
            {apiMessage.text && (
              <p
                className={`api-message ${
                  apiMessage.type === "success" ? "success-msg" : "error-msg"
                }`}
                style={{
                  textAlign: "center",
                  width: "100%",
                  color: { success: "green", error: "red" }[apiMessage.type],
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                {apiMessage.text}
              </p>
            )}

            {/* Dynamic Inputs (FirstName, LastName, Email, Password, ConfirmPassword) */}
            {[
              {
                icon: <Icons.CompanyUser className="icon" />,
                id: "firstName",
                type: "text",
                placeholder: "John",
                label: "First Name",
                maxLength: 50,
              },
              {
                icon: <Icons.CompanyUser className="icon" />,
                id: "lastName",
                type: "text",
                placeholder: "Doe",
                label: "Last Name",
                maxLength: 50,
              },
              {
                icon: <Icons.CompanyEmail className="icon" />,
                id: "email",
                type: "email",
                placeholder: "abc123@email.com",
                label: "Email",
                maxLength: 100,
              },
              {
                icon: <Icons.Password className="icon" />,
                id: "password",
                type: showPassword.password ? "text" : "password",
                placeholder: "************",
                label: "Password",
                toggle: true,
                maxLength: 50,
              },
              {
                icon: <Icons.ConfirmPassword className="icon" />,
                id: "confirmPassword",
                type: showPassword.confirmPassword ? "text" : "password",
                placeholder: "************",
                label: "Confirm Password",
                toggle: true,
                maxLength: 50,
              },
            ].map(
              ({ icon, id, type, placeholder, label, toggle, maxLength }) => (
                <div className="inputDiv" key={id}>
                  <div
                    className={`flex input ${
                      isValidInput(id) ? "valid-border" : ""
                    }`}
                  >
                    {icon}

                    <input
                      type={type}
                      id={id}
                      name={id}
                      placeholder={placeholder}
                      value={formData[id]}
                      onChange={handleInputChange}
                      required
                      aria-invalid={!!errors[id]}
                      maxLength={maxLength}
                    />

                    <label htmlFor={id}>{label}</label>

                    {toggle &&
                      (showPassword[id] ? (
                        <Icons.PasswordShow
                          className="eye"
                          onClick={() => togglePasswordType(id)}
                          aria-label={`Hide ${label}`}
                        />
                      ) : (
                        <Icons.PasswordHide
                          className="eye"
                          onClick={() => togglePasswordType(id)}
                          aria-label={`Show ${label}`}
                        />
                      ))}
                  </div>

                  {errors[id] && <span className="errorMsg">{errors[id]}</span>}

                  {/* Password Guide for the password field only */}
                  {id === "password" &&
                    formData.password &&
                    shouldRenderPasswordGuideContainer && (
                      <div className="password-guide">
                        {!passwordGuide.minLength && (
                          <p className="invalid">
                            <Icons.Checkmark className="guide-icon" /> At least
                            8 characters
                          </p>
                        )}
                        {!passwordGuide.hasUppercase && (
                          <p className="invalid">
                            <Icons.Checkmark className="guide-icon" /> An
                            uppercase letter (A-Z)
                          </p>
                        )}
                        {!passwordGuide.hasLowercase && (
                          <p className="invalid">
                            <Icons.Checkmark className="guide-icon" /> A
                            lowercase letter (a-z)
                          </p>
                        )}
                        {!passwordGuide.hasNumber && (
                          <p className="invalid">
                            <Icons.Checkmark className="guide-icon" /> A number
                            (0-9)
                          </p>
                        )}
                        {!passwordGuide.hasSymbol && (
                          <p className="invalid">
                            <Icons.Checkmark className="guide-icon" /> A symbol
                            (!@#$...)
                          </p>
                        )}
                      </div>
                    )}
                </div>
              )
            )}

            {/* Terms & Conditions */}
            <div className="flex termsConditions">
              <label>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  required
                />
                <span>
                  By creating your account, you agree to our{" "}
                  <a href="#" className="link">
                    Terms of Use
                  </a>{" "}
                  &{" "}
                  <a href="#" className="link">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {errors.termsAccepted && (
              <span
                className="errorMsg"
                style={{
                  fontSize: "0.7em",
                  color: "#dc3545",
                  marginTop: "-0.7rem",
                }}
              >
                {errors.termsAccepted}
              </span>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="registerLinkDiv">
              <span className="text">Already have an account? </span>
              <Link to="/Login" className="signUp link">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
