import React, { useContext, useRef, useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { SidebarContext } from "../hooks/SidebarContext";
import useSmartNavbarVisibility from "../hooks/UseSmartNavbarVisibility";
import { Icons } from "../../data/Assets";
import "./Navbar.scss";

const MENU_ITEMS = [
  {
    label: "Map Overview",
    options: [
      "All Categories",
      "Meter Type",
      "Occupant Type",
      "Customer Type",
      "Status",
      "Payment Type",
    ],
  },
  {
    label: "Occupant Type",
    options: ["Tenant", "LandLord", "Realtor", "government"],
  },
  {
    label: "Issue Token",
    options: ["To PDF", "To CSV", "To Excel", "To Word", "As Image", "As JSON"],
  },
];

const MenuItem = memo(({ label, options, onClick }) => {
  const [selected, setSelected] = useState(label);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    onClick();
  };

  return (
    <li className="navbarItem" ref={dropdownRef}>
      <button
        type="button"
        className="navbarLinkButton"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <div className="navbarChevronContainer" aria-hidden>
          <Icons.ArrowDown className="navbarChevron" aria-hidden />
        </div>
      </button>
      {isOpen && (
        <ul className="navbarDropdown">
          {options.map((option) => (
            <li
              key={option}
              className="navbarDropdownItem"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
});
MenuItem.displayName = "MenuItem";

const Navbar = () => {
  const { toggleSidebar, isSidebarOpen } = useContext(SidebarContext);
  const isTogglerVisible = useSmartNavbarVisibility({}, isSidebarOpen);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarRef = useRef(null);

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
            <h1 className="navbarTitle">Meter Dashboard</h1>
            <span className="navbarSubtitle">/ Overview</span>
          </div>

          <nav className="navbarMenu" aria-label="Primary navigation">
            <ul className="navbarList">
              {MENU_ITEMS.map(({ label, options }) => (
                <MenuItem
                  key={label}
                  label={label}
                  options={options}
                  onClick={handleClose}
                />
              ))}

              <li className="navbarItem">
                <Link to="/ElectricBill" className="navbarLinkButton">
                  Meter Reading
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default memo(Navbar);
