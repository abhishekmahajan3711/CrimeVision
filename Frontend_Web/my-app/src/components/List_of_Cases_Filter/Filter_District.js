import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";
import axios from "axios";

const FilterPoliceStation = () => {
  const { userInfo } = useUser();
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [policeStationFilter, setPoliceStationFilter] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [policeStations, setPoliceStations] = useState([]);

  useEffect(() => {
    fetchPoliceStations();
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [typeFilter, statusFilter, fromDate, toDate, priorityFilter, policeStationFilter]);

  const fetchPoliceStations = async () => {
    try {
      const response = await axios.get(`https://crimevision.onrender.com/api/v1/web/${userInfo.district._id}`);
      setPoliceStations(response.data);
    } catch (error) {
      console.error("Error fetching police stations:", error);
    }
  };


  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://crimevision.onrender.com/api/v1/web/filter_alerts_district", {
        params: {
          policeStationID: policeStationFilter || "674dde5bf62a268693cf2371",
          type: typeFilter,
          status: statusFilter,
          fromDate: fromDate,
          toDate: toDate,
          priority: priorityFilter,
        },
      });
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-0">
      <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
        Police Station : {userInfo.district.name}
      </header>
      <div className="flex">
        <div className="w-1/4 p-4 bg-gray-100">
          {/* Police Station Filter */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Police Station</label>
            <select
              className="w-full p-2 border rounded"
              value={policeStationFilter}
              onChange={(e) => setPoliceStationFilter(e.target.value)}
            >
              <option value="">All</option>
              {policeStations.map((station) => (
                <option key={station._id} value={station._id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          {/* Other Filters */}
          <div className="mb-4">
            <label className="block font-bold mb-2">Type of Crime</label>
            <select className="w-full p-2 border rounded" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All</option>
              {["Murder", "Hit and Run", "Sexual Harassment", "Stalking", "Kidnapping", "Rape", "Fight", "Theft", "Robbery", "Fraud", "Cybercrime", "Accident", "Other"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Status</label>
            <select className="w-full p-2 border rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
              {["High", "Medium", "Low"].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Date Range</label>
            <div className="flex gap-2">
              <input type="date" className="p-2 border rounded w-1/2" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <input type="date" className="p-2 border rounded w-1/2" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="w-3/4 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-[50vh] w-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin h-12 w-12 border-4 border-gray-300 rounded-full border-t-black"></div>
                <p className="text-black text-lg mt-4 font-medium">LOADING...</p>
              </div>
            </div>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#003366] text-white">
                  <th className="border border-gray-300 p-2">Case ID</th>
                  <th className="border border-gray-300 p-2">Type</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Priority</th>
                  <th className="border border-gray-300 p-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <tr key={alert._id} className="text-center">
                      <td className="border border-gray-300 p-2">{alert._id}</td>
                      <td className="border border-gray-300 p-2">{alert.AlertType}</td>
                      <td className="border border-gray-300 p-2">{new Date(alert.Time).toLocaleDateString()}</td>
                      <td className="border border-gray-300 p-2">{alert.Status}</td>
                      <td className="border border-gray-300 p-2">{alert.Priority}</td>
                      <td className="border border-gray-300 p-2">
                        <NavLink to={`/detail_case1/${alert._id}`}>
                        <button className="text-blue-600 underline hover:text-blue-800">
                            Details
                        </button></NavLink>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6">No cases found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPoliceStation;
