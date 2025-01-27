import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Filter_District() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null); // Close the dropdown if it's already open
    } else {
      setActiveDropdown(dropdown); // Open the clicked dropdown
    }
  };

  const closeDropdowns = (event) => {
    if (!event.target.closest(".dropdown")) {
      setActiveDropdown(null); // Close all dropdowns when clicking outside
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns); // Cleanup on component unmount
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div className="w-full bg-[#003366] text-white p-4 text-center text-xl font-bold">
        Police Station Name : Nigdi Police Station
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 p-4">
          <div className="mb-4 dropdown relative">
            <button
              className="w-full bg-[#ffcc00] text-black font-bold py-2 rounded"
              onClick={() => toggleDropdown("cases")}
            >
              Type of Cases
            </button>
            {activeDropdown === "cases" && (
              <div className="dropdown-content bg-gray-200 mt-2 ml-4 p-2 rounded">
                <div className="text-black">Murder</div>
                <div className="text-black">Hit and Run</div>
                <div className="text-black">Sexual Harassment</div>
                <div className="text-black">Stalking</div>
                <div className="text-black">Kidnapping</div>
                <div className="text-black">Rape</div>
                <div className="text-black">Fight</div>
                <div className="text-black">Theft</div>
                <div className="text-black">Robbery</div>
                <div className="text-black">Fraud</div>
                <div className="text-black">Cybercrime</div>
                <div className="text-black">Accident</div>
                <div className="text-black">Other</div>
              </div>
            )}
          </div>

          <div className="mb-4 dropdown relative">
            <button
              className="w-full bg-[#ffcc00] text-black font-bold py-2 rounded"
              onClick={() => toggleDropdown("status")}
            >
              Status
            </button>
            {activeDropdown === "status" && (
              <div className="dropdown-content bg-gray-200 mt-2 ml-4 p-2 rounded">
                <div className="text-black">Open</div>
                <div className="text-black">In-progress</div>
                <div className="text-black">Closed</div>
              </div>
            )}
          </div>

          <div className="dropdown relative">
            <button
              className="w-full bg-[#ffcc00] text-black font-bold py-2 rounded"
              onClick={() => toggleDropdown("period")}
            >
              Period
            </button>
            {activeDropdown === "period" && (
              <div className="dropdown-content bg-gray-200 mt-2 ml-4 p-2 rounded">
                <div className="text-black">Today</div>
                <div className="text-black">Week</div>
                <div className="text-black">Month</div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-3/4 p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#003366] text-white">
                <th className="border border-gray-300 p-2">Case Id</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "R52",
                  type: "Robbery",
                  date: "3/04/2024",
                  status: "Solved",
                },
                {
                  id: "R53",
                  type: "Robbery",
                  date: "10/04/2024",
                  status: "Solved",
                },
                {
                  id: "R54",
                  type: "Robbery",
                  date: "19/04/2024",
                  status: "Solved",
                },
                {
                  id: "R55",
                  type: "Robbery",
                  date: "18/04/2024",
                  status: "Solved",
                },
                {
                  id: "R56",
                  type: "Robbery",
                  date: "25/04/2024",
                  status: "Solved",
                },
              ].map((caseItem, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{caseItem.id}</td>
                  <td className="border border-gray-300 p-2">
                    {caseItem.type}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {caseItem.date}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {caseItem.status}
                  </td>
                  <Link to="/detail_case">
                    <td className="border border-gray-300 p-2 text-[#003366] underline cursor-pointer">
                      Details
                    </td>
                  </Link>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
