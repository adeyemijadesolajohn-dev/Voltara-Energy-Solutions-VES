import React from "react";
import { Icons } from "../../../data/Assets";

const MessageDetail = ({
  message,
  onBack,
  onAction,
  showOptions,
  toggleOptions,
  responseText,
  setResponseText,
  handleResponseSubmit,
}) => {
  if (!message) return null;

  return (
    <div className="messageDetail">
      <h2 className="messageSender">{message.sender}</h2>
      <p className="messageEmail">Email: {message.email}</p>
      <p className="messagePhone">Phone: {message.phone}</p>
      <small className="messageDate">
        {message.date} — {message.time}
      </small>
      <p className="messageSubject">
        <strong>{message.text}</strong>
      </p>
      <pre className="messageBody">{message.fullMessage}</pre>

      <div className="messageActionsDropdown">
        <button onClick={toggleOptions}>Options ⏷</button>

        {showOptions && (
          <ul className="dropdown hidden">
            {[
              "read",
              "unread",
              "delete",
              "copy",
              "share",
              "send",
              "forward",
              "go to profile",
              "report",
            ].map((action) => (
              <li key={action} onClick={() => onAction(action, message.id)}>
                {action}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleResponseSubmit}>
        <textarea
          placeholder="Type your response..."
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
        />
        <button type="submit">Respond</button>
      </form>
    </div>
  );
};

export default MessageDetail;
