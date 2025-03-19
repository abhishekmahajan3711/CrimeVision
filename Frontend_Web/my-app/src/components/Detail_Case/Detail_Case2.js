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

export default function Detail_Case2() {
  const { id } = useParams();

  const [alertData, setalertData] = useState(null);
  const [userData, setuserData] = useState(null);
  const [policeStationData, setpoliceStationData] = useState(null);
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [timeline, setTimeline] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

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

    if (id) fetchData();
  }, [id]);

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
  const updateStatusInBackend = async () => {
    try {
      await axios.put(`http://localhost:3001/api/v1/web/status/${id}`, {
        status,
        logEntry: {
          action: `Status changed to ${status}`,
          performedAt: new Date().toISOString(),
        },
      });
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("Failed to update status");
    }
  };

  const handleStatusChange = () => {
    updateStatusInBackend();
    setTimeline((prev) => [
      ...prev,
      {
        action: `Status changed to ${status}`,
        performedAt: new Date().toISOString(),
      },
    ]);
  };

  const updatePriorityInBackend = async () => {
    try {
      await axios.put(`http://localhost:3001/api/v1/web/priority/${id}`, {
        priority,
        logEntry: {
          action: `Priority changed to ${priority}`,
          performedAt: new Date().toISOString(),
        },
      });
      toast.success("Priority updated successfully!");
    } catch (error) {
      console.error("Error updating priority", error);
      toast.error("Failed to update priority");
    }
  };

  const handlePriorityChange = () => {
    updatePriorityInBackend();
    setTimeline((prev) => [
      ...prev,
      {
        action: `Priority changed to ${priority}`,
        performedAt: new Date().toISOString(),
      },
    ]);
  };

  const addCommentToBackend = async () => {
    try {
      const commentEntry = {
        text: newComment,
        addedAt: new Date().toISOString(),
      };

      await axios.put(`http://localhost:3001/api/v1/web/comment/${id}`, {
        comment: commentEntry,
        logEntry: {
          action: `Added comment: ${newComment}`,
          performedAt: new Date().toISOString(),
        },
      });

      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment", error);
      toast.error("Failed to add comment");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentToBackend();
      setTimeline((prev) => [
        ...prev,
        {
          action: `Added comment: ${newComment}`,
          addedAt: new Date().toISOString(),
        },
      ]);
      setComments((prev) => [
        ...prev,
        {
          text: `Added comment: ${newComment}`,
          addedAt: new Date().toISOString(),
        },
      ]);
    }
    setNewComment("");
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
       <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
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
