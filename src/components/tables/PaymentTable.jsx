import React, { useState, useRef, useEffect } from "react";
import "./Table.scss";
import { initialColumns, initialRows } from "../../data/PaymentData";
import DetailModal from "../modals/detail/DetailModal";
import { Icons } from "../../data/Assets";

const Table = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(initialRows);
  const [filterText, setFilterText] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editedRows, setEditedRows] = useState(new Set());
  const [showExport, setShowExport] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isCompactView, setIsCompactView] = useState(window.innerWidth <= 720);
  const [animateDate, setAnimateDate] = useState(false);
  const [modalData, setModalData] = useState(null);

  const exportRef = useRef(null);
  const manageRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setAnimateDate(true);
      setTimeout(() => setAnimateDate(false), 300); // match slide duration
      setIsCompactView(window.innerWidth <= 720);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExport(false);
      }
      if (manageRef.current && !manageRef.current.contains(e.target)) {
        setShowManage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const convertTo24Hour = (time) => {
    const [h, m, part] = time.match(/(\d+):(\d+) (AM|PM)/i).slice(1);
    let hour = parseInt(h, 10);
    if (part.toUpperCase() === "PM" && hour < 12) hour += 12;
    if (part.toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${m}`;
  };

  const getDateSuffix = (date) => {
    if (date >= 11 && date <= 13) return `${date}th`;
    switch (date % 10) {
      case 1:
        return `${date}st`;
      case 2:
        return `${date}nd`;
      case 3:
        return `${date}rd`;
      default:
        return `${date}th`;
    }
  };

  const formatDate = (row) => {
    const day = String(row.date).padStart(2, "0");
    const monthIndex = new Date(`${row.month} 1, ${row.year}`).getMonth();
    const month = String(monthIndex + 1).padStart(2, "0");
    const time24 = convertTo24Hour(row.time);
    return `${time24} | ${day}/${month}/${row.year}`;
  };

  const formatAmount = (amt) =>
    `₦${amt.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatStatus = (status) => {
    const color =
      status === "Paid"
        ? "yellowgreen"
        : status === "Pending"
        ? "orange"
        : "red";
    return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
  };

  const toggleColumn = (field) => {
    setColumns((prev) =>
      prev.find((col) => col.field === field)
        ? prev.filter((col) => col.field !== field)
        : [...prev, initialColumns.find((col) => col.field === field)]
    );
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const handleDragStart = (index) => setDraggingIndex(index);

  const handleDrop = (index) => {
    if (draggingIndex === null || draggingIndex === index) return;
    const reordered = [...columns];
    const [dragged] = reordered.splice(draggingIndex, 1);
    reordered.splice(index, 0, dragged);
    setColumns(reordered);
    setDraggingIndex(null);
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
  });

  const filtered = sortedRows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const paginatedRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleModalOpen = (row) => setModalData(row);
  const handleModalClose = () => setModalData(null);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const exportToCSV = () => {
    const csv = [
      columns.map((col) => col.label).join(","),
      ...rows.map((row) =>
        columns
          .map((col) => {
            if (col.field === "date") return formatDate(row);
            const value = row[col.field];
            if (
              ["purchased", "usage", "remaining", "voltage"].includes(col.field)
            ) {
              return `${value} kWh`;
            }
            if (col.field === "amount") {
              return `₦${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "all_history.csv";
    link.click();
  };

  const exportFilteredToCSV = () => {
    const csv = [
      columns.map((col) => col.label).join(","),
      ...filtered.map((row) =>
        columns
          .map((col) => {
            if (col.field === "date") return formatDate(row);
            const value = row[col.field];
            if (
              ["purchased", "usage", "remaining", "voltage"].includes(col.field)
            ) {
              return `${value} kWh`;
            }
            if (col.field === "amount") {
              return `₦${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "filtered_history.csv";
    link.click();
  };

  const exportAllToExcel = () => {
    exportToExcel(rows, "all_history.xls");
  };

  const exportFilteredToExcel = () => {
    exportToExcel(filtered, "filtered_history.xls");
  };

  const exportToExcel = (data, filename) => {
    const headerStyle =
      'style="font-weight:bold; background:#f0f0f0; border:1px solid #ccc;"';
    const cellStyle = 'style="border:1px solid #ccc; padding:4px;"';
    const headers = columns
      .map((col) => `<th ${headerStyle}>${col.label}</th>`)
      .join("");
    const bodyRows = data.map((row) => {
      return `<tr>${columns
        .map((col) => {
          let value = row[col.field];
          if (col.field === "date") {
            value = formatDate(row);
          } else if (
            ["purchased", "usage", "remaining", "voltage"].includes(col.field)
          ) {
            value = `${value.toLocaleString()} kWh`;
          } else if (typeof value === "number") {
            value = value.toLocaleString();
          }
          if (col.field === "status") {
            const color =
              value === "Paid"
                ? "yellowgreen"
                : value === "Pending"
                ? "orange"
                : "red";
            value = `<span style='color:${color};font-weight:bold;'>${value}</span>`;
          }
          return `<td ${cellStyle}>${value}</td>`;
        })
        .join("")}</tr>`;
    });

    const html = `
      <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${bodyRows.join("")}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handlePrint = () => {
    const content = document.getElementById("print-area").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(
      "<html><head><title>Print</title><style>table { width: 100%; border-collapse: collapse; } th, td { padding: 8px; border: 1px solid #ccc; } </style></head><body>"
    );
    printWindow.document.write(content);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const exportToPDF = ({
    columns,
    rows,
    filename = {
      all: "all_history.pdf",
      filtered: "filtered_history.pdf",
    },
    logoUrl = "../../assets/voltara/voltara placeholder logo.png", // Add your company logo path or URL
    watermark = "Voltara",
    groupBy = null, // field to group by (e.g., "month" or "status")
  }) => {
    const colLabels = columns.map((col) => col.label);

    // Utility: format a single row
    const formatRow = (row) =>
      columns.map((col) => {
        if (col.field === "date") return formatDate(row);
        if (["purchased", "usage", "remaining", "voltage"].includes(col.field))
          return `${row[col.field]} kWh`;
        if (col.field === "amount")
          return `₦${row[col.field].toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        return row[col.field];
      });

    // Optional: group rows by a column (e.g., by month or status)
    const groupedData = groupBy
      ? rows.reduce((acc, row) => {
          const key = row[groupBy] || "Others";
          acc[key] = acc[key] || [];
          acc[key].push(row);
          return acc;
        }, {})
      : { All: rows };

    const tableSections = Object.entries(groupedData)
      .map(([groupName, groupRows], idx) => {
        const table = `
          <table>
            <thead>
              <tr>${colLabels.map((label) => `<th>${label}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${groupRows
                .map((row) => {
                  const rowData = formatRow(row);
                  return `<tr>${rowData
                    .map((cell) => `<td>${cell}</td>`)
                    .join("")}</tr>`;
                })
                .join("")}
            </tbody>
          </table>
        `;
        return `
          <div class="groupSection">
            <h3 class="groupHeader">${groupBy ? groupName : ""}</h3>
            ${table}
          </div>
          ${
            idx < Object.entries(groupedData).length - 1
              ? `<div class="page-break"></div>`
              : ""
          }
        `;
      })
      .join("");

    const htmlContent = `
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
            }
            .logo {
              max-width: 150px;
              margin-bottom: 20px;
            }
            .watermark {
              opacity: 0.1;
              position: fixed;
              bottom: 30%;
              right: 10%;
              transform: rotate(-30deg);
              font-size: 5rem;
              z-index: -1;
            }
            .groupSection {
              margin-bottom: 40px;
            }
            .groupHeader {
              margin-top: 20px;
              color: #333;
              font-size: 1.2rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #999;
              padding: 8px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background: #f0f0f0;
            }
            .page-break {
              page-break-after: always;
            }
          </style>
        </head>
        <body>
          ${
            logoUrl
              ? `<img class="logo" src="${logoUrl}" alt="Company Logo" />`
              : ""
          }
          ${watermark ? `<div class="watermark">${watermark}</div>` : ""}
          <h2>${filename.replace(/\.pdf$/, "")}</h2>
          ${tableSections}
          <script>
            window.onload = function () {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=1000,height=700");
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const emailData = (
    columns,
    rows,
    recipient = "",
    subject = "Data Export"
  ) => {
    const body = [
      columns.map((col) => col.label).join(", "),
      ...rows.map((row) => columns.map((col) => row[col.field]).join(", ")),
    ].join("\n");

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
  };

  const printData = (columns, rows) => {
    const win = window.open("", "", "width=800,height=600");
    const table = [
      "<table border='1'><thead><tr>",
      columns.map((col) => `<th>${col.label}</th>`).join(""),
      "</tr></thead><tbody>",
      ...rows.map(
        (row) =>
          `<tr>${columns
            .map((col) => `<td>${row[col.field]}</td>`)
            .join("")}</tr>`
      ),
      "</tbody></table>",
    ].join("");
    win.document.write(
      `<html><head><title>Print</title></head><body>${table}</body></html>`
    );
    win.document.close();
    win.print();
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const allRowIds = new Set(paginatedRows.map((row) => row.id));
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="historyTableContainer">
      <div className="tableToolbar">
        <input
          className="tableFilterInput"
          placeholder="Filter rows..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <div className="historyTitle">
          <div className="historyTitleContainer">
            <div className="historyIcon">
              <Icons.Table className="bGIcon" />
              <Icons.History className="topIcon" />
            </div>

            <h3 className="historyTitleText"> Payment History</h3>
          </div>

          <div className="historyDateContainer">
            <p className="historyDate">Apr 20 - Apr 27</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbarButtons">
            <div className="exportContainer" ref={exportRef}>
              <button
                className="exportButton"
                onClick={() => setShowExport((prev) => !prev)}
              >
                Export ▼
              </button>
              {showExport && (
                <div className="exportDropdown">
                  <button onClick={exportToCSV}>Export all to CSV</button>
                  <button onClick={exportFilteredToCSV}>
                    Export filtered to CSV
                  </button>
                  <button onClick={exportAllToExcel}>
                    Export all to Excel
                  </button>
                  <button onClick={exportFilteredToExcel}>
                    Export filtered to Excel
                  </button>
                  <button onClick={exportToPDF}>Export to PDF</button>
                  <button onClick={() => printData(columns, rows)}>
                    share to print
                  </button>
                  <button onClick={() => emailData(columns, rows)}>
                    Share to Email
                  </button>
                  <button onClick={handlePrint}>Print</button>
                </div>
              )}
            </div>

            <div className="manageContainer" ref={manageRef}>
              <button
                className="manageButton"
                onClick={() => setShowManage((prev) => !prev)}
              >
                Manage ▼
              </button>
              {showManage && (
                <div className="manageDropdown">
                  {initialColumns.map((col, index) => (
                    <label key={col.field}>
                      <input
                        type="checkbox"
                        checked={columns.some((c) => c.field === col.field)}
                        onChange={() => toggleColumn(col.field)}
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="selectAllContainer">
              <button
                className="selectAllButton"
                onClick={toggleSelectAll}
                checked={selectAll}
              >
                Select All
              </button>
            </div>
          </div>

          <div className="buttonContainer">
            <button className="buttonItem">
              <Icons.Edit className="buttonIcon" />
            </button>
            <button className="buttonItem">
              <Icons.Option className="buttonIcon" />
            </button>
          </div>
        </div>
      </div>

      <div className="tableWrapper">
        {isCompactView ? (
          <div className="compactViewWrapper">
            {paginatedRows.map((row) => (
              <div
                className="compactCard swipeable"
                key={row.id}
                onClick={() => handleModalOpen(row)}
              >
                <div className="compactCardHeader">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      const updated = new Set(selectedRows);
                      updated.has(row.id)
                        ? updated.delete(row.id)
                        : updated.add(row.id);
                      setSelectedRows(updated);
                    }}
                  />
                  <strong>{row.usageId}</strong>
                </div>
                {columns.map((col) => (
                  <div className="compactCardItem" key={col.field}>
                    <span className="label">
                      <col.icon className="bGIcon" />
                      {col.label}:
                    </span>
                    <span className="value">
                      {col.field === "date"
                        ? formatDate(row)
                        : col.field === "voltage"
                        ? `${row[col.field]} kWh`
                        : col.field === "amount"
                        ? formatAmount(row[col.field])
                        : col.field === "update"
                        ? formatStatus(row[col.field])
                        : row[col.field]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <table className="customTable">
            <thead style={{ fontSize: "12px" }}>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                {columns.map((col, index) => (
                  <th
                    key={col.field}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    onClick={() => handleSort(col.field)}
                  >
                    {col.label}
                    {sortField === col.field
                      ? sortOrder === "asc"
                        ? " ▲"
                        : " ▼"
                      : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {paginatedRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => {
                        const updated = new Set(selectedRows);
                        if (updated.has(row.id)) updated.delete(row.id);
                        else updated.add(row.id);
                        setSelectedRows(updated);
                      }}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.field} onClick={() => handleModalOpen(row)}>
                      {col.field === "date" ? (
                        <span
                          className={`dateTransition ${
                            animateDate ? "slideOut" : "slideIn"
                          }`}
                        >
                          {`${row.time} | ${row.day}, the ${getDateSuffix(
                            row.date
                          )} of ${row.month}, ${row.year}`}
                        </span>
                      ) : col.field === "voltage" ? (
                        `${row[col.field]} kWh`
                      ) : col.field === "amount" ? (
                        formatAmount(row[col.field])
                      ) : col.field === "update" ? (
                        formatStatus(row[col.field])
                      ) : (
                        row[col.field]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="paginationControls">
        <div className="paginationButtons">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
      </div>

      {modalData && (
        <DetailModal
          data={modalData}
          onClose={handleModalClose}
          columns={columns}
        />
      )}
    </div>
  );
};

export default Table;
