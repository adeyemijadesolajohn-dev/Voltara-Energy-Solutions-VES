import React, { useRef } from "react";
import "./PrintPreviewModal.scss";

const PrintPreviewModal = ({ data, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html><head><title>Invoice</title></head><body>
      ${printContents}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="printPreviewModal">
      <div className="modalContent">
        <div ref={printRef} className="invoicePreview">
          <h2>Print Preview</h2>
          <p>
            <strong>Customer:</strong> {data.customerName}
          </p>
          <p>
            <strong>Meter Number:</strong> {data.meterNumber}
          </p>
          <p>
            <strong>Token:</strong> {data.token}
          </p>
          <p>
            <strong>Total Paid:</strong> ₦
            {Number(data.total).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p>
            <strong>Date:</strong> {data.date}
          </p>
        </div>
        <div className="printControls">
          <button onClick={handlePrint}>Print</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
