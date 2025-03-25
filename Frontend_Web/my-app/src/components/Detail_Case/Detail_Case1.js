import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const customIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",
  iconSize: [25, 25],
});

export default function Detail_Case1() {
  const { id } = useParams();

  const [alertData, setalertData] = useState(null);
  const [userData, setuserData] = useState(null);
  const [policeStationData, setpoliceStationData] = useState(null);
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [comments, setComments] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [allImage, setAllImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/web/detail_case",
          {
            params: {
              id: id,
            },
          }
        );
        setalertData(response.data);
        setpoliceStationData(response.data.PoliceStationID);
        setuserData(response.data.UserID);
        setStatus(response.data.Status);
        setPriority(response.data.Priority);
        setComments(response.data.Comments || []);
        setTimeline(response.data.ActivityLog || []);
        console.log(alertData);
        console.log(userData);
        console.log(policeStationData);
      } catch (error) {
        console.error("Error in fetching data", error);
      }
    };

    //get files
        const getPdf = async () => {
          const result = await axios.get(
            `http://localhost:3001/api/v1/web/get-files?id=${id}`
          );
          console.log(result.data.data);
          setAllImage(result.data.data);
        };


    if (id) fetchData();
    getPdf();
  }, [id]);

  const showPdf = (pdf) => {
    // Ensure the file name has a .pdf extension
    const fileName = pdf.endsWith(".pdf") ? pdf : `${pdf}.pdf`;
    window.open(
      `http://localhost:3001/files/${fileName}`,
      "_blank",
      "noreferrer"
    );
  };

  if (!alertData || !userData || !policeStationData)
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

  const [lat, lng] = alertData.Location.split(", ").map((coord) =>
    parseFloat(coord.split(": ")[1])
  );

  return (
    <div>
      {/* Header */}
      <header className="bg-[#003366] text-white p-4 text-center font-bold text-lg">
        Case Details
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mt-4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Case Info */}
        <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-300 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
            Alert Information
          </h2>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Alert ID:</strong> {alertData._id}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Type:</strong> {alertData.AlertType}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Status:</strong> {status}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Priority:</strong> {priority}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Date and Time:</strong>{" "}
            {new Date(alertData.Time).toLocaleDateString()}{" "}{new Date(alertData.Time).toLocaleTimeString()}
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Description:</strong>{alertData.Description}
          </p>
        </div>

        {/* User Info */}
        <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-300 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
            User Information
          </h2>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Name:</strong> {userData.name}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Email:</strong> {userData.email}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Phone:</strong> {userData.phone}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Aadhar:</strong> {userData.aadhar}
          </p>
        </div>

        {/* Police Station Info */}
        <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-300 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
            Police Station Information
          </h2>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Name:</strong> {policeStationData.name}
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <strong>Address:</strong> {policeStationData.address}
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: "220px", width: "100%" }}
        >
          <TileLayer url="https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=d85e117aeffc474ea3505febb55b0a25" />
          <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>{alertData._id}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Timeline Section */}
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-6 border border-gray-300">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Timeline</h2>
        <div className="relative border-l-4 border-blue-500 pl-6">
          {timeline.map((entry, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <div className="absolute -left-2.5 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
              <p className="text-gray-900 font-medium">{entry.action}</p>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(entry.performedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

       {/* Comment Section */}
       <div className="max-w-5xl mx-auto mt-6 mb-8 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-gray-800 font-medium">{comment.text}</p>
              <p className="text-xs text-gray-500">{new Date(comment.addedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 mb-10 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        {/* Uploaded PDFs Section */}
        <div className="">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Uploaded PDFs:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allImage && allImage.length > 0 ? (
              allImage.map((data, index) => (
                <button
                  key={index}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-200 w-full text-center truncate"
                  onClick={() => showPdf(data.title)}
                >
                  {data.title.split("_")[1] + ".pdf"}
                </button>
              ))
            ) : (
              <p className="text-gray-500">No PDFs uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
