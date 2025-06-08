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
  //pdf related
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://crimevision.onrender.com/api/v1/web/detail_case",
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
        // console.log(alertData);
        // console.log(userData);
        // console.log(policeStationData);
      } catch (error) {
        console.error("Error in fetching data", error);
      }
    };

    //get files
    const getPdf = async () => {
      const result = await axios.get(
        `https://crimevision.onrender.com/api/v1/web/get-files?id=${id}`
      );
      console.log(result.data.data);
      setAllImage(result.data.data);
    };

    if (id) fetchData();
    getPdf();
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

  //pdf related functions
  //ger files

  const getPdf = async () => {
    const result = await axios.get(
      `https://crimevision.onrender.com/api/v1/web/get-files?id=${id}`
    );
    console.log(result.data.data);
    setAllImage(result.data.data);
  };

  //upload files
  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", id + "_" + title);
    formData.append("file", file);
    // console.log(title, file);

    const result = await axios.post(
      "https://crimevision.onrender.com/api/v1/web/upload-files",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (result) {
      toast.success("File uploaded successfully");
      getPdf();
      setTitle("");
      setFile("");
    }
  };

  //show pdf

  const showPdf = (pdf) => {
    // Ensure the file name has a .pdf extension
    const fileName = pdf.endsWith(".pdf") ? pdf : `${pdf}.pdf`;
    window.open(
      `https://crimevision.onrender.com/files/${fileName}`,
      "_blank",
      "noreferrer"
    );
  };

  const [lat, lng] = alertData.Location.split(", ").map((coord) =>
    parseFloat(coord.split(": ")[1])
  );
  const updateStatusInBackend = async () => {
    try {
      await axios.put(`https://crimevision.onrender.com/api/v1/web/status/${id}`, {
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
      await axios.put(`https://crimevision.onrender.com/api/v1/web/priority/${id}`, {
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

      await axios.put(`https://crimevision.onrender.com/api/v1/web/comment/${id}`, {
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

      {/* Evidence Section - Images and Videos */}
      {(alertData.Image || alertData.Video) && (
        <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Crime Evidence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Section */}
            {alertData.Image && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Evidence Image
                </h3>
                <div className="space-y-2">
                  <img
                    src={`https://crimevision.onrender.com/api/v1/app/uploads/images/${alertData.Image.filename}`}
                    alt="Crime Evidence"
                    className="w-full h-64 object-cover rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => window.open(`https://crimevision.onrender.com/api/v1/app/uploads/images/${alertData.Image.filename}`, '_blank')}
                  />
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Filename:</strong> {alertData.Image.filename}</p>
                    <p><strong>Size:</strong> {(alertData.Image.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Type:</strong> {alertData.Image.mimetype}</p>
                    <p><strong>Uploaded:</strong> {new Date(alertData.Image.uploadedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Video Section */}
            {alertData.Video && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Evidence Video
                </h3>
                <div className="space-y-2">
                  <video
                    controls
                    className="w-full h-64 rounded-lg shadow-md border border-gray-200"
                    preload="metadata"
                  >
                    <source src={`https://crimevision.onrender.com/api/v1/app/uploads/videos/${alertData.Video.filename}`} type={alertData.Video.mimetype} />
                    Your browser does not support the video tag.
                  </video>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Filename:</strong> {alertData.Video.filename}</p>
                    <p><strong>Size:</strong> {(alertData.Video.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Type:</strong> {alertData.Video.mimetype}</p>
                    {alertData.Video.duration && (
                      <p><strong>Duration:</strong> {Math.round(alertData.Video.duration / 1000)}s</p>
                    )}
                    <p><strong>Uploaded:</strong> {new Date(alertData.Video.uploadedAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => window.open(`https://crimevision.onrender.com/api/v1/app/uploads/videos/${alertData.Video.filename}`, '_blank')}
                    className="bg-[#003366] text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* No Evidence Message */}
          {!alertData.Image && !alertData.Video && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
              </svg>
              <p className="text-lg font-medium">No Evidence Submitted</p>
              <p className="text-sm">No images or videos were provided with this crime report.</p>
            </div>
          )}
        </div>
      )}

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
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
          Comments
        </h2>
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-gray-800 font-medium">{comment.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.addedAt).toLocaleString()}
              </p>
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
        <h2 className="text-xl font-bold text-gray-700 border-b pb-3 mb-4">
          Upload PDF File
        </h2>

        <div className="space-y-4">
          {/* Title Input */}
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* File Upload Input */}
          <input
            type="file"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Submit Button */}
          <button
            onClick={submitImage}
            className="bg-[#003366] text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
            type="submit"
          >
            Upload PDF
          </button>
        </div>

        {/* Uploaded PDFs Section */}
        <div className="mt-6">
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
