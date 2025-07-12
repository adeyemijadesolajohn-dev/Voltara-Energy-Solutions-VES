import React from "react";
import { Icons } from "../../../data/Assets";

const NotificationList = ({ notifications, onOpenMessage }) => {
  return (
    <div className="notificationList">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`notificationItem ${n.read ? "read" : "unread"}`}
          onClick={() => onOpenMessage(n.id)}
        >
          <p className="notificationText">
            {n.text}{" "}
            {!n.read ? (
              <span className="status unread">
                <Icons.Unread className="navBadgeIcon" />
                <Icons.Alert className="navBadgeIcon" />
              </span>
            ) : (
              <span className="status read">
                <Icons.Read className="navBadgeIcon" />
              </span>
            )}
          </p>
          <small className="notificationDate">
            {n.date} — {n.time}
          </small>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
