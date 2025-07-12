import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import "../../App.scss";
import { Public, Icons } from "../../data/Assets";
import DevToggle from "../../components/dev/DevToggle";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // useEffect for auto-login on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const remembered = localStorage.getItem("rememberMe"); // Get the rememberMe flag

    // Only redirect the user if a session exists AND the rememberMe flag is true
    if (userId && userEmail && remembered === "true") {
      console.log(
        "Existing remembered session found. Redirecting to dashboard."
      );
      navigate(`/SelectDashboard/${userId}`);
    }
  }, [navigate]);

  const togglePasswordType = () => setShowPassword((prev) => !prev);
  const handleRememberMeChange = (e) => setRememberMe(e.target.checked);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiMessage({ type: "", text: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setApiMessage({ type: "", text: "" });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
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

      if (!loginRes.ok) {
        let errorText =
          loginData.message || "Login failed. Please check your credentials.";
        setApiMessage({ type: "error", text: errorText });
        setIsSubmitting(false);
        return;
      }

      const userEmail = loginData.data.email;
      localStorage.setItem("userEmail", userEmail);

      // Add a small delay to handle potential race conditions with backend
      setTimeout(async () => {
        try {
          const allUsersRes = await fetch("/api/users/all-users");
          const allUsers = await allUsersRes.json();
          const currentUser = allUsers.find((user) => user.email === userEmail);

          if (currentUser) {
            localStorage.setItem("userId", currentUser.id);
            // Save the rememberMe state to localStorage
            localStorage.setItem("rememberMe", rememberMe.toString());

            // Navigate to the select dashboard page with the user's ID
            setApiMessage({
              type: "success",
              text: "Login successful! Redirecting...",
            });
            navigate(`/SelectDashboard/${currentUser.id}`);
          } else {
            console.error("Could not find user ID after successful login.");
            setApiMessage({
              type: "error",
              text: "Login successful, but a routing error occurred. Please try again.",
            });
          }
        } catch (err) {
          console.error("Error fetching user ID:", err);
          setApiMessage({
            type: "error",
            text: "Network error or server unavailable. Please try again later.",
          });
          localStorage.clear(); // Clear storage on critical error
        } finally {
          setIsSubmitting(false);
        }
      }, 1000); // 1-second delay
    } catch (err) {
      console.error("API error:", err);
      setApiMessage({
        type: "error",
        text: "Network error or server unavailable. Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  const isValidInput = (id) =>
    formData[id] && formData[id].trim() !== "" && !errors[id];

  return (
    <div className="flex loginPage">
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
            <h3>Welcome Back!</h3>
            <p className="subHeader">Login to your account.</p>
          </div>

          <form className="grid form" onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            {apiMessage.text && (
              <p
                className={`api-message ${
                  apiMessage.type === "success" ? "success-msg" : "error-msg"
                }`}
                style={{
                  textAlign: "center",
                  width: "100%",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                {apiMessage.text}
              </p>
            )}

            <div className="inputDiv">
              <div
                className={`flex input ${
                  isValidInput("email") ? "valid-border" : ""
                }`}
              >
                <Icons.CompanyEmail className="icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="abc123@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
              {errors.email && <span className="errorMsg">{errors.email}</span>}
            </div>

            <div className="inputDiv">
              <div
                className={`flex input ${
                  isValidInput("password") ? "valid-border" : ""
                }`}
              >
                <Icons.Password className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="************"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">Password</label>
                {showPassword ? (
                  <Icons.PasswordShow
                    className="eye"
                    onClick={togglePasswordType}
                  />
                ) : (
                  <Icons.PasswordHide
                    className="eye"
                    onClick={togglePasswordType}
                  />
                )}
              </div>
              {errors.password && (
                <span className="errorMsg">{errors.password}</span>
              )}
            </div>

            <div className="flex rememberForgot">
              <div className="rememberMe">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <a className="link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Log In"}
            </button>

            <div className="registerLinkDiv">
              <span className="text">Don't have an account? </span>
              <Link to="/Register" className="signUp link">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
