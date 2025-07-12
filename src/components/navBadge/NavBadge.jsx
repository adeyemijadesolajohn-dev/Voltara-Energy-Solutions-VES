import React, { useState, useRef, useEffect } from "react";
import "./NavBadge.scss";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Link } from "react-router-dom";
import { Icons } from "../../data/Assets";

const NavBadge = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Choose Language");
  const [openedMessageId, setOpenedMessageId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showMessageOptions, setShowMessageOptions] = useState(false);

  const searchRef = useRef(null);
  const bellRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: <Icons.User />,
      sender: "Joe Doe",
      email: "R9M2t@example.com",
      phone: "+2348012345678",
      text: "New order received",
      fullMessage:
        "Dear Admin,\n\nYou’ve received a new order from Joe Doe. Please process it at your earliest convenience. The order contains organic vegetables, fruits, and dairy products.\n\nBest regards,\nVoltara System",
      time: "09:34 AM",
      date: "2025-06-26",
      read: false,
    },
    {
      id: 2,
      avatar: <Icons.Partner />,
      sender: "Partner",
      email: "partner@example.com",
      phone: "+2348098765432",
      text: "Stock update available",
      fullMessage:
        "Hi,\n\nWe’ve restocked our inventory. The out-of-stock items are now available again. Please update the storefront.\n\nThanks,\nYour Supplier Partner.",
      time: "08:15 AM",
      date: "2025-06-25",
      read: false,
    },
    {
      id: 3,
      avatar: <Icons.Support />,
      sender: "Voltara Team",
      email: "support@volt.com",
      phone: "+2348000000000",
      text: "System maintenance at midnight",
      fullMessage:
        "Heads up!\n\nWe’ll be performing system maintenance tonight between 12:00 AM and 2:00 AM. During this time, you may experience downtime.\n\nThank you for your patience.\n\n— Voltara Tech Team",
      time: "06:00 AM",
      date: "2025-06-24",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const [chatHistory, setChatHistory] = useState([
    {
      avatar: <Icons.AI />,
      sender: "Volta AI Assistant",
      message:
        "Hi there! I'm Volta, your trusted AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  const handleNotificationAction = (action, id) => {
    if (action === "delete") {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setOpenedMessageId(null);
      return;
    }
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              read:
                action === "read" ? true : action === "unread" ? false : n.read,
            }
          : n
      )
    );
    if (action === "copy") {
      const text = notifications.find((n) => n.id === id)?.text || "";
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Message copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          alert("Failed to copy message.");
        });
    }
    if (action === "forward") {
      alert("Forwarding message...");
    }
    if (action === "go to profile") {
      alert("Opening user profile...");
    }

    if (action === "report") {
      alert("Message reported.");
    }

    if (action === "send" || action === "share") {
      alert(`Message ${action}ed.`);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      sender: "user",
      message: chatInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setChatInput("");

    setTimeout(() => {
      const aiMessage = {
        avatar: <Icons.AI />,
        sender: "Volta AI Assistant",
        message: "Thanks for reaching out. We’ll get back to you shortly.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    }, 500);
  };

  const toggleModal = (modalName) => {
    setActiveModal((prev) => (prev === modalName ? null : modalName));
    setOpenedMessageId(null);
    setShowMessageOptions(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setOpenedMessageId(null);
    setShowMessageOptions(false);
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    alert(`Response submitted: ${responseText}`);
    setResponseText("");
  };

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);

  const handleInputClick = () => {
    setShowDatePicker(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setActiveModal((prev) => (prev === "notifications" ? null : prev));
      }
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navBadge">
      <div className="navBadgeActions" id="navBadgeActions">
        {/* Date Range Picker */}
        <div
          ref={dateRangeRef}
          className={`dateRangeWrapper ${
            !showDatePicker ? "hide-date-range" : ""
          }`}
          onClick={handleInputClick}
        >
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            showMonthAndYearPickers={false}
          />
        </div>

        {/* Language Dropdown */}
        <div
          className="navBadgeContent"
          onClick={() => setLanguageDropdown((prev) => !prev)}
          style={{ width: "200px" }}
          id="languageDropdown"
        >
          {selectedLanguage}
          {languageDropdown && (
            <ul className="dropdownMenu">
              {[
                "English (US)",
                "English (UK)",
                "Pidgin",
                "Yoruba",
                "Igbo",
                "Hausa",
                "French",
              ].map((lang) => (
                <li
                  key={lang}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLanguage(lang);
                    setLanguageDropdown(false);
                  }}
                >
                  {lang}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="navBadgeActions">
        {/* Search Input */}
        <div className=" searchContainer" ref={searchRef} id="searchContainer">
          {isSearchOpen ? (
            <form className="searchForm" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="searchInput"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />

              <button type="submit" className="searchSubmitBtn">
                <Icons.Search className="navBadgeIcon" />
              </button>

              <button
                type="button"
                className="searchCloseBtn"
                onClick={() => setIsSearchOpen(false)}
              >
                <Icons.Close className="navBadgeIcon" />
              </button>
            </form>
          ) : (
            <div
              onClick={() => setIsSearchOpen(true)}
              className="searchIconContainer"
            >
              <Icons.Search className="navBadgeIcon" />
            </div>
          )}
        </div>

        {/* Notifications */}
        <div
          className="navBadgeContent"
          onClick={() => toggleModal("notifications")}
          ref={bellRef}
          id="notificationBell"
        >
          <Icons.Bell className="navBadgeIcon" />

          {unreadCount > 0 && (
            <span className="unreadCount">{unreadCount}</span>
          )}
        </div>

        {/* Chat/Email */}
        <div
          className="navBadgeContent"
          onClick={() => toggleModal("chat")}
          id="chatContainer"
        >
          <Icons.Message className="navBadgeIcon" />
        </div>

        {/* Info */}
        <div
          className="navBadgeContent"
          onClick={() => toggleModal("info")}
          id="infoContainer"
        >
          <Icons.Info className="navBadgeIcon" />
        </div>

        {/* Help/AI Chatbot */}
        <div
          className="navBadgeContent"
          onClick={() => toggleModal("help")}
          id="helpContainer"
        >
          <Icons.Help className="navBadgeIcon" />
        </div>

        {/* Manage Account Dropdown */}
        <div
          className="navBadgeContent"
          onClick={() => setAccountDropdown((prev) => !prev)}
          id="accountDropdown"
        >
          <Icons.ManageAccount className="navBadgeIcon" />
          {accountDropdown && (
            <ul className="dropdownMenu" style={{ left: "-120%" }}>
              <li>Profile</li>

              <li>Billing</li>

              <li>Security</li>

              <li>Logout</li>
            </ul>
          )}
        </div>

        {/* Home */}
        <Link to="/selectDashboard" className="navBadgeContent" id="homeLink">
          <Icons.Home className="navBadgeIcon" />
        </Link>
      </div>

      {/* All Modals */}

      {/* Notifications Modal */}
      {activeModal === "notifications" && (
        <div className="navModalOverlay" onClick={closeModal}>
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

              <button onClick={closeModal} className="closeButton">
                <Icons.Close className="navBadgeIcon" />
              </button>
            </div>

            {!openedMessageId
              ? notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notificationItem ${n.read ? "read" : "unread"}`}
                    onClick={() => {
                      setOpenedMessageId(n.id);
                      if (!n.read) {
                        setTimeout(
                          () => handleNotificationAction("read", n.id),
                          0
                        );
                      }
                    }}
                  >
                    <p className="notificationText">
                      {n.text}{" "}
                      {!n.read ? (
                        <span className="status unread">
                          <Icons.Unread className="navBadgeIcon" />{" "}
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
                ))
              : (() => {
                  const msg = notifications.find(
                    (n) => n.id === openedMessageId
                  );
                  if (!msg) return null;
                  return (
                    <div className="messageDetail">
                      <h2 className="messageSender">{msg.sender}</h2>

                      <p className="messageEmail">Email: {msg.email}</p>

                      <p className="messagePhone">Phone: {msg.phone}</p>

                      <small className="messageDate">
                        {msg.date} — {msg.time}
                      </small>

                      <p className="messageSubject">
                        <strong>{msg.text}</strong>
                      </p>

                      <pre className="messageBody">{msg.fullMessage}</pre>

                      <div className="messageActionsDropdown">
                        <button
                          onClick={() => setShowMessageOptions((prev) => !prev)}
                        >
                          Options ⏷
                        </button>

                        {showMessageOptions && (
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
                              <li
                                key={action}
                                onClick={() =>
                                  handleNotificationAction(
                                    action,
                                    openedMessageId
                                  )
                                }
                              >
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
                })()}
          </div>
        </div>
      )}

      {activeModal === "chat" && (
        <div className="navModalOverlay" onClick={closeModal}>
          <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <button
                onClick={() => toggleModal("email")}
                className="toggleButton"
              >
                <Icons.Mail className="navBadgeIcon" />
              </button>

              <h3 className="modalTitle">Chat</h3>

              <button onClick={closeModal} className="closeButton">
                <Icons.Close className="navBadgeIcon" />
              </button>
            </div>

            <div className="textBoxContainer">
              <input
                className="textBox"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message here..."
              />

              <button className="sendButton" onClick={handleChatSubmit}>
                <Icons.Send className="navBadgeIcon" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "email" && (
        <div className="navModalOverlay" onClick={closeModal}>
          <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <button
                onClick={() => toggleModal("chat")}
                className="toggleButton"
              >
                <Icons.Chat className="navBadgeIcon" />
              </button>

              <h3 className="modalTitle">Email</h3>

              <button onClick={closeModal} className="closeButton">
                <Icons.Close className="navBadgeIcon" />
              </button>
            </div>

            <div className="textBoxContainer">
              <input
                className="textBox"
                type="text"
                placeholder="Type your Email here..."
              />

              <button className="sendButton">
                <Icons.Send className="navBadgeIcon" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "info" && (
        <div className="navModalOverlay" onClick={closeModal}>
          <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Information</h3>

              <button onClick={closeModal} className="closeButton">
                <Icons.Close className="navBadgeIcon" />
              </button>
            </div>

            <p className="modalText">
              This is a general informational modal. Use it for guidance and
              context.
            </p>
          </div>
        </div>
      )}

      {activeModal === "help" && (
        <div className="navModalOverlay" onClick={closeModal}>
          <div
            className="navModalContent "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <h3 className="modalTitle">AI Help Assistant</h3>

              <button onClick={closeModal} className="closeButton">
                <Icons.Close className="navBadgeIcon" />
              </button>
            </div>

            <div className="chatBody" id="chatBody">
              {chatHistory.map((entry, idx) => (
                <div key={idx} className={`chatBubble ${entry.sender}`}>
                  <div className="bubbleAvatar">
                    {entry.avatar || <Icons.AI className="navBadgeIcon" />}
                  </div>

                  <div className="bubbleContent">
                    <div className="bubbleSender">{entry.sender}</div>

                    <div className="bubbleMessage">
                      <div className="bubbleText">{entry.message}</div>

                      <div className="bubbleTime">{entry.time}pm</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form className="textBoxContainer" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..."
                className="textBox"
              />

              <button type="submit" className="sendButton">
                Send
              </button>
            </form>

            <div className="callHelp">
              Need real-time help?{" "}
              <a href="tel:+2348001234567" className="callLink">
                Call Help Center: +234 800 123 4567
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBadge;
