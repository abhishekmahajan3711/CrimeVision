

// const data=[
//   {
//     "_id": "676e9304c8a1bea20495fa37",
//     "UserID": "674b27b75dd600ffd1329c67",
//     "PoliceStationID": "674dde5bf62a268693cf2371",
//     "AlertType": "Cybercrime",
//     "Time": "2025-01-06T01:31:24.543Z",
//     "Location": "Lat: 18.5962, Lng: 73.7595",
//     "Description": "Description for alert 12",
//     "Status": "Pending",
//     "ActionReport": "Action taken for alert 12",
//     "Image": null,
//     "Video": null,
//     "__v": "0",
//     "createdAt": "2024-12-27T11:44:04.600Z",
//     "updatedAt": "2025-01-03T13:38:13.104Z"
//   },
//   {
//     "_id": "676e9304c8a1bea20495fa3c",
//     "UserID": "674b27b75dd600ffd1329c67",
//     "PoliceStationID": "674dde5bf62a268693cf2371",
//     "AlertType": "Cybercrime",
//     "Time": "2025-02-19T20:05:54.857Z",
//     "Location": "Lat: 18.7373, Lng: 73.9895",
//     "Description": "Description for alert 17",
//     "Status": "Closed",
//     "ActionReport": "Action taken for alert 17",
//     "Image": null,
//     "Video": null,
//     "__v": "0",
//     "createdAt": "2024-12-27T11:44:04.600Z",
//     "updatedAt": "2025-01-03T13:38:13.196Z"
//   },
//   {
//     "_id": "676e9304c8a1bea20495fa45",
//     "UserID": "674b27b75dd600ffd1329c67",
//     "PoliceStationID": "674dde5bf62a268693cf2371",
//     "AlertType": "Sexual Harassment",
//     "Time": "2025-02-23T13:54:28.339Z",
//     "Location": "Lat: 18.4078, Lng: 73.8233",
//     "Description": "Description for alert 26",
//     "Status": "Pending",
//     "ActionReport": "Action taken for alert 26",
//     "Image": null,
//     "Video": null,
//     "__v": "0",
//     "createdAt": "2024-12-27T11:44:04.600Z",
//     "updatedAt": "2025-01-03T13:38:13.267Z"
//   },
//   {
//     "_id": "676e9304c8a1bea20495fa53",
//     "UserID": "674b27b75dd600ffd1329c67",
//     "PoliceStationID": "674dde5bf62a268693cf2371",
//     "AlertType": "Stalking",
//     "Time": "2025-02-12T18:53:48.801Z",
//     "Location": "Lat: 18.4508, Lng: 73.9020",
//     "Description": "Description for alert 40",
//     "Status": "Closed",
//     "ActionReport": "Action taken for alert 40",
//     "Image": null,
//     "Video": null,
//     "__v": "0",
//     "createdAt": "2024-12-27T11:44:04.601Z",
//     "updatedAt": "2025-01-03T13:38:13.327Z"
//   },
//   {
//     "_id": "676e9304c8a1bea20495fa31",
//     "UserID": "674b27b75dd600ffd1329c67",
//     "PoliceStationID": "674dde5bf62a268693cf2371",
//     "AlertType": "Cybercrime",
//     "Time": "2025-01-22T07:14:31.785Z",
//     "Location": "Lat: 18.7862, Lng: 73.7158",
//     "Description": "Description for alert 6",
//     "Status": "Closed",
//     "ActionReport": "Action taken for alert 6",
//     "Image": null,
//     "Video": null,
//     "__v": "0",
//     "createdAt": "2024-12-27T11:44:04.600Z",
//     "updatedAt": "2025-01-03T13:38:13.397Z"
//   },
//   {
//     "_id": "676e9304c8a1bea20495fa60",
//     "UserID": "674b27b75dd600ffd1329c67",
//     "PoliceStationID": "674dde5bf62a268693cf2371",
//     "AlertType": "Sexual Harassment",
//     "Time": "2025-03-01T17:32:12.743Z",
//     "Location": "Lat: 18.5674, Lng: 73.9218",
//     "Description": "Description for alert 53",
//     "Status": "Pending",
//     "ActionReport": "Action taken for alert 53",
//     "Image": null,
//     "Video": null,
//     "__v": "0",
//     "createdAt": "2024-12-27T11:44:04.601Z",
//     "updatedAt": "2025-01-03T13:38:13.474Z"
//   }
// ]
import React, { useState } from "react";
import { Link } from "react-router-dom";

const data = [
  {
    "_id": "676e9304c8a1bea20495fa37",
    "Time": "2025-01-06T01:31:24.543Z",
    "AlertType": "Cybercrime",
    "Status": "Pending",
  },
  {
    "_id": "676e9304c8a1bea20495fa3c",
    "Time": "2025-02-19T20:05:54.857Z",
    "AlertType": "Cybercrime",
    "Status": "Closed",
  },
  {
    "_id": "676e9304c8a1bea20495fa45",
    "Time": "2025-02-23T13:54:28.339Z",
    "AlertType": "Sexual Harassment",
    "Status": "Pending",
  },
  {
    "_id": "676e9304c8a1bea20495fa53",
    "Time": "2025-02-12T18:53:48.801Z",
    "AlertType": "Stalking",
    "Status": "Closed",
  },
  {
    "_id": "676e9304c8a1bea20495fa31",
    "Time": "2025-01-22T07:14:31.785Z",
    "AlertType": "Cybercrime",
    "Status": "Closed",
  },
  {
    "_id": "676e9304c8a1bea20495fa60",
    "Time": "2025-03-01T17:32:12.743Z",
    "AlertType": "Sexual Harassment",
    "Status": "Pending",
  },
];

const filterOptions = {
  time: ["Today", "Yesterday", "This Week"],
  status: ["Closed", "Pending"],
  alertType: [
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
  ],
};

function Alerts() {
  const [selectedTime, setSelectedTime] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAlertType, setSelectedAlertType] = useState("All");

  const filteredData = data.filter((alert) => {
    const alertDate = new Date(alert.Time);
    const today = new Date();

    const matchesTime =
      selectedTime === "Today"
        ? alertDate.toDateString() === today.toDateString()
        : selectedTime === "Yesterday"
        ? alertDate.toDateString() ===
          new Date(today.setDate(today.getDate() - 1)).toDateString()
        : true; // "This Week" or other cases

    const matchesStatus =
      selectedStatus === "All" || alert.Status === selectedStatus;

    const matchesAlertType =
      selectedAlertType === "All" || alert.AlertType === selectedAlertType;

    return matchesTime && matchesStatus && matchesAlertType;
  });

  return (
    <div className="w-3/4 mx-auto p-6">
      {/* Notification Section */}
      <div className="bg-red-600 text-white p-4 rounded-md text-center font-bold text-xl mb-6">
        Alerts
      </div>

      {/* Filter Section */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6">
        <div className="flex gap-4 flex-wrap">
          {/* Time Filter */}
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Time</option>
            {filterOptions.time.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Status</option>
            {filterOptions.status.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Alert Type Filter */}
          <select
            value={selectedAlertType}
            onChange={(e) => setSelectedAlertType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Alert Types</option>
            {filterOptions.alertType.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts List Section */}
      <div className="border border-gray-300 rounded-md p-4">
        <div className="grid grid-cols-5 font-bold text-gray-700 mb-4">
          <div>Time</div>
          <div>Date</div>
          <div>Status</div>
          <div>Alert Type</div>
          {/* <div>Details</div> */}
        </div>

        {filteredData.map((alert) => (
          <div
            key={alert._id}
            className="grid grid-cols-5 items-center text-gray-600 py-2 border-b"
          >
            <div>{new Date(alert.Time).toLocaleTimeString()}</div>
            <div>{new Date(alert.Time).toLocaleDateString()}</div>
            <div>{alert.Status}</div>
            <div>{alert.AlertType}</div>
            <Link to="/detail_case">
            <button className="text-blue-600 underline hover:text-blue-800">
              Details
            </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
