import React, { useState } from "react";
import { Link } from "react-router-dom";
const nigdiNotifications = [
  {
    id: 1,
    policeStation: "Nidgi Police Station",
    openCases: 5,
    pendingCases: 2,
    highPriority: 5,
    mediumPriority: 1,
    lowPriority: 1,
    time: "2025-02-17T08:30:00Z",
    caseIds: [
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
    ],
    reason:
      "Cases which are high priority and open are greater than 5 since last 7 days",
    type: "Warning",
    timeRemaining: "5 hr",
  },
  {
    id: 2,
    policeStation: "Nidgi Police Station",
    openCases: 2,
    pendingCases: 7,
    highPriority: 8,
    mediumPriority: 1,
    lowPriority: 0,
    time: "2025-02-18T10:00:00Z",
    caseIds: [
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
      "676e9304c8a1bea20495fa37",
    ],
    reason:
      "Cases which are high priority and pending are greater than 15 since last 25 days",
    type: "Notification",
    timeRemaining: "0 hr",
  },
];

export default function Warnings() {
  const [filterType, setFilterType] = useState("All");

  const filteredNotifications =
    filterType === "All"
      ? nigdiNotifications
      : nigdiNotifications.filter((n) => n.type === filterType);

  return (
    <div className="flex">
      {/* Left Panel */}
      <aside className="bg-[#d3dce7] text-white w-64 p-4 min-h-screen">
        
        <button
          className={`w-full py-2 mb-4 rounded-lg font-semibold ${
            filterType === "Notification"
              ? "bg-yellow-400 text-black"
              : "bg-yellow-600"
          }`}
          onClick={() => setFilterType("Notification")}
        >
          Notifications
        </button>
        <button
          className={`w-full py-2 rounded-lg font-semibold ${
            filterType === "Warning"
              ? "bg-red-600"
              : "bg-red-400 text-black"
          }`}
          onClick={() => setFilterType("Warning")}
        >
          Warnings
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-[#002855] text-white p-4 font-bold text-lg shadow-md text-center mb-4">
          Warnings and Notification to District Officer
        </header>
         
         <div className="pl-6 pr-6">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-xl shadow-lg mb-6 border-l-8 transition-all duration-300 ${
              notification.type === "Warning"
                ? "border-red-500 bg-red-100"
                : "border-yellow-500 bg-yellow-100"
            }`}
          >
            <p className="text-base mb-3 text-gray-800">
              <b>{notification.type}:</b> {notification.reason}
            </p>

            <div className="grid grid-cols-6 font-semibold text-gray-700 mb-2 text-center bg-gray-200 rounded-lg py-1 text-sm">
              <div>Open Cases</div>
              <div>Pending Cases</div>
              <div>High Priority</div>
              <div>Medium Priority</div>
              <div>Low Priority</div>
              <div>Date</div>
            </div>

            <div className="grid grid-cols-6 items-center text-gray-800 py-2 text-center bg-gray-50 rounded-lg text-sm">
              <div className="text-red-600 font-semibold">
                {notification.openCases}
              </div>
              <div className="text-yellow-500 font-semibold">
                {notification.pendingCases}
              </div>
              <div className="text-red-700 font-semibold">
                {notification.highPriority}
              </div>
              <div className="text-orange-500 font-semibold">
                {notification.mediumPriority}
              </div>
              <div className="text-green-600 font-semibold">
                {notification.lowPriority}
              </div>
              <div>{new Date(notification.time).toLocaleDateString()}</div>
            </div>

            <div className="mt-3">
              <h3 className="font-bold text-gray-800 mb-2 text-sm">Case IDs:</h3>
              <div className="flex flex-wrap gap-2">
                {notification.caseIds.map((caseId) => (
                  <Link to="/detail_case">
                    <p className="text-[#003366] underline cursor-pointer">{caseId}</p></Link>
                ))}
              </div>
            </div>

            <div className="mt-3 text-right text-gray-600 italic text-xs">
              Time Remaining: {notification.timeRemaining}
            </div>
          </div>
        ))}
        </div>
      </main>
    </div>
  );
}
