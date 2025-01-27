import React from 'react';
import { Link } from 'react-router-dom';
import Alerts from '../Alerts/Alerts';
import { useUser } from '../UserContext/UserContext';

export default function PoliceHomePage() {
  const { userInfo } = useUser();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Full Screen Container */}
      <div className="w-full h-screen bg-green-50 flex flex-col">
        {/* Header Section */}
        <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
          Police Station : {userInfo.policeStation.name}
        </header>

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Left Panel */}
          <div className="w-1/4 bg-gray-100 p-4">
            <Link to="/police_DA">
              <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
                Data Visualisation
              </button>
            </Link>
            <Link to="/police_filter_cases">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
              List of Cases (Filter)
            </button>
            </Link>
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
              Crime Prediction
            </button>
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
               Warnings
            </button>
            <Link to="/aboutme_policestation">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
               About Me
            </button>
            </Link>
          </div>

          {/* Right Panel */}
           <Alerts />
        </div>
      </div>
    </div>
  );
}
