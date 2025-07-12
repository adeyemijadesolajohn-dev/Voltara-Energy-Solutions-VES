import React from "react";
import { Icons } from "../../../data/Assets";

const EmailModal = ({ toggleModal, closeModal }) => (
  <div className="navModalOverlay" onClick={closeModal}>
    <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
      <div className="modalHeader">
        <button onClick={() => toggleModal("chat")} className="toggleButton">
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
          placeholder="Type your email here..."
        />
        <button className="sendButton">
          <Icons.Send className="navBadgeIcon" />
        </button>
      </div>
    </div>
  </div>
);

export default EmailModal;
