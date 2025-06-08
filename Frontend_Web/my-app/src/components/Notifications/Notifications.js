import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext/UserContext";
import { useWebSocket } from "../WebSocket/WebSocketContext";
import io from "socket.io-client";
import CustomNotification from "../CustomNotification/CustomNotification";

export default function Notifications() {
  const { userInfo } = useUser();
  const { queueWarning, isAlertActive } = useWebSocket();
  const [selectedTime, setSelectedTime] = useState("This Week");
  const [selectedPoliceStation, setSelectedPoliceStation] = useState("All");
  const [warnings, setWarnings] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const filterOptions = {
    time: ["Today", "Yesterday", "This Week", "This Month"],
  };

  // Fetch warnings from API
  const fetchWarnings = async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on user type
      let queryParams = "limit=100";
      
      if (userInfo?.district?._id) {
        // District users - show warnings from all police stations in their district
        queryParams += `&districtId=${userInfo.district._id}`;
      }
      
      const response = await fetch(`https://crimevision.onrender.com/api/v1/web/warnings?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setWarnings(data.data);
        
        // Extract unique police stations
        const uniqueStations = [...new Set(
          data.data
            .filter(w => w.policeStationId?.name)
            .map(w => w.policeStationId.name)
        )];
        setPoliceStations(uniqueStations);
      } else {
        setError("Failed to fetch warnings");
      }
    } catch (err) {
      console.error("Error fetching warnings:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    if (userInfo?.district?._id) {
      const newSocket = io("https://crimevision.onrender.com");
      setSocket(newSocket);

      // Register as district officer for real-time notifications
      newSocket.emit("register", { 
        districtId: userInfo.district._id, 
        authorityId: userInfo._id 
      });
      console.log(`Notifications WebSocket registered for district: ${userInfo.district.name}`);

      // Listen for new district warnings
      newSocket.on("district_warning", (data) => {
        console.log("New district notification received:", data);
        
        if (data.isReactivated) {
          // Handle re-activated warnings differently
          setWarnings(prev => {
            const updatedWarnings = prev.filter(w => w._id !== data.warning._id);
            return [{ ...data.warning, isAcknowledged: false }, ...updatedWarnings];
          });
        } else {
          // Handle new warnings
          setWarnings(prev => [data.warning, ...prev]);
        }
        
        // Update police stations list if needed
        if (data.warning.policeStationId?.name) {
          setPoliceStations(prev => {
            if (!prev.includes(data.warning.policeStationId.name)) {
              return [...prev, data.warning.policeStationId.name];
            }
            return prev;
          });
        }

        // Try to queue notification if alert is active, otherwise show immediately
        const notificationType = data.isReactivated ? "Re-activated District Notification" : "District Notification";
        const districtNotification = {
          type: data.warning.type.toLowerCase(),
          title: notificationType,
          message: data.message,
          policeStation: data.policeStation?.name,
          timestamp: new Date(),
          isReactivated: data.isReactivated || false
        };
        
        const wasQueued = queueWarning({
          eventType: 'district_warning',
          data: districtNotification
        });
        
        if (!wasQueued) {
          // Show immediately if not queued
          setCurrentNotification(districtNotification);
        }
      });

      // Listen for queued warnings being processed via custom events
      const handleQueuedWarning = (event) => {
        const { warning } = event.detail;
        console.log("Processing queued warning in Notifications:", warning);
        if (warning.eventType === 'district_warning') {
          setCurrentNotification(warning.data);
        }
      };

      window.addEventListener('queuedWarningReady', handleQueuedWarning);

      // Request notification permission
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      return () => {
        newSocket.close();
        window.removeEventListener('queuedWarningReady', handleQueuedWarning);
      };
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      fetchWarnings();
    }
  }, [userInfo]);

  // Filter function for time ranges
  function isWithinTimeRange(time, selectedTime) {
    const currentTime = new Date();
    const warningTime = new Date(time);

    switch (selectedTime) {
      case "Today":
        return warningTime.toDateString() === currentTime.toDateString();
      case "Yesterday":
        const yesterday = new Date();
        yesterday.setDate(currentTime.getDate() - 1);
        return warningTime.toDateString() === yesterday.toDateString();
      case "This Week":
        const weekStart = new Date();
        weekStart.setDate(currentTime.getDate() - 7);
        return warningTime >= weekStart;
      case "This Month":
        const monthStart = new Date();
        monthStart.setDate(currentTime.getDate() - 30);
        return warningTime >= monthStart;
      default:
        return true;
    }
  }

  const filteredWarnings = warnings.filter((warning) => {
    const matchesTime = selectedTime === "All" || isWithinTimeRange(warning.createdAt, selectedTime);
    const matchesStation =
      selectedPoliceStation === "All" ||
      warning.policeStationId?.name === selectedPoliceStation;
    return matchesTime && matchesStation;
  });

  // Close notification
  const closeNotification = () => {
    setCurrentNotification(null);
  };

  if (loading) {
    return (
      <div className="bg-green-50 w-3/4 mx-auto p-6">
        <div className="bg-red-600 text-white p-4 rounded-md text-center font-bold text-xl mb-6">
          Notifications
        </div>
        <div className="text-center py-8">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-green-50 w-3/4 mx-auto p-6">
        <div className="bg-red-600 text-white p-4 rounded-md text-center font-bold text-xl mb-6">
          Notifications
        </div>
        <div className="text-center py-8 text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 w-3/4 mx-auto p-6">
      <div className="bg-red-600 text-white p-4 rounded-md text-center font-bold text-xl mb-6">
        {userInfo?.district?.name ? `${userInfo.district.name} District Notifications` : 'District Notifications'} ({filteredWarnings.length})
      </div>

      <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6 flex gap-4 flex-wrap">
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          {filterOptions.time.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={selectedPoliceStation}
          onChange={(e) => setSelectedPoliceStation(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="All">All Police Stations</option>
          {policeStations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>

        <button
          onClick={fetchWarnings}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="border border-gray-300 rounded-md p-4">
        <div className="grid grid-cols-9 font-bold text-gray-700 mb-4 divide-x divide-gray-300 text-sm">
          <div className="text-center px-2">Police Station</div>
          <div className="text-center px-2">Date</div>
          <div className="text-center px-2">Type</div>
          <div className="text-center px-2">Open Cases</div>
          <div className="text-center px-2">Pending Cases</div>
          <div className="text-center px-2">High Priority</div>
          <div className="text-center px-2">Medium Priority</div>
          <div className="text-center px-2">Low Priority</div>
          <div className="text-center px-2">Actions</div>
        </div>

        {filteredWarnings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notifications found for the selected filters.
          </div>
        ) : (
          filteredWarnings.map((warning) => (
            <div
              key={warning._id}
              className={`grid grid-cols-9 items-center text-gray-600 py-3 border-t divide-x divide-gray-300 text-sm ${
                warning.isAcknowledged ? "bg-gray-50 opacity-75" : ""
              } ${warning.type === "Warning" ? "bg-red-50" : "bg-yellow-50"}`}
            >
              <div className="text-center px-2 font-medium">
                {warning.policeStationId?.name || "Unknown"}
              </div>
              <div className="text-center px-2">
                {new Date(warning.createdAt).toLocaleDateString()}
              </div>
              <div className="text-center px-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    warning.type === "Warning"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {warning.type}
                </span>
              </div>
              <div className="text-center px-2 font-semibold text-red-600">
                {warning.caseStats?.openCases || 0}
              </div>
              <div className="text-center px-2 font-semibold text-yellow-600">
                {warning.caseStats?.pendingCases || 0}
              </div>
              <div className="text-center px-2 font-semibold text-red-700">
                {warning.caseStats?.highPriority || 0}
              </div>
              <div className="text-center px-2 font-semibold text-orange-600">
                {warning.caseStats?.mediumPriority || 0}
              </div>
              <div className="text-center px-2 font-semibold text-green-600">
                {warning.caseStats?.lowPriority || 0}
              </div>
              <div className="text-center px-2">
                <div className="flex flex-col gap-1">
                  <button 
                    className="text-blue-600 underline hover:text-blue-800 text-xs"
                    onClick={() => {
                      // Navigate to detailed view or show modal
                      alert(`Reason: ${warning.reason}\nThreshold: ${warning.currentValue}/${warning.thresholdValue}\nTime Frame: ${warning.timeFrame}`);
                    }}
                  >
                    Details
                  </button>
                  {warning.isAcknowledged ? (
                    <span className="text-green-600 text-xs font-semibold">
                      ✓ Acknowledged
                    </span>
                  ) : (
                    <span className="text-orange-600 text-xs">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-gray-700 mb-2">Total Notifications</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredWarnings.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-gray-700 mb-2">Warnings</h3>
          <p className="text-2xl font-bold text-red-600">
            {filteredWarnings.filter(w => w.type === "Warning").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-gray-700 mb-2">Acknowledged</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredWarnings.filter(w => w.isAcknowledged).length}
          </p>
        </div>
      </div>

      {/* Custom Notification */}
      <CustomNotification 
        notification={currentNotification}
        onClose={closeNotification}
      />
    </div>
  );
}
