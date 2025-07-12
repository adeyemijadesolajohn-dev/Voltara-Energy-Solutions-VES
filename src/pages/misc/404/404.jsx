import React from "react";
import { Icons } from "../../../data/Assets";
import "./404.scss";

const ErrorDisplay = ({ type, message }) => {
  let iconComponent;
  let title;
  let defaultMessage;

  switch (type) {
    case "network":
      iconComponent = <Icons.NetWorkError className="error-icon network" />;
      title = "Connection Error";
      defaultMessage =
        "Unable to connect to the server. Please check your internet connection and try again.";
      break;
    case "auth":
      iconComponent = <Icons.AuthLock className="error-icon auth" />;
      title = "Authentication Failed";
      defaultMessage =
        "Invalid credentials. Please check your username and password.";
      break;
    case "validation":
      iconComponent = <Icons.Alert className="error-icon validation" />;
      title = "Input Validation Failed";
      defaultMessage =
        "Please review and correct the information you've entered.";
      break;
    case "server":
      iconComponent = <Icons.DatabaseError className="error-icon server" />;
      title = "Server Error";
      defaultMessage =
        "Something went wrong on our end. We're working to fix it.";
      break;
    case "not-found":
      iconComponent = <Icons.NotFound className="error-icon not-found" />;
      title = "Page Not Found";
      defaultMessage = "The page you are looking for does not exist.";
      break;
    case "access-denied":
      iconComponent = (
        <Icons.AccessDenied className="error-icon access-denied" />
      );
      title = "Access Denied";
      defaultMessage =
        "You do not have the necessary permissions to view this content.";
      break;
    default:
      iconComponent = <Icons.GenericError className="error-icon generic" />;
      title = "An Error Occurred";
      defaultMessage = "An unexpected error has occurred. Please try again.";
  }

  return (
    <div className="error-display-container">
      <div className="error-content">
        {iconComponent}
        <h3 className="error-title">{title}</h3>
        <p className="error-message">{message || defaultMessage}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
