import React from 'react';

const policeStations = [
  {
    name: "Nigdi Police Station",
    address: "Sector No. 24, Pradhikaran, Nigdi, Pimpri-Chinchwad, Pune, Maharashtra 411044",
    authority: {
      name: "Abhishek Mahajan",
      phone: "1234567890",
      email: "abhishekmahajan3711@gmail.com",
    },
  },
  {
    name: "Kondhwa Police Station",
    address: "Near Shantai Bhaji Mandai Kausar Baug, Nimb Road, Kondhwa, Pune- 411048",
    authority: {
      name: "Abhishek Mahajan",
      phone: "1234567890",
      email: "abhishekmahajan3711@gmail.com",
    },
  },
  {
    name: "Hadapsar Police Station",
    address: "Sholapur Road, Gadital, Hadapsar, Pune-411028",
    authority: {
      name: "Abhishek Mahajan",
      phone: "1234567890",
      email: "abhishekmahajan3711@gmail.com",
    },
  },
  {
    name: "Khadki Police Station",
    address: "Pune Mumbai Highway, Church Chowk, Pune-411003",
    authority: {
      name: "Abhishek Mahajan",
      phone: "1234567890",
      email: "abhishekmahajan3711@gmail.com",
    },
  },
];

export default function ListOfPoliceStations() {
  return (
    <div>
      {/* Header */}
      <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
        List of Police Stations
      </header>

      {/* List of Police Stations */}
      <div className="max-w-4xl mx-auto mt-8 grid gap-6">
        {policeStations.map((station, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{station.name}</h2>
            <p className="text-gray-600">{station.address}</p>
            <p className="text-gray-700 mt-2"><strong>Authority:</strong> {station.authority.name}</p>
            <p className="text-gray-700"><strong>Phone:</strong> {station.authority.phone}</p>
            <p className="text-gray-700"><strong>Email:</strong> {station.authority.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
