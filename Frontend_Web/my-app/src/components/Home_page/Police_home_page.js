import React from 'react';
import { Link , useNavigate} from 'react-router-dom';
import Alerts from '../Alerts/Alerts';
import { useUser } from '../UserContext/UserContext';
import { LogOut } from "lucide-react"; // Logout icon

export default function PoliceHomePage() {
  const { userInfo } = useUser();
  const navigate = useNavigate();

   // Logout function
   const handleLogout = () => {
    localStorage.removeItem("Authority_token"); // Remove token from localStorage
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Full Screen Container */}
      <div className="w-full h-screen bg-green-50 flex flex-col">
        {/* Header Section */}
        <header className="bg-[#003366] text-white p-4 font-bold text-lg flex items-center justify-between relative">
          {/* Centered District Name */}
          <span className="absolute left-1/2 transform -translate-x-1/2">
          Police Station : {userInfo.policeStation.name}
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-500 px-3 py-1 rounded-md hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 text-white" /> {/* Smaller Logout Icon */}
          </button>
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
            <Link to="/crime_prediction_police">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
              Crime Prediction
            </button>
            </Link>
            <Link to="/warnings">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
               Warnings
            </button>
            </Link>
            <Link to="/aboutme_policestation">
            <button className="w-full bg-[#ffcc00] text-black py-2 mb-4 rounded-md font-semibold hover:bg-yellow-600">
               About Me
            </button>
            </Link>
          </div>

          {/* Right Panel */}
           <Alerts PoliceStationID={userInfo.policeStation._id} />
        </div>
      </div>
    </div>
  );
}
