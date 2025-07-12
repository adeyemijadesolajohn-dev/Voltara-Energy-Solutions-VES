import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user-related data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    // can also clear any other relevant data if needed
    // localStorage.clear(); // Use this to clear everything

    // Redirect the user to the landing page
    navigate("/");
  }, [navigate]);

  // The component won't render anything, it just handles the redirection
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
