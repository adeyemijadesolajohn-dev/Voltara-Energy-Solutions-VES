import React from "react";
import { Icons } from "../../../data/Assets";

const ChatModal = ({
  chatInput,
  setChatInput,
  handleChatSubmit,
  toggleModal,
  closeModal,
}) => (
  <div className="navModalOverlay" onClick={closeModal}>
    <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
      <div className="modalHeader">
        <button onClick={() => toggleModal("email")} className="toggleButton">
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
);

export default ChatModal;
