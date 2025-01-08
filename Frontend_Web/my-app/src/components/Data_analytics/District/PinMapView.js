import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useUser } from "../../UserContext/UserContext";

// Fix marker icons issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const blackIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [30, 45], // Adjust size (width, height)
  iconAnchor: [15, 45], // Anchor point for the marker
  popupAnchor: [1, -40], // Anchor point for the popup
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [30, 45], // Adjust size (width, height)
  iconAnchor: [15, 45], // Anchor point for the marker
  popupAnchor: [1, -40], // Anchor point for the popup
});

const PinMapView = () => {
  const [crimeData, setCrimeData] = useState(null);
  const [filter, setFilter] = useState("");
  const { userInfo }=useUser();

  // Fetch data from backend API
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
  }, []);

  if (!crimeData)
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

  // Parse the Location field to extract Latitude and Longitude
  const parseLocation = (location) => {
    const regex = /Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/;
    const match = location.match(regex);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return { lat: 0, lng: 0 }; // Default fallback if the format is incorrect
  };

  const bounds = new LatLngBounds(
    crimeData.map((crime) => {
      const { lat, lng } = parseLocation(crime.Location);
      return [lat, lng];
    })
  );

  const filteredData = filter
    ? crimeData.filter((crime) => crime.Status === filter)
    : crimeData;

  const getMarkerIcon = (crimeStatus) => {
    if (crimeStatus === "Pending") return redIcon;
    return blackIcon;
  };

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
          bounds={bounds}
          zoom={0}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=d85e117aeffc474ea3505febb55b0a25"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />

          {filteredData.map((crime) => {
            const { lat, lng } = parseLocation(crime.Location);
            return (
              <Marker
                key={crime._id}
                position={[lat, lng]}
                icon={getMarkerIcon(crime.Status)}
              >
                <Popup>
                  <strong>Time:</strong> {new Date(crime.Time).toLocaleString()}
                  <br />
                  <strong>AlertType:</strong> {crime.AlertType}
                  <br />
                  <strong>Location:</strong> {crime.Location}
                  <br />
                  <strong>Status:</strong> {crime.Status}
                  <br />
                  <strong>Police Station:</strong> {crime.PoliceStationName}
                  <br />
                  <strong>Description:</strong> {crime.Description}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default PinMapView;
