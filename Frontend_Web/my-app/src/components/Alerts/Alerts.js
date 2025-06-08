

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

const filterOptions = {
  time: ["Today", "Yesterday", "This Week"],
  status: ["Closed", "Pending","Open"],
  alertType: [
    "Murder", "Hit and Run", "Sexual Harassment", "Stalking", "Kidnapping", "Rape", "Fight", "Theft", "Robbery", "Fraud", "Cybercrime", "Accident", "Other"
  ],
};

function Alerts({PoliceStationID}) {
  const [alerts, setAlerts] = useState([]);
  const [selectedTime, setSelectedTime] = useState("This Week");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAlertType, setSelectedAlertType] = useState("All");

  useEffect(() => {
    fetchAlerts();
  }, [selectedTime, selectedStatus, selectedAlertType]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get("https://crimevision.onrender.com/api/v1/web/get_alerts", {
        params: {
          time: selectedTime,
          status: selectedStatus,
          alertType: selectedAlertType,
          PoliceStationID: PoliceStationID,
        },
      });
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts", error);
    }
  };

  return (
    <div className="bg-green-50 w-3/4 mx-auto p-6">
      <div className="bg-red-600 text-white p-4 rounded-md text-center font-bold text-xl mb-6">
        Alerts
      </div>

      <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6 flex gap-4 flex-wrap">
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="p-2 border border-gray-300 rounded-md">
          <option value="All">All Time</option>
          {filterOptions.time.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="p-2 border border-gray-300 rounded-md">
          <option value="All">All Status</option>
          {filterOptions.status.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select value={selectedAlertType} onChange={(e) => setSelectedAlertType(e.target.value)} className="p-2 border border-gray-300 rounded-md">
          <option value="All">All Alert Types</option>
          {filterOptions.alertType.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="border border-gray-300 rounded-md p-4">
        <div className="grid grid-cols-5 font-bold text-gray-700 mb-4">
          <div>Time</div>
          <div>Date</div>
          <div>Status</div>
          <div>Alert Type</div>
        </div>

        {alerts.map((alert) => (
          <div key={alert._id} className="grid grid-cols-5 items-center text-gray-600 py-2 border-b">
            <div>{new Date(alert.Time).toLocaleTimeString()}</div>
            <div>{new Date(alert.Time).toLocaleDateString()}</div>
            <div>{alert.Status}</div>
            <div>{alert.AlertType}</div>
            {/* <Link to="/detail_case"> */}
            <NavLink to={`/detail_case2/${alert._id}`}>
              <button className="text-blue-600 underline hover:text-blue-800">Details</button>
            </NavLink>
            {/* </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
