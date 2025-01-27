import React from 'react';
import { Link } from 'react-router-dom';
import Notifications from '../Notifications/Notifications';

export default function District_home_page() {
  const userInfo = {
    name: 'Gita Kumari',
    email: 'gita.kumari@example.com',
    phone: '1234567890',
    district: {
      name: 'Nigdi District',
      no_of_cases_this_month: 15,
      no_of_cases_last_month: 20,
    },
    policeStation: {
      name: 'Nigdi Police Station',
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Full Screen Container */}
      <div className="w-full h-screen bg-green-50 flex flex-col">
        {/* Header Section */}
        <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
          District : Pune
        </header>

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Left Panel */}
          <div className="w-1/4 bg-gray-100 p-4">
            <Link to="/district_DA">
              <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
                Data Visualisation
              </button>
            </Link>
            <Link to="/district_filter_cases">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
              List of Cases (Filter)
            </button>
            </Link>
            <Link to="/list_of_police_stations">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
               List of Police Stations
            </button>
            </Link>
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
               List of Notifications (Warnings)
            </button>
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
              Crime Prediction
            </button>
            <Link to="/aboutme_district">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
               About Me
            </button>
            </Link>
          </div>

          {/* Right Panel */}
           <Notifications />
        </div>
      </div>
    </div>
  );
}
