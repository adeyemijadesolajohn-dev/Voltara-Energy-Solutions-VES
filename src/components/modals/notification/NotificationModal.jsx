import React, { useState } from "react";
import NotificationList from "../notification/NotificationList";
import MessageDetail from "../message/MessageDetail";
import { Icons } from "../../../data/Assets";

const NotificationModal = ({ notifications, setNotifications, onClose }) => {
  const [openedMessageId, setOpenedMessageId] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleNotificationAction = (action, id) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id
        ? {
            ...n,
            read:
              action === "read" ? true : action === "unread" ? false : n.read,
          }
        : n
    );

    if (action === "delete") {
      setNotifications(notifications.filter((n) => n.id !== id));
      setOpenedMessageId(null);
      return;
    }

    setNotifications(updatedNotifications);

    const targetMessage = notifications.find((n) => n.id === id);
    if (!targetMessage) return;

    switch (action) {
      case "copy":
        navigator.clipboard
          .writeText(targetMessage.text)
          .then(() => alert("Message copied to clipboard!"))
          .catch(() => alert("Failed to copy message."));
        break;
      case "forward":
      case "share":
      case "send":
        alert(`Message ${action}ed.`);
        break;
      case "go to profile":
        alert("Opening user profile...");
        break;
      case "report":
        alert("Message reported.");
        break;
      default:
        break;
    }
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    alert(`Response submitted: ${responseText}`);
    setResponseText("");
  };

  const message = notifications.find((n) => n.id === openedMessageId);

  return (
    <div className="navModalOverlay" onClick={onClose}>
      <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          {openedMessageId ? (
            <button
              className="backButton"
              onClick={() => setOpenedMessageId(null)}
            >
              <Icons.Back className="navBadgeIcon" />
            </button>
          ) : (
            <h3 className="modalTitle">Messages</h3>
          )}

          <button onClick={onClose} className="closeButton">
            <Icons.Close className="navBadgeIcon" />
          </button>
        </div>

        {!openedMessageId ? (
          <NotificationList
            notifications={notifications}
            onOpenMessage={(id) => {
              setOpenedMessageId(id);
              const isRead = notifications.find((n) => n.id === id)?.read;
              if (!isRead) handleNotificationAction("read", id);
            }}
          />
        ) : (
          <MessageDetail
            message={message}
            onBack={() => setOpenedMessageId(null)}
            onAction={handleNotificationAction}
            showOptions={showMessageOptions}
            toggleOptions={() => setShowMessageOptions((prev) => !prev)}
            responseText={responseText}
            setResponseText={setResponseText}
            handleResponseSubmit={handleResponseSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
