import React from "react";

export default function Notifications() {
  return (
      <div className="w-3/4 p-6">
        {/* Notification Section */}
        <div className="bg-[#d32f2f] text-white p-4 rounded-md text-center font-bold mb-6">
          Notifications (Warnings)
        </div>

        {/* Filter and Today Section */}
        <div className="flex items-center p-4 mb-6">
          <button className="text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">
            Filter
          </button>
          <div className="ml-4 bg-gray-200 py-2 px-4 rounded-md shadow-md">
            Today
          </div>
        </div> 
      </div>
  );
}
