import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";
const data = [
  {
    _id: "676e9304c8a1bea20495fa37",
    Time: "2025-01-06T01:31:24.543Z",
    AlertType: "Cybercrime",
    Status: "Pending",
  },
  {
    _id: "676e9304c8a1bea20495fa3c",
    Time: "2025-02-19T20:05:54.857Z",
    AlertType: "Cybercrime",
    Status: "Closed",
  },
  {
    _id: "676e9304c8a1bea20495fa45",
    Time: "2025-02-23T13:54:28.339Z",
    AlertType: "Sexual Harassment",
    Status: "Pending",
  },
  {
    _id: "676e9304c8a1bea20495fa53",
    Time: "2025-02-12T18:53:48.801Z",
    AlertType: "Stalking",
    Status: "Closed",
  },
  {
    _id: "676e9304c8a1bea20495fa31",
    Time: "2025-01-22T07:14:31.785Z",
    AlertType: "Cybercrime",
    Status: "Closed",
  },
  {
    _id: "676e9304c8a1bea20495fa60",
    Time: "2025-03-01T17:32:12.743Z",
    AlertType: "Sexual Harassment",
    Status: "Pending",
  },
];

const FilterPoliceStation = () => {
   const { userInfo }=useUser();
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const crimeTypes = [
    "Murder",
    "Hit and Run",
    "Sexual Harassment",
    "Stalking",
    "Kidnapping",
    "Rape",
    "Fight",
    "Theft",
    "Robbery",
    "Fraud",
    "Cybercrime",
    "Accident",
    "Other",
  ];

  const filterData = () => {
    return data.filter((alert) => {
      const alertDate = new Date(alert.Time);

      const matchesType = !typeFilter || alert.AlertType === typeFilter;
      const matchesStatus = !statusFilter || alert.Status === statusFilter;
      const matchesDate =
        (!fromDate || alertDate >= new Date(fromDate)) &&
        (!toDate || alertDate <= new Date(toDate));

      return matchesType && matchesStatus && matchesDate;
    });
  };

  const filteredData = filterData();

  return (
    <div>
      <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
          Police Station : {userInfo.policeStation.name}
        </header>
      <div className="flex">
        {/* Sidebar Filters */}
        <div className="w-1/4 p-4 bg-gray-100">
          {/* Type of Crime Filter */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Type of Crime</label>
            <select
              className="w-full p-2 border rounded"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All</option>
              {crimeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Status</label>
            <select
              className="w-full p-2 border rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="p-2 border rounded w-1/2"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                className="p-2 border rounded w-1/2"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#003366] text-white">
                <th className="border border-gray-300 p-2">Case ID</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((alert) => (
                  <tr key={alert._id} className="text-center">
                    <td className="border border-gray-300 p-2">{alert._id}</td>
                    <td className="border border-gray-300 p-2">
                      {alert.AlertType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(alert.Time).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-2">{alert.Status}</td>
                    <td className="border border-gray-300 p-2 text-[#003366] underline cursor-pointer">
                      <Link to="/detail_case">Details</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-500"
                  >
                    No cases match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilterPoliceStation;
