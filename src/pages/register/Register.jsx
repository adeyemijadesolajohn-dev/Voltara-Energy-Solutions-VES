import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import "../../App.scss";
import { Icons, Public } from "../../data/Assets";
import DevToggle from "../../components/dev/DevToggle";

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
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiMessage({ type: "", text: "" });

    if (name === "password") {
      setPasswordGuide({
        minLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value),
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

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

  const isValidInput = (id) => {
    const hasValue = formData[id] && formData[id].toString().trim() !== "";

    if (id === "password") {
      const allPasswordRequirementsMet =
        Object.values(passwordGuide).every(Boolean);
      return hasValue && allPasswordRequirementsMet && !errors.password;
    }

    if (id === "confirmPassword") {
      return (
        hasValue &&
        formData.password === formData.confirmPassword &&
        !errors.confirmPassword
      );
    }

    return hasValue && !errors[id];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setApiMessage({ type: "", text: "" });

    if (Object.keys(validationErrors).length > 0) {
      setApiMessage({
        type: "error",
        text: "Please fix the validation errors.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Register the new user
      const registerRes = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!registerRes.ok) {
        const registerData = await registerRes.json();
        let errorText =
          registerData.message || "Registration failed. Please try again.";
        setApiMessage({ type: "error", text: errorText });
        return;
      }

      // Step 2: Log in the newly created user to get their session
      const loginRes = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginRes.json();

      if (
        !loginRes.ok ||
        !loginData.response ||
        !loginData.data ||
        !loginData.data.email
      ) {
        setApiMessage({
          type: "error",
          text:
            loginData.message ||
            "Login after registration failed. Please try logging in manually.",
        });
        return;
      }

      const userEmail = loginData.data.email;
      localStorage.setItem("userEmail", userEmail);

      // New Step 3: Fetch the user's ID immediately after login
      setTimeout(async () => {
        try {
          const allUsersRes = await fetch("/api/users/all-users");
          const allUsers = await allUsersRes.json();
          const currentUser = allUsers.find((user) => user.email === userEmail);

          if (currentUser) {
            localStorage.setItem("userId", currentUser.id);
            setApiMessage({
              type: "success",
              text: "Registration successful! Redirecting...",
            });
            // Navigate to the new dynamic path with the user's ID
            navigate(`/SelectDashboard/${currentUser.id}`);
          } else {
            console.error(
              "Could not find user ID after successful registration."
            );
            setApiMessage({
              type: "error",
              text: "Registration successful, but login failed. Please try logging in.",
            });
          }
        } catch (err) {
          console.error("Error fetching user ID after registration:", err);
          setApiMessage({
            type: "error",
            text: "Network error or server unavailable. Please try again.",
          });
        } finally {
          setIsSubmitting(false);
        }
      }, 1000); // 1-second delay for backend to sync
    } catch (err) {
      console.error("API error:", err);
      setApiMessage({
        type: "error",
        text: "Network error or server unavailable. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldRenderPasswordGuideContainer =
    formData.password && !Object.values(passwordGuide).every(Boolean);

  return (
    <div className="flex registerPage">
      <div className="flex container">
        <div className="loginBGDiv">
          <img src={Public.BG} alt="Login Background" />
          <div className="loginBGText">
            <h2 className="loginBGHeading">Connecting you to the future</h2>
            <p>Create your Connection</p>
          </div>
        </div>

        <div className="flex formDiv">
          <DevToggle />
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
                style={{ fontSize: "0.7em", color: "#dc3545" }}
              >
                {errors.termsAccepted}
              </span>
            )}

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
