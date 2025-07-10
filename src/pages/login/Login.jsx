import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import "../../App.scss";
import { Icons, Public } from "../../data/Assets";

const Login = () => {
  // Initialize formData with values from localStorage if "Remember Me" was checked
  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    return {
      email: savedEmail || "",
      password: "",
    };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(""); // State for login error messages
  const [rememberMe, setRememberMe] = useState(() => {
    // Initialize rememberMe state from localStorage
    return localStorage.getItem("rememberMe") === "true";
  });

  const navigate = useNavigate();

  // Effect to set initial form data if "Remember Me" is active
  useEffect(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem("rememberedEmail");

      setFormData((prev) => ({
        ...prev,
        email: savedEmail || prev.email,
      }));
    }
  }, [rememberMe]); // Run once when component mounts and rememberMe state changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError(""); // Clear error message on input change
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    localStorage.setItem("rememberMe", e.target.checked); // Persist rememberMe state
    if (!e.target.checked) {
      // If unchecked, clear remembered credentials
      localStorage.removeItem("rememberedEmail");
      // localStorage.removeItem
    }
  };

  const handleForgotPassword = () => {
    const userEmail = prompt("Please enter your email to reset your password:");
    if (userEmail) {
      // Basic validation for email format (can be more robust)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        alert("Please enter a valid email address.");
        return;
      }
      // Simulate API call for forgot password
      console.log(`Sending password reset link to: ${userEmail}`);
      alert(
        `A password reset link has been sent to ${userEmail}. Please check your inbox.`
      );
    } else if (userEmail === "") {
      alert("Email cannot be empty.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); // Clear previous errors

    try {
      const res = await fetch("http://45.55.133.211:5144/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Clear stored user data on failed login
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("rememberedEmail"); // Also clear remembered email on failed login
        localStorage.setItem("rememberMe", "false"); // Set rememberMe to false
        setRememberMe(false); // Update state

        // Set specific error message based on API response or default
        setLoginError(
          data.message || "Invalid email or password. Please try again."
        );
        return; // Stop execution if login failed
      }

      // If login is successful
      if (data.token) {
        localStorage.setItem("authToken", data.token);

        // Store user ID if provided by the API response
        // IMPORTANT: Verify your API response for /api/users/login includes 'id'
        if (data.id) {
          localStorage.setItem("userId", data.id);
        } else {
          // Fallback: If API doesn't return ID, you might need to make another call
          // or assume ID is not needed for immediate dashboard navigation
          console.warn(
            "Login API did not return user ID. Dashboard navigation might be affected."
          );
          // If ID is needed,  make a GET /api/users/me (if available) here
          // to fetch user details using the token and then get the ID.
        }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          // If rememberMe was unchecked, clear stored credentials even on successful login
          localStorage.removeItem("rememberedEmail");
        }

        navigate("/SelectDashboard");
      } else {
        setLoginError(
          "Login successful, but no authentication token received."
        );
        // Clear any potentially stored data if login was 'successful' but incomplete
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      }
    } catch (err) {
      setLoginError("An error occurred during login. Please try again later.");
      console.error("Login error:", err);
      // Ensure local storage is cleaned up on network/other errors too
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("rememberedEmail");
      localStorage.setItem("rememberMe", "false");
      setRememberMe(false);
    }
  };

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
          <div className="headerDiv">
            <Link to="/" className="logo">
              <img src={Public.Logo} alt="Voltara logo" />

              <h4>Voltara</h4>

              <p>Energy Solutions</p>
            </Link>

            <h3>Welcome Back</h3>
          </div>

          <form className="grid form" onSubmit={handleSubmit}>
            <h2>Log In</h2>

            <div className="inputDiv">
              <div className="flex input">
                <Icons.CompanyEmail className="icon" />

                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="abc123@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={100} // Input limit for email
                />

                <label htmlFor="email">Email</label>
              </div>
            </div>

            <div className="inputDiv">
              <div className="flex input">
                <Icons.Password className="icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="************"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  maxLength={50} // Input limit for password
                />

                <label htmlFor="password">Password</label>

                {showPassword ? (
                  <Icons.PasswordShow
                    className="eye"
                    onClick={() => setShowPassword(false)}
                    aria-label="Hide password"
                  />
                ) : (
                  <Icons.PasswordHide
                    className="eye"
                    onClick={() => setShowPassword(true)}
                    aria-label="Show password"
                  />
                )}
              </div>
            </div>

            <div className="flex rememberForgot">
              <label>
                <input
                  type="checkbox"
                  name="remember"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />

                <span>Remember me</span>
              </label>

              <a
                href="#"
                className="forgot link"
                onClick={handleForgotPassword}
              >
                Forgot Password
              </a>
            </div>

            {loginError && <p className="errorMessage">{loginError}</p>}

            <button type="submit" className="btn">
              <span>Log In</span>
            </button>

            <div className="registerLinkDiv">
              <span className="text">Don't have an account? </span>
              <Link to="/Register" className="signUp link">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
