import React, { useState, useRef, useEffect } from "react";
import "./NavBadge.scss";
import { Link } from "react-router-dom";
import { Icons } from "../../data/Assets";

// Newly extracted modal and dropdown components
import NotificationModal from "../modals/notification/NotificationModal";
import ChatModal from "../modals/chat/ChatModal";
import EmailModal from "../modals/email/EmailModal";
import InfoModal from "../modals/info/InfoModal";
import HelpModal from "../modals/help/HelpModal";
import LanguageDropdown from "../dropdowns/language/LanguageDropdown";
import AccountDropdown from "../dropdowns/account/AccountDropdown";
import SearchModal from "../modals/search/SearchModal";

const NavBadge = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Choose Language");

  const searchRef = useRef(null);
  const bellRef = useRef(null);

  const toggleModal = (modalName) => {
    setActiveModal((prev) => (prev === modalName ? null : modalName));
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        if (activeModal === "notifications") closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeModal]);

  return (
    <div className="navBadge">
      {/* Language Dropdown */}
      <LanguageDropdown
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isOpen={languageDropdown}
        toggleOpen={() => setLanguageDropdown((prev) => !prev)}
      />

      {/* Search Modal */}
      <div ref={searchRef}>
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen((prev) => !prev)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Search:", searchQuery);
          }}
        />
      </div>

      {/* Notifications */}
      <div
        className="navBadgeContent"
        onClick={() => toggleModal("notifications")}
        ref={bellRef}
      >
        <Icons.Bell className="navBadgeIcon" />
      </div>

      {/* Chat */}
      <div className="navBadgeContent" onClick={() => toggleModal("chat")}>
        <Icons.Message className="navBadgeIcon" />
      </div>

      {/* Other Icons */}
      <div className="navBadgeContent">
        <Icons.Edit className="navBadgeIcon" />
      </div>

      <div className="navBadgeContent">
        <Icons.History className="navBadgeIcon" />
      </div>

      {/* Info */}
      <div className="navBadgeContent" onClick={() => toggleModal("info")}>
        <Icons.Info className="navBadgeIcon" />
      </div>

      {/* Help */}
      <div className="navBadgeContent" onClick={() => toggleModal("help")}>
        <Icons.Help className="navBadgeIcon" />
      </div>

      {/* Home */}
      <Link to="/selectDashboard" className="navBadgeContent">
        <Icons.Home className="navBadgeIcon" />
      </Link>

      {/* Manage Account */}
      <AccountDropdown
        isOpen={accountDropdown}
        toggleOpen={() => setAccountDropdown((prev) => !prev)}
      />

      <div className="navBadgeContent">
        <Icons.Settings className="navBadgeIcon" />
      </div>

      {/* Logout */}
      <Link to="/" className="navBadgeContent">
        <Icons.Logout className="navBadgeIcon" />
      </Link>

      {/* Modals */}
      {activeModal === "notifications" && (
        <NotificationModal onClose={closeModal} />
      )}

      {activeModal === "chat" && (
        <ChatModal onClose={closeModal} onSwitch={() => toggleModal("email")} />
      )}

      {activeModal === "email" && (
        <EmailModal onClose={closeModal} onSwitch={() => toggleModal("chat")} />
      )}

      {activeModal === "info" && <InfoModal onClose={closeModal} />}

      {activeModal === "help" && <HelpModal onClose={closeModal} />}
    </div>
  );
};

export default NavBadge;
