import React from "react";
import { Icons } from "../../../data/Assets";

const AccountDropdown = ({ isOpen, toggleOpen }) => {
  return (
    <div className="navBadgeContent" onClick={toggleOpen}>
      <Icons.ManageAccount className="navBadgeIcon" />
      {isOpen && (
        <ul className="dropdownMenu" style={{ left: "-120%" }}>
          <li>Profile</li>
          <li>Billing</li>
          <li>Security</li>
          <li>Logout</li>
        </ul>
      )}
    </div>
  );
};

export default AccountDropdown;
