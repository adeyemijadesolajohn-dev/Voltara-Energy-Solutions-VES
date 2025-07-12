import React from "react";
import { Icons } from "../../../data/Assets";

const InfoModal = ({ closeModal }) => (
  <div className="navModalOverlay" onClick={closeModal}>
    <div className="navModalContent" onClick={(e) => e.stopPropagation()}>
      <div className="modalHeader">
        <h3 className="modalTitle">Information</h3>
        <button onClick={closeModal} className="closeButton">
          <Icons.Close className="navBadgeIcon" />
        </button>
      </div>
      <p className="modalText">
        This is a general informational modal. Use it for guidance and context.
      </p>
    </div>
  </div>
);

export default InfoModal;
