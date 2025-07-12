import React from "react";
import { Icons } from "../../../data/Assets";

const HelpModal = ({
  chatHistory,
  chatInput,
  setChatInput,
  handleChatSubmit,
  closeModal,
}) => (
  <div className="navModalOverlay" onClick={closeModal}>
    <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
      <div className="modalHeader">
        <h3 className="modalTitle">AI Help Assistant</h3>
        <button onClick={closeModal} className="closeButton">
          <Icons.Close className="navBadgeIcon" />
        </button>
      </div>

      <div className="chatBody">
        {chatHistory.map((entry, idx) => (
          <div key={idx} className={`chatBubble ${entry.sender}`}>
            <div className="bubbleText">{entry.message}</div>
            <div className="bubbleTime">{entry.time}</div>
          </div>
        ))}
      </div>

      <form className="chatInputArea" onSubmit={handleChatSubmit}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button type="submit">Send</button>
      </form>

      <div className="callHelp">
        Need real-time help?{" "}
        <a href="tel:+2348001234567">Call Help Center: +234 800 123 4567</a>
      </div>
    </div>
  </div>
);

export default HelpModal;
