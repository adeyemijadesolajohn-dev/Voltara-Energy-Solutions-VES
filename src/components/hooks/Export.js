export const formatDateTime = (row) => {
  const convertTo24Hour = (time) => {
    const [h, m, part] = time.match(/(\d+):(\d+) (AM|PM)/i).slice(1);
    let hour = parseInt(h, 10);
    if (part.toUpperCase() === "PM" && hour < 12) hour += 12;
    if (part.toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${m}`;
  };

  const day = String(row.date).padStart(2, "0");
  const monthIndex = new Date(`${row.month} 1, ${row.year}`).getMonth();
  const month = String(monthIndex + 1).padStart(2, "0");
  const time24 = convertTo24Hour(row.time);
  return `${time24} | ${day}/${month}/${row.year}`;
};

export function formatTimeDate(row) {
  const day = String(row.date).padStart(2, "0");
  const monthIndex = new Date(`${row.month} 1, ${row.year}`).getMonth();
  const month = String(monthIndex + 1).padStart(2, "0");
  const [h, m, part] = row.time.match(/(\d+):(\d+) (AM|PM)/i).slice(1);
  let hour = parseInt(h, 10);
  if (part.toUpperCase() === "PM" && hour < 12) hour += 12;
  if (part.toUpperCase() === "AM" && hour === 12) hour = 0;
  const time24 = `${String(hour).padStart(2, "0")}:${m}`;
  return `${time24} | ${day}/${month}/${row.year}`;
}

// exportUtils.js
export const formatCellValue = (col, row) => {
  const value = row[col.field];
  if (col.field === "date") return formatDate(row);
  if (["purchased", "usage", "remaining", "voltage"].includes(col.field))
    return `${value} kWh`;
  if (col.field === "amount")
    return `₦${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;
  return value;
};

const formatDate = (row) =>
  new Date(row.date || row.timestamp || row.createdAt).toLocaleString();

export const exportToCSV = ({ columns, rows, filename = "data.csv" }) => {
  const csv = [
    columns.map((col) => col.label).join(","),
    ...rows.map((row) =>
      columns.map((col) => formatCellValue(col, row)).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportToExcel = ({ columns, rows, filename = "data.xls" }) => {
  const headerStyle =
    'style="font-weight:bold; background:#f0f0f0; border:1px solid #ccc;"';
  const cellStyle = 'style="border:1px solid #ccc; padding:4px;"';

  const headers = columns
    .map((col) => `<th ${headerStyle}>${col.label}</th>`)
    .join("");

  const body = rows
    .map((row) => {
      return `<tr>${columns
        .map((col) => `<td ${cellStyle}>${formatCellValue(col, row)}</td>`)
        .join("")}</tr>`;
    })
    .join("");

  const html = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportToPDF = ({
  columns,
  rows,
  filename = "report.pdf",
  logoUrl = "",
  watermark = "Voltara",
  groupBy = null,
}) => {
  const grouped = groupBy
    ? rows.reduce((acc, row) => {
        const key = row[groupBy] || "Others";
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {})
    : { All: rows };

  const tableSections = Object.entries(grouped)
    .map(([groupName, groupRows], idx) => {
      const header = columns.map((col) => `<th>${col.label}</th>`).join("");
      const body = groupRows
        .map(
          (row) =>
            `<tr>${columns
              .map((col) => `<td>${formatCellValue(col, row)}</td>`)
              .join("")}</tr>`
        )
        .join("");

      return `
        <div class="groupSection">
          ${groupBy ? `<h3 class="groupHeader">${groupName}</h3>` : ""}
          <table>
            <thead><tr>${header}</tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>
        ${
          idx < Object.entries(grouped).length - 1
            ? '<div class="page-break"></div>'
            : ""
        }
      `;
    })
    .join("");

  const html = `
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
        ${logoUrl ? `<img class="logo" src="${logoUrl}" />` : ""}
        ${watermark ? `<div class="watermark">${watermark}</div>` : ""}
        ${tableSections}
        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "", "width=1000,height=700");
  printWindow.document.write(html);
  printWindow.document.close();
};

export const emailData = ({ columns, rows, recipient = "", subject }) => {
  const body = [
    columns.map((col) => col.label).join(", "),
    ...rows.map((row) =>
      columns.map((col) => formatCellValue(col, row)).join(", ")
    ),
  ].join("\n");

  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.open(mailto, "_blank");
};

export const printData = ({ columns, rows }) => {
  const table = [
    "<table border='1'><thead><tr>",
    columns.map((col) => `<th>${col.label}</th>`).join(""),
    "</tr></thead><tbody>",
    ...rows.map(
      (row) =>
        `<tr>${columns
          .map((col) => `<td>${formatCellValue(col, row)}</td>`)
          .join("")}</tr>`
    ),
    "</tbody></table>",
  ].join("");

  const win = window.open("", "", "width=800,height=600");
  win.document.write(
    `<html><head><title>Print</title></head><body>${table}</body></html>`
  );
  win.document.close();
  win.print();
};
