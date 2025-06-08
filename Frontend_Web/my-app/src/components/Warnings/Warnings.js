import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { useUser } from "../UserContext/UserContext";
import { useWebSocket } from "../WebSocket/WebSocketContext";
import CustomNotification from "../CustomNotification/CustomNotification";

export default function Warnings() {
  const { userInfo } = useUser();
  const { queueWarning, isAlertActive } = useWebSocket();
  const [filterType, setFilterType] = useState("All");
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("https://crimevision.onrender.com");
    setSocket(newSocket);

    // Register with appropriate ID based on user type
    if (userInfo) {
      if (userInfo.policeStation?._id) {
        // Police station user
        newSocket.emit("register", { policeStationId: userInfo.policeStation._id });
        console.log(`Warnings WebSocket registered for police station: ${userInfo.policeStation.name}`);
      } else if (userInfo.district?._id) {
        // District officer
        newSocket.emit("register", { 
          districtId: userInfo.district._id, 
          authorityId: userInfo._id 
        });
        console.log(`Warnings WebSocket registered for district officer: ${userInfo.district.name}`);
      }
    }

    // Listen for new warnings (for police stations)
    newSocket.on("new_warning", (data) => {
      console.log("New police station warning received:", data);
      setWarnings(prev => [data.warning, ...prev]);
      
      // Try to queue warning if alert is active, otherwise show immediately
      const warningNotification = {
        type: 'warning',
        title: `New ${data.warning.type}`,
        message: data.message,
        policeStation: data.warning.policeStationId?.name,
        timestamp: new Date(),
        isReactivated: false
      };
      
      const wasQueued = queueWarning({
        eventType: 'new_warning',
        data: warningNotification
      });
      
      if (!wasQueued) {
        // Show immediately if not queued
        setCurrentNotification(warningNotification);
      }
    });

    // Listen for re-activated warnings (for police stations)
    newSocket.on("reactivated_warning", (data) => {
      console.log("Re-activated warning received:", data);
      
      // Update the warning in the list (move to top and mark as unacknowledged)
      setWarnings(prev => {
        const updatedWarnings = prev.filter(w => w._id !== data.warning._id);
        return [{ ...data.warning, isAcknowledged: false }, ...updatedWarnings];
      });
      
      // Try to queue warning if alert is active, otherwise show immediately
      const reactivatedNotification = {
        type: 'warning',
        title: `Re-activated ${data.warning.type}`,
        message: data.message,
        policeStation: data.warning.policeStationId?.name,
        timestamp: new Date(),
        isReactivated: true
      };
      
      const wasQueued = queueWarning({
        eventType: 'reactivated_warning',
        data: reactivatedNotification
      });
      
      if (!wasQueued) {
        // Show immediately if not queued
        setCurrentNotification(reactivatedNotification);
      }
    });

    // Listen for district warnings (for district officers)
    newSocket.on("district_warning", (data) => {
      console.log("New district warning received:", data);
      setWarnings(prev => [data.warning, ...prev]);
      
      // Try to queue warning if alert is active, otherwise show immediately
      const notificationType = data.isReactivated ? "Re-activated District" : "District";
      const districtNotification = {
        type: data.warning.type.toLowerCase(),
        title: `${notificationType} ${data.warning.type}`,
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
      console.log("Processing queued warning:", warning);
      setCurrentNotification(warning.data);
    };

    window.addEventListener('queuedWarningReady', handleQueuedWarning);

    // No need to request notification permission since we're using in-website notifications

    return () => {
      newSocket.close();
      window.removeEventListener('queuedWarningReady', handleQueuedWarning);
    };
  }, [userInfo]);

  // Fetch warnings from API
  const fetchWarnings = async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on user type
      let queryParams = "limit=50";
      
      if (userInfo?.policeStation?._id) {
        // Police station user - show only warnings for their station
        queryParams += `&policeStationId=${userInfo.policeStation._id}`;
      }
      // District users will see all warnings in their district (no additional filter needed)
      
      const response = await fetch(`https://crimevision.onrender.com/api/v1/web/warnings?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setWarnings(data.data);
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

  useEffect(() => {
    if (userInfo) {
      fetchWarnings();
    }
  }, [userInfo]);

  // Acknowledge warning
  const acknowledgeWarning = async (warningId) => {
    try {
      const response = await fetch(
        `https://crimevision.onrender.com/api/v1/web/warnings/${warningId}/acknowledge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acknowledgedBy: userInfo?._id || "unknown_user",
          }),
        }
      );

      if (response.ok) {
        setWarnings(prev =>
          prev.map(warning =>
            warning._id === warningId
              ? { ...warning, isAcknowledged: true, acknowledgedAt: new Date() }
              : warning
          )
        );
      }
    } catch (err) {
      console.error("Error acknowledging warning:", err);
    }
  };

  // Close notification
  const closeNotification = () => {
    setCurrentNotification(null);
  };

  const filteredNotifications =
    filterType === "All"
      ? warnings
      : warnings.filter((w) => w.type === filterType);

  const formatTimeRemaining = (expiresAt) => {
    if (!expiresAt) return "No expiry";
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading warnings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Left Panel */}
      <aside className="bg-[#d3dce7] text-white w-64 p-4 min-h-screen">
        <button
          className={`w-full py-2 mb-4 rounded-lg font-semibold ${
            filterType === "All"
              ? "bg-blue-600"
              : "bg-blue-400 text-black"
          }`}
          onClick={() => setFilterType("All")}
        >
          All ({warnings.length})
        </button>
        
        <button
          className={`w-full py-2 mb-4 rounded-lg font-semibold ${
            filterType === "Notification"
              ? "bg-yellow-400 text-black"
              : "bg-yellow-600"
          }`}
          onClick={() => setFilterType("Notification")}
        >
          Notifications ({warnings.filter(w => w.type === "Notification").length})
        </button>
        
        <button
          className={`w-full py-2 rounded-lg font-semibold ${
            filterType === "Warning"
              ? "bg-red-600"
              : "bg-red-400 text-black"
          }`}
          onClick={() => setFilterType("Warning")}
        >
          Warnings ({warnings.filter(w => w.type === "Warning").length})
        </button>

        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <h3 className="font-bold text-sm mb-2 text-black">Legend</h3>
          <div className="space-y-1 text-xs text-black">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-[#002855] text-white p-4 font-bold text-lg shadow-md text-center mb-4">
          {userInfo?.policeStation ? 
            `Warnings for ${userInfo.policeStation.name}` : 
            `District Warnings - ${userInfo?.district?.name || 'District'}`
          }
        </header>
         
        <div className="pl-6 pr-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {filterType.toLowerCase()} found.
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-xl shadow-lg mb-6 border-l-8 transition-all duration-300 relative ${
                  notification.type === "Warning"
                    ? "border-red-500 bg-red-100"
                    : "border-yellow-500 bg-yellow-100"
                } ${notification.isAcknowledged ? "opacity-75" : ""}`}
              >
                {/* Acknowledgment status */}
                {notification.isAcknowledged && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    Acknowledged
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <p className="text-base text-gray-800">
                    <b>{notification.type}:</b> {notification.reason}
                  </p>
                  
                  {!notification.isAcknowledged && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <b>Police Station:</b> {notification.policeStationId?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <b>Threshold:</b> {notification.currentValue} / {notification.thresholdValue} 
                    ({notification.thresholdType?.replace(/_/g, ' ')})
                  </p>
                </div>

                <div className="grid grid-cols-6 font-semibold text-gray-700 mb-2 text-center bg-gray-200 rounded-lg py-1 text-sm">
                  <div>Open Cases</div>
                  <div>Pending Cases</div>
                  <div>High Priority</div>
                  <div>Medium Priority</div>
                  <div>Low Priority</div>
                  <div>Date</div>
                </div>

                <div className="grid grid-cols-6 items-center text-gray-800 py-2 text-center bg-gray-50 rounded-lg text-sm">
                  <div className="text-red-600 font-semibold">
                    {notification.caseStats?.openCases || 0}
                  </div>
                  <div className="text-yellow-500 font-semibold">
                    {notification.caseStats?.pendingCases || 0}
                  </div>
                  <div className="text-red-700 font-semibold">
                    {notification.caseStats?.highPriority || 0}
                  </div>
                  <div className="text-orange-500 font-semibold">
                    {notification.caseStats?.mediumPriority || 0}
                  </div>
                  <div className="text-green-600 font-semibold">
                    {notification.caseStats?.lowPriority || 0}
                  </div>
                  <div>{new Date(notification.createdAt).toLocaleDateString()}</div>
                </div>

                {notification.caseIds && notification.caseIds.length > 0 && (
                  <div className="mt-3">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm">
                      Related Cases ({notification.caseIds.length}):
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {notification.caseIds.slice(0, 5).map((caseId) => (
                        <Link key={caseId} to={`/detail_case?id=${caseId}`}>
                          <p className="text-[#003366] underline cursor-pointer text-sm hover:text-blue-600">
                            {typeof caseId === 'string' ? caseId : caseId._id}
                          </p>
                        </Link>
                      ))}
                      {notification.caseIds.length > 5 && (
                        <span className="text-gray-500 text-sm">
                          +{notification.caseIds.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex justify-between items-center text-xs">
                  <div className="text-gray-600 italic">
                    Time Frame: {notification.timeFrame}
                  </div>
                  <div className="text-gray-600 italic">
                    Time Remaining: {formatTimeRemaining(notification.expiresAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Custom Notification */}
      <CustomNotification 
        notification={currentNotification}
        onClose={closeNotification}
      />
    </div>
  );
}
