import React from "react";

const LanguageDropdown = ({
  selectedLanguage,
  setSelectedLanguage,
  isOpen,
  toggleOpen,
}) => {
  const languages = [
    "English (US)",
    "English (UK)",
    "Pidgin",
    "Yoruba",
    "Igbo",
    "Hausa",
    "French",
  ];

  return (
    <div
      className="navBadgeContent"
      onClick={toggleOpen}
      style={{ width: "200px" }}
    >
      {selectedLanguage}
      {isOpen && (
        <ul className="dropdownMenu">
          {languages.map((lang) => (
            <li
              key={lang}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLanguage(lang);
                toggleOpen(); // Close dropdown after selection
              }}
            >
              {lang}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown;
