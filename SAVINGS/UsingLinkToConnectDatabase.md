import React, { useState } from "react";

const App = () => {
const [spreadsheetLink, setSpreadsheetLink] = useState("");
const [csvUrl, setCsvUrl] = useState("");
const [filteredData, setFilteredData] = useState(null);

const convertToCsvUrl = (link) => {
if (link.includes("/edit?")) {
return link.replace("/edit?", "/pub?output=csv");
} else if (link.includes("/pubhtml")) {
return link.replace("/pubhtml", "/pub?output=csv");
} else {
alert("Invalid Google Spreadsheet link. Make sure it's published.");
return "";
}
};

const handleFetchData = async () => {
const convertedUrl = convertToCsvUrl(spreadsheetLink);
if (!convertedUrl) return;

    setCsvUrl(convertedUrl);

    try {
      const response = await fetch(convertedUrl);
      const text = await response.text();

      // Convert CSV to JSON
      const rows = text.split("\n").map((row) => row.split(","));
      const headers = rows[0].map((header) => header.trim()); // Trim headers
      const jsonData = rows.slice(1).map((row) => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] ? row[index].trim() : ""; // Trim values
        });
        return obj;
      });

      // Filter row where ID === "ID_001"
      const selectedRow = jsonData.find((row) => row["ID"] === "ID_002");

      setFilteredData(selectedRow || { message: "ID_001 not found" });
    } catch (error) {
      console.error("Error fetching CSV:", error);
    }

};

return (
<div style={{ padding: "20px" }}>
<h2>Google Spreadsheet Data Viewer</h2>
<input
type="text"
placeholder="Enter Google Spreadsheet link..."
value={spreadsheetLink}
onChange={(e) => setSpreadsheetLink(e.target.value)}
style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
/>
<br />
<button onClick={handleFetchData} style={{ padding: "10px 20px" }}>
Load Data
</button>

      {csvUrl && (
        <p>
          <strong>CSV URL:</strong>{" "}
          <a href={csvUrl} target="_blank" rel="noopener noreferrer">
            {csvUrl}
          </a>
        </p>
      )}

      {filteredData ? (
        <pre
          style={{ textAlign: "left", background: "#f4f4f4", padding: "10px" }}
        >
          {JSON.stringify(filteredData, null, 2)}
        </pre>
      ) : (
        <p>No data loaded yet.</p>
      )}
    </div>

);
};

export default App;
