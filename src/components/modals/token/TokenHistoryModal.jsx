import React, { useState, useEffect } from "react";
import "./TokenHistoryModal.scss";

const TokenHistoryModal = ({ onClose }) => {
  const [tokens, setTokens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tokenHistory")) || [];
    setTokens(stored);
    setFiltered(stored);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    const results = tokens.filter(
      (t) =>
        t.customerName.toLowerCase().includes(term) ||
        t.token.includes(term) ||
        t.date.includes(term)
    );
    setFiltered(results);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value || 0);

  return (
    <div className="tokenHistoryModal">
      <div className="modalContent">
        <h2>Token History</h2>
        <input
          type="text"
          placeholder="Search by name, token or date"
          value={search}
          onChange={handleSearch}
        />
        <div className="tokenList">
          {filtered.length === 0 ? (
            <p>No tokens found.</p>
          ) : (
            filtered.map((t, i) => (
              <div key={i} className="tokenCard">
                <p>
                  <strong>{t.customerName}</strong> - {t.date}
                </p>
                <p>Token: {t.token}</p>
                <p>Amount: {formatCurrency(t.total)}</p>
              </div>
            ))
          )}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TokenHistoryModal;
