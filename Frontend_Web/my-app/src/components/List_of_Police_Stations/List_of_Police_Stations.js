import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext/UserContext";

export default function ListOfPoliceStations() {
  const { userInfo } = useUser();
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/web/${userInfo.district._id}`);
        setPoliceStations(response.data);
      } catch (error) {
        console.error("Error fetching police stations:", error);
        setError("Failed to load police stations");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.district?._id) {
      fetchPoliceStations();
    }
  }, [userInfo]);

  return (
    <div>
      <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
        List of Police Stations
      </header>

      <div className="max-w-4xl mx-auto mt-8 grid gap-6">
        {loading ? (
          <p className="text-center text-gray-700">Loading police stations...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : policeStations.length === 0 ? (
          <p className="text-center text-gray-500">No police stations found.</p>
        ) : (
          policeStations.map((station, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{station.name}</h2>
              <p className="text-gray-600">{station.address}</p>
              <p className="text-gray-700 mt-2"><strong>Authority:</strong> {station.authority_id?.name || "N/A"}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {station.authority_id?.phone || "N/A"}</p>
              <p className="text-gray-700"><strong>Email:</strong> {station.authority_id?.email || "N/A"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
