import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",
  iconSize: [25, 25],
});

export default function Detail_Case() {
  // Data
  const alertData = {
    _id: "676e9304c8a1bea20495fa53",
    AlertType: "Stalking",
    Time: "2025-02-12T18:53:48.801Z",
    Location: "Lat: 18.4508, Lng: 73.9020",
    Description: "Description for alert 40",
    Status: "Closed",
    Priority: "Medium",
    Comments: [],
    Timeline: [],
  };

  const userData = {
    name: "Abhishek Mahajan",
    email: "abhishekmahajan3711@gmail.com",
    aadhar: "123456789111",
    phone: "8080142710",
  };

  const policeStationData = {
    name: "Nigdi Police Station",
    address:
      "Sector No. 24, Pradhikaran, Nigdi, Pimpri-Chinchwad, Pune, Maharashtra 411044",
  };

  const [lat, lng] = alertData.Location.split(", ").map((coord) =>
    parseFloat(coord.split(": ")[1])
  );
  const [status, setStatus] = useState(alertData.Status);
  const [priority, setPriority] = useState(alertData.Priority);
  const [comments, setComments] = useState(alertData.Comments);
  const [newComment, setNewComment] = useState("");
  const [timeline, setTimeline] = useState(alertData.Timeline);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const handleStatusChange = () => {
    setTimeline((prev) => [
      ...prev,
      {
        action: `Status changed to ${status}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handlePriorityChange = () => {
    setTimeline((prev) => [
      ...prev,
      {
        action: `Priority changed to ${priority}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentEntry = {
        text: newComment,
        timestamp: new Date().toISOString(),
      };
      setComments((prev) => [...prev, commentEntry]);
      setTimeline((prev) => [
        ...prev,
        {
          action: `Added comment: ${newComment}`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewComment("");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setFileURL(URL.createObjectURL(file)); // Create a temporary URL for the file
      console.log(fileURL);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const UploadButton = () => {
    if (uploadedFile == null || fileURL == null) {
      alert("Please upload a valid file first");
    } else {
      setTimeline((prev) => [
        ...prev,
        {
          action: `Uploaded file: ${uploadedFile.name}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleFileReset = () => {
    setUploadedFile(null);
    setFileURL(null);
  };

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
            <strong>Date:</strong>{" "}
            {new Date(alertData.Time).toLocaleDateString()}
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Time:</strong>{" "}
            {new Date(alertData.Time).toLocaleTimeString()}
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
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
          Timeline
        </h2>
        {timeline.map((entry, index) => (
          <p key={index} className="text-gray-700 text-sm mb-1">
            <strong>Action:</strong> {entry.action}{" "}
            <span className="text-xs text-gray-500">
              ({new Date(entry.timestamp).toLocaleString()})
            </span>
          </p>
        ))}
      </div>
      {/* Status and Priority Section */}
      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Manage Case
        </h2>

        {/* Change Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Change Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-2"
            >
              Change Case Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
            <button
              onClick={handleStatusChange}
              className="mt-2 px-4 py-2 bg-[#003366] text-white rounded-md hover:bg-blue-700 w-full"
            >
              Submit
            </button>
          </div>

          {/* Change Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block text-gray-700 font-medium mb-2"
            >
              Set Case Priority:
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button
              onClick={handlePriorityChange}
              className="mt-2 px-4 py-2 bg-[#003366] text-white rounded-md hover:bg-blue-700 w-full"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
          Comments
        </h2>
        {comments.map((comment, index) => (
          <p key={index} className="text-gray-700 text-sm mb-1">
            <strong>Comment:</strong> {comment.text}{" "}
            <span className="text-xs text-gray-500">
              ({new Date(comment.timestamp).toLocaleString()})
            </span>
          </p>
        ))}
        <textarea
          className="border w-full p-2 mt-3 rounded-md"
          rows="3"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          className="bg-[#003366] text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>

      {/* PDF Upload Section */}
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
          Upload PDF File
        </h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="block w-full mb-4 border border-gray-300 rounded-md p-2"
        />
        <button
          className="bg-[#003366] text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          onClick={UploadButton}
        >
          Upload
        </button>
        {uploadedFile && (
          <div className="text-gray-700 text-sm mb-4">
            <a
              href={fileURL}
              download={uploadedFile.name}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-block"
            >
              Download File
            </a>
            <button
              onClick={handleFileReset}
              className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
