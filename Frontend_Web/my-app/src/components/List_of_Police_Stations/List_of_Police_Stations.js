import React from 'react';

export default function List_of_Police_Stations() {
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-[#003366] text-white text-center py-4">
        <h1 className="text-lg font-bold uppercase">List of Police Stations</h1>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto my-8 bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-3">
          {/* Left Section */}
          <div className="col-span-2 p-6 space-y-6">
            {/* Case Info */}
            <div className="bg-green-200 p-4 rounded-lg border border-green-500">
              <p className="text-lg font-semibold text-gray-800">
                Police Station: <span className="font-normal">Nigdi</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Type of Case: <span className="font-normal">Robbery</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Name of Case: <span className="font-normal">Robbery by shkdf</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Date: <span className="font-normal">3/04/2024</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Time: <span className="font-normal">11:00 AM</span>
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-green-200 p-4 rounded-lg border border-green-500">
              <p className="text-lg font-semibold text-gray-800">
                Inspector Name: <span className="font-normal">XYZ ABC</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Address: <span className="font-normal">Shivaji Nagar, Pune</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Phone No: <span className="font-normal">9112345678</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-span-1 bg-[#003366] flex flex-col items-center justify-center text-white p-6">
            {/* Decorative Section */}
            <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-xl font-bold border-4 border-blue-300 shadow-lg">
              CASE
            </div>
            <p className="text-lg font-bold mt-4 text-center">Details Overview</p>
            <p className="text-center mt-4">
              All essential case details are highlighted here for your reference. Lorem ipsum dolor qui voluptatum quis a consequuntur culpa, sequi
              repudiandae officiis ipsam repellat nulla atque!
            </p>
          </div>
        </div>

        {/* Bottom Link */}
        <div className="text-right p-4">
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            View More Details
          </a>
        </div>
      </div>
    </div>
  );
}
