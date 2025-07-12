import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  if (!userId || !userEmail) {
    // Redirect to login if userId or userEmail are missing
    console.warn("Unauthorized access. Redirecting to login.");
    return <Navigate to="/Login" replace />;
  }

  // Render the child components if the user is authenticated
  return children;
};

export default ProtectedRoute;
