import React, { useContext, useRef, useEffect, useState, memo } from "react";
import { SidebarContext } from "../hooks/SidebarContext";
import useSmartNavbarVisibility from "../hooks/UseSmartNavbarVisibility";
import CreateAccount from "../modals/createAccount/CreateAccount";
import { Icons } from "../../data/Assets";
import "./Navbar.scss";

// The Navbar component now accepts userId and authToken as props
const Navbar = ({ userId, authToken }) => {
  const { toggleSidebar, isSidebarOpen } = useContext(SidebarContext);
  const isTogglerVisible = useSmartNavbarVisibility({}, isSidebarOpen);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarRef = useRef(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSidebar();
    }
  };

  const handleClose = () => setNavbarOpen(false);
  const handleToggle = () => setNavbarOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setNavbarOpen(false);
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="navbar">
        <div
          role="button"
          tabIndex={0}
          aria-pressed={isSidebarOpen}
          className={`sidebarToggler ${isTogglerVisible ? "show" : "hide"}`}
          onKeyDown={onKeyDown}
          onClick={toggleSidebar}
        >
          <div className="sidebarTogglerInner">
            <span className="sidebarTogglerIcon">
              {isSidebarOpen ? (
                <Icons.SidebarUnfold className="sidebarIcon" />
              ) : (
                <Icons.SidebarFold className="sidebarIcon" />
              )}
            </span>
          </div>
        </div>

        {navbarOpen && <div className="navbarOverlay" onClick={handleClose} />}

        <button
          className={`navbarMobileToggle ${isTogglerVisible ? "show" : "hide"}`}
          onClick={handleToggle}
        >
          {navbarOpen ? (
            <Icons.NavbarCollapse className="navbarMobileIcon" />
          ) : (
            <Icons.NavbarExpand className="navbarMobileIcon" />
          )}
        </button>

        <div
          ref={navbarRef}
          className={`navbarContainer ${navbarOpen ? "open" : ""}`}
        >
          <div className="navbarBrand">
            <h1 className="navbarTitle">Account Dashboard</h1>
            <span className="navbarSubtitle">/ Overview</span>
          </div>

          <nav className="navbarMenu" aria-label="Primary navigation">
            <ul className="navbarList">
              <li className="navbarItem">
                <button
                  className="navbarLinkButton"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Account
                </button>
              </li>
              <li className="navbarItem">
                <button className="navbarLinkButton">Edit Account</button>
              </li>
              <li className="navbarItem">
                <button className="navbarLinkButton">Delete Account</button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <CreateAccount
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={userId}
        authToken={authToken}
      />
    </>
  );
};

export default memo(Navbar);
