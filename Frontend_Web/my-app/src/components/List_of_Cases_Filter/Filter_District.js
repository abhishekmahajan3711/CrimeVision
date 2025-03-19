import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";

const data = [
  {
    _id: "676e9304c8a1bea20495fa37",
    Time: "2025-01-06T01:31:24.543Z",
    AlertType: "Cybercrime",
    Status: "Pending",
    PoliceStation: "Nigdi Police Station",
    Priority: "High",
  },
  {
    _id: "676e9304c8a1bea20495fa3c",
    Time: "2025-02-19T20:05:54.857Z",
    AlertType: "Cybercrime",
    Status: "Closed",
    PoliceStation: "Kondhwa Police Station",
    Priority: "Medium",
  },
  {
    _id: "676e9304c8a1bea20495fa45",
    Time: "2025-02-23T13:54:28.339Z",
    AlertType: "Sexual Harassment",
    Status: "Pending",
    PoliceStation: "Hadapsar Police Station",
    Priority: "High",
  },
  {
    _id: "676e9304c8a1bea20495fa53",
    Time: "2025-02-12T18:53:48.801Z",
    AlertType: "Stalking",
    Status: "Closed",
    PoliceStation: "Khadki Police Station",
    Priority: "Low",
  },
  {
    _id: "676e9304c8a1bea20495fa31",
    Time: "2025-01-22T07:14:31.785Z",
    AlertType: "Cybercrime",
    Status: "Closed",
    PoliceStation: "Nigdi Police Station",
    Priority: "Medium",
  },
  {
    _id: "676e9304c8a1bea20495fa60",
    Time: "2025-03-01T17:32:12.743Z",
    AlertType: "Sexual Harassment",
    Status: "Pending",
    PoliceStation: "Kondhwa Police Station",
    Priority: "High",
  },
];

const Filter_District = () => {
  const { userInfo } = useUser();
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [policeStationFilter, setPoliceStationFilter] = useState("");

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

  const priorities = ["High", "Medium", "Low"];

  // Extract unique police station names from data
  const uniquePoliceStations = [...new Set(data.map((alert) => alert.PoliceStation))];

  const filterData = () => {
    return data.filter((alert) => {
      const alertDate = new Date(alert.Time);

      const matchesType = !typeFilter || alert.AlertType === typeFilter;
      const matchesStatus = !statusFilter || alert.Status === statusFilter;
      const matchesDate =
        (!fromDate || alertDate >= new Date(fromDate)) &&
        (!toDate || alertDate <= new Date(toDate));
      const matchesPriority = !priorityFilter || alert.Priority === priorityFilter;
      const matchesPoliceStation = !policeStationFilter || alert.PoliceStation === policeStationFilter;
      
      return matchesType && matchesStatus && matchesDate && matchesPriority && matchesPoliceStation;
    });
  };

  const filteredData = filterData();

  return (
    <div>
      <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
        Cases
      </header>
      <div className="flex">
        <div className="w-1/4 p-4 bg-gray-100">
          <div className="mb-4">
            <label className="block font-bold mb-2">Type of Crime</label>
            <select
              className="w-full p-2 border rounded"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All</option>
              {crimeTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

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
              <option value="Open">Open</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Priority</label>
            <select className="w-full p-2 border rounded" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All</option>
              {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </div>

          {/* Police Station Filter */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Police Station</label>
            <select
              className="w-full p-2 border rounded"
              value={policeStationFilter}
              onChange={(e) => setPoliceStationFilter(e.target.value)}
            >
              <option value="">All</option>
              {uniquePoliceStations.map((station) => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>

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

        <div className="w-3/4 p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#003366] text-white">
                <th className="border border-gray-300 p-2">Case ID</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Police Station</th>
                <th className="border border-gray-300 p-2">Priority</th>
                <th className="border border-gray-300 p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((alert) => (
                  <tr key={alert._id} className="text-center">
                    <td className="border border-gray-300 p-2">{alert._id}</td>
                    <td className="border border-gray-300 p-2">{alert.AlertType}</td>
                    <td className="border border-gray-300 p-2">{new Date(alert.Time).toLocaleDateString()}</td>
                    <td className="border border-gray-300 p-2">{alert.Status}</td>
                    <td className="border border-gray-300 p-2">{alert.PoliceStation}</td>
                    <td className="border border-gray-300 p-2">{alert.Priority}</td>
                    <td className="border border-gray-300 p-2 text-[#003366] underline cursor-pointer">
                      <Link to="/detail_case">Details</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
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

export default Filter_District;
