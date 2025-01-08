import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "leaflet.heat"; // Import the heat map plugin
import L from "leaflet";
import { useUser } from "../../UserContext/UserContext";

const HeatMapView = () => {
  const [crimeData, setCrimeData] = useState(null);
  const [filter, setFilter] = useState("");
  const mapRef = useRef(null); // Create a ref for the map to use with Leaflet
  const { userInfo }=useUser();

  // Fetch data from backend API and add heat layer once data is fetched
  useEffect(() => {
    const fetchCrimeData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/api/v1/web/alerts_district", { districtId: userInfo.district._id });
        setCrimeData(response.data);
      } catch (error) {
        console.error("Error fetching crime data:", error);
      }
    };

    fetchCrimeData();
  }, []); // Fetch data only once when the component mounts

  // Parse the Location field to extract Latitude and Longitude
  const parseLocation = (location) => {
    const regex = /Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/;
    const match = location.match(regex);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return { lat: 0, lng: 0 }; // Default fallback if the format is incorrect
  };

  // Handle the filtered data and generate heatmap data
  const filteredData = filter ? crimeData.filter((crime) => crime.Status === filter) : crimeData;

  const heatMapData = filteredData?.map((crime) => {
    const { lat, lng } = parseLocation(crime.Location);
    return [lat, lng, crime.Status === "Pending" ? 2 : 0.5]; // Adjust intensity based on crime status
  });

  const bounds = new LatLngBounds(
    crimeData?.map((crime) => {
      const { lat, lng } = parseLocation(crime.Location);
      return [lat, lng];
    })
  );

 // Add heat map layers
useEffect(() => {
  if (crimeData && mapRef.current && heatMapData) {
    const map = mapRef.current;

    // Clear all existing heat layers
    map.eachLayer((layer) => {
      if (layer instanceof L.HeatLayer) {
        map.removeLayer(layer);
      }
    });

    // Add the main heatmap layer for all data
    L.heatLayer(heatMapData, {
      radius: 40,       // Increase the radius for a broader spread
      blur: 25,         // Increase blur for smoother transitions
      maxZoom: 17,      // Keeps the heatmap visible on higher zoom levels
      minOpacity: 0.1,  // Adjust opacity for a more subtle effect
      gradient: {
        0.4: "blue",    // Blue for lower intensity
        0.65: "lime",   // Lime for moderate intensity
        1: "yellow",    // Yellow for high intensity
      },
    }).addTo(map);

    // Create a separate heat layer for "Pending" cases with red color
    const pendingHeatMapData = filteredData
      .filter((crime) => crime.Status === "Pending")
      .map((crime) => {
        const { lat, lng } = parseLocation(crime.Location);
        return [lat, lng, 1]; // High intensity for pending cases
      });

    L.heatLayer(pendingHeatMapData, {
      radius: 50,       // Larger radius for pending cases
      blur: 30,         // Smoother transitions for red heatmap
      maxZoom: 17,      // Keeps the heatmap visible on higher zoom levels
      minOpacity: 0.2,  // Slightly higher opacity for visibility
      gradient: {
        0.4: "orange",  // Orange for lower intensity
        0.7: "red",     // Red for moderate intensity
        1: "darkred",   // Dark red for high intensity
      },
    }).addTo(map);
  }
}, [crimeData, heatMapData]); // Runs when crimeData or heatMapData changes



  // Loading state check before rendering the map
  if (!crimeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="flex justify-center items-center">
            <div className="animate-spin h-12 w-12 border-4 border-gray-300 rounded-full border-t-black"></div>
          </div>
          {/* Loading Text */}
          <p className="text-black text-lg mt-4 font-medium">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <select
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
        className="ml-2 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-500 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed</option>
      </select>
      <div className="p-2 bg-gray-300">
        <MapContainer
          ref={mapRef}
          bounds={bounds}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=d85e117aeffc474ea3505febb55b0a25"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default HeatMapView;
