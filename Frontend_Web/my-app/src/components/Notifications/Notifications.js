import React, { useState } from "react";

const filterOptions = {
  time: ["Today", "Yesterday", "This Week"],
  policeStation: [
    "Nidgi Police Station",
    "Hadapsar Police Station",
    "Kondhwa Police Station",
    "Khadki Police Station",
  ],
};

const dummyWarnings = [
  {
    id: 1,
    policeStation: "Khadki Police Station",
    openCases: 15,
    pendingCases: 2,
    highPriority: 10,
    mediumPriority: 4,
    lowPriority: 1,
    time: "2025-02-16T08:30:00Z",
    caseIds: ["C123", "C124", "C125"],
  },
  {
    id: 1,
    policeStation: "Nidgi Police Station",
    openCases: 5,
    pendingCases: 2,
    highPriority: 5,
    mediumPriority: 1,
    lowPriority: 1,
    time: "2025-02-17T08:30:00Z",
    caseIds: ["C123", "C124", "C125"],
  },
  {
    id: 2,
    policeStation: "Hadapsar Police Station",
    openCases: 8,
    pendingCases: 4,
    highPriority: 6,
    mediumPriority: 4,
    lowPriority: 2,
    time: "2025-02-16T10:00:00Z",
    caseIds: ["C126", "C127"],
  },
];

function isWithinTimeRange(time, selectedTime) {
  const currentTime = new Date();
  const warningTime = new Date(time);

  switch (selectedTime) {
    case "Today":
      return (
        warningTime.toDateString() === currentTime.toDateString()
      );
    case "Yesterday":
      const yesterday = new Date();
      yesterday.setDate(currentTime.getDate() - 1);
      return warningTime.toDateString() === yesterday.toDateString();
    case "This Week":
      // const weekStart = new Date();
      // weekStart.setDate(currentTime.getDate() - currentTime.getDay());
      // return warningTime >= weekStart;
      return true;
    default:
      return true;
  }
}

export default function Notifications() {
  const [selectedTime, setSelectedTime] = useState("This Week");
  const [selectedPoliceStation, setSelectedPoliceStation] = useState("All");

  const filteredWarnings = dummyWarnings.filter((warning) => {
    const matchesTime = selectedTime === "All" || isWithinTimeRange(warning.time, selectedTime);
    const matchesStation =
      selectedPoliceStation === "All" ||
      warning.policeStation === selectedPoliceStation;
    return matchesTime && matchesStation;
  });

  return (
    <div className="bg-green-50 w-3/4 mx-auto p-6">
      <div className="bg-red-600 text-white p-4 rounded-md text-center font-bold text-xl mb-6">
        Notifications
      </div>

      <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6 flex gap-4 flex-wrap">
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          {filterOptions.time.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={selectedPoliceStation}
          onChange={(e) => setSelectedPoliceStation(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="All">All Police Stations</option>
          {filterOptions.policeStation.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-gray-300 rounded-md p-4">
        <div className="grid grid-cols-8 font-bold text-gray-700 mb-4 divide-x divide-gray-300">
          <div className="text-center">Police Station</div>
          <div className="text-center">Date</div>
          <div className="text-center">Open Cases</div>
          <div className="text-center">Pending Cases</div>
          <div className="text-center">High Priority</div>
          <div className="text-center">Medium Priority</div>
          <div className="text-center">Low Priority</div>
          <div className="text-center">Actions</div>
        </div>

        {filteredWarnings.map((warning) => (
          <div
            key={warning.id}
            className="grid grid-cols-8 items-center text-gray-600 py-2 border-t divide-x divide-gray-300"
          >
            <div className="text-center">{warning.policeStation}</div>
            <div className="text-center">{new Date(warning.time).toLocaleDateString()}</div>
            <div className="text-center">{warning.openCases}</div>
            <div className="text-center">{warning.pendingCases}</div>
            <div className="text-center">{warning.highPriority}</div>
            <div className="text-center">{warning.mediumPriority}</div>
            <div className="text-center">{warning.lowPriority}</div>
            <button className="text-blue-600 underline hover:text-blue-800">Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
