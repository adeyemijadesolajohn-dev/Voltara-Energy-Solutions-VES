import React from "react";
import { Icons } from "../../../data/Assets";

const SearchModal = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="searchContainer">
      {isOpen ? (
        <form className="searchForm" onSubmit={onSubmit}>
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
          <button type="button" className="searchCloseBtn" onClick={onClose}>
            <Icons.Close className="navBadgeIcon" />
          </button>
        </form>
      ) : (
        <div onClick={onClose} className="searchIconContainer">
          <Icons.Search className="navBadgeIcon" />
        </div>
      )}
    </div>
  );
};

export default SearchModal;
