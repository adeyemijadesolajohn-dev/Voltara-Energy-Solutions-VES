import React, { useEffect } from "react";
import "./DetailModal.scss";
import { Icons } from "../../../data/Assets";
import {
  exportToCSV,
  exportToExcel,
  printData,
  emailData,
  exportToPDF,
} from "../../hooks/Export";

const DetailModal = ({ data: row, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!row) return null;

  const handleExportCSV = () => exportToCSV([row], `record_${row.usageId}.csv`);
  const handleExportExcel = () =>
    exportToExcel([row], `record_${row.usageId}.xls`);
  const handlePrint = () => printData([row], row.usageId);
  const handleShare = () => emailData([row], row.usageId);
  const handleExportPDF = () =>
    exportToPDF({
      columns: Object.keys(row).map((key) => ({ field: key, label: key })),
      rows: [row],
      filename: `record_${row.usageId}.pdf`,
    });

  return (
    <div className="detailModalOverlay" onClick={onClose}>
      <div className="detailModal slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>
            <Icons.History className="modalIcon" />
            Detail for <strong>{row.usageId}</strong>
          </h3>
          <button
            onClick={onClose}
            className="closeBtn"
            aria-label="Close modal"
          >
            <Icons.Close className="detailIcon" />
          </button>
        </div>

        <div className="modalBody">
          {Object.entries(row).map(([key, value]) => (
            <div className="modalItem" key={key}>
              <span className="modalLabel">{key}</span>
              <span className="modalValue">
                {typeof value === "number" && key === "amount" ? (
                  `₦${value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`
                ) : ["purchased", "usage", "remaining", "voltage"].includes(
                    key
                  ) ? (
                  `${value} kWh`
                ) : key === "update" ? (
                  <span
                    style={{
                      color:
                        value === "Paid"
                          ? "yellowgreen"
                          : value === "Pending"
                          ? "orange"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {value}
                  </span>
                ) : (
                  value
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="modalFooter">
          <button onClick={handleExportCSV}>Export CSV</button>
          <button onClick={handleExportExcel}>Export Excel</button>
          <button onClick={handleExportPDF}>Export PDF</button>
          <button onClick={handlePrint}>Print</button>
          <button onClick={handleShare}>Email / Share</button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
