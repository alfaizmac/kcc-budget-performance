import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { fetchSpreadsheetData, getUniqueCenters } from "./fetchSpreadsheetData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [centers, setCenters] = useState([]);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);

  const handleFetchData = async () => {
    if (!spreadsheetUrl) return;
    try {
      const data = await fetchSpreadsheetData(spreadsheetUrl);
      setFetchedData(data);
      const uniqueCenters = getUniqueCenters(data);
      setCenters(uniqueCenters);
    } catch (error) {
      console.error("Error fetching spreadsheet data:", error);
    }
  };

  useEffect(() => {
    if (selectedCenter && fetchedData.length > 0) {
      const headers = fetchedData[0];
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const centerIndex = 4;
      const filteredData = fetchedData.filter(
        (row) => row[centerIndex] === selectedCenter
      );

      const monthlyData = monthNames.map((month) => {
        const budgetIndex = headers.indexOf(`${month}_Budget`);
        const actualIndex = headers.indexOf(`${month}_Actual`);
        const varianceIndex = headers.indexOf(`${month}_Variance`);

        const totalBudget = filteredData.reduce(
          (sum, row) => sum + (parseFloat(row[budgetIndex]) || 0),
          0
        );
        const totalActual = filteredData.reduce(
          (sum, row) => sum + (parseFloat(row[actualIndex]) || 0),
          0
        );
        const totalVariance = filteredData.reduce(
          (sum, row) => sum + (parseFloat(row[varianceIndex]) || 0),
          0
        );

        return {
          name: month,
          budget: totalBudget,
          actual: totalActual,
          variance: totalVariance,
        };
      });

      setChartData(monthlyData);
    }
  }, [selectedCenter, fetchedData]);

  return (
    <div className="dashboard">
      <h1>Overall Analytics</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter :</label>
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
        >
          <option value="" disabled>
            Select Center
          </option>
          {centers.map((center, index) => (
            <option key={index} value={center}>
              {center}
            </option>
          ))}
        </select>
      </div>
      <br />
      {/* Overall Analytics Graph */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="#ff7f0e"
              strokeWidth={3}
              name="Budget"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2ca02c"
              strokeWidth={3}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="variance"
              stroke="#d62728"
              strokeWidth={3}
              name="Variance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Floating Button for Opening Modal */}
      <button className="open-modal-btn">
        <svg
          width="100"
          height="100"
          fill="#2a5ed4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2ZM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5Z"></path>
        </svg>
      </button>
    </div>
  );
}

export default Dashboard;
