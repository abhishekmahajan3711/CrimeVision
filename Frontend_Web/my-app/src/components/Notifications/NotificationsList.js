import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../WebSocket/WebSocketContext";
import io from "socket.io-client";
import CustomNotification from "../CustomNotification/CustomNotification";
import { toast } from "react-hot-toast";

export default function NotificationsList() {
  const { userInfo } = useUser();
  const navigate = useNavigate();
  const { queueWarning, isAlertActive } = useWebSocket();
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPoliceStation, setFilterPoliceStation] = useState("All");
  const [currentNotification, setCurrentNotification] = useState(null);

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

      // Listen for new district warnings
      newSocket.on("district_warning", (data) => {
        console.log("New district notification received:", data);
        
        if (data.isReactivated) {
          // Handle re-activated warnings
          setWarnings(prev => {
            const updatedWarnings = prev.filter(w => w._id !== data.warning._id);
            return [{ ...data.warning, isAcknowledged: false }, ...updatedWarnings];
          });
          
          // Try to queue re-activated warning if alert is active
          const reactivatedNotification = {
            type: 'warning',
            title: `Re-activated ${data.warning.type}`,
            message: data.message,
            policeStation: data.policeStation?.name || 'Police Station',
            timestamp: new Date(),
            isReactivated: true
          };
          
          const wasQueued = queueWarning({
            eventType: 'district_warning',
            data: reactivatedNotification
          });
          
          if (!wasQueued) {
            setCurrentNotification(reactivatedNotification);
          }
        } else {
          // Handle new warnings
          setWarnings(prev => [data.warning, ...prev]);
          
          // Try to queue new warning if alert is active
          const newNotification = {
            type: data.warning.type.toLowerCase(),
            title: `New ${data.warning.type}`,
            message: data.message,
            policeStation: data.policeStation?.name || 'Police Station',
            timestamp: new Date(),
            isReactivated: false
          };
          
          const wasQueued = queueWarning({
            eventType: 'district_warning',
            data: newNotification
          });
          
          if (!wasQueued) {
            setCurrentNotification(newNotification);
          }
        }
      });

      // Listen for queued warnings being processed via custom events
      const handleQueuedWarning = (event) => {
        const { warning } = event.detail;
        console.log("Processing queued warning in NotificationsList:", warning);
        if (warning.eventType === 'district_warning') {
          setCurrentNotification(warning.data);
        }
      };

      window.addEventListener('queuedWarningReady', handleQueuedWarning);

      return () => {
        newSocket.close();
        window.removeEventListener('queuedWarningReady', handleQueuedWarning);
      };
    }
  }, [userInfo]);

  // Fetch all warnings for the district
  const fetchAllWarnings = async () => {
    try {
      setLoading(true);
      
      if (userInfo?.district?._id) {
        const response = await fetch(`https://crimevision.onrender.com/api/v1/web/district/${userInfo.district._id}/warnings?limit=100`);
        const data = await response.json();
        
        if (data.success) {
          setWarnings(data.data);
        } else {
          setError("Failed to fetch notifications");
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchAllWarnings();
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
        toast.success("Warning acknowledged successfully!");
      } else {
        toast.error("Failed to acknowledge warning");
      }
    } catch (err) {
      console.error("Error acknowledging warning:", err);
      toast.error("Error acknowledging warning");
    }
  };

  // Close notification
  const closeNotification = () => {
    setCurrentNotification(null);
  };

  const filteredWarnings = warnings.filter(warning => {
    const typeMatch = filterType === "All" || warning.type === filterType;
    const statusMatch = filterStatus === "All" || 
      (filterStatus === "Acknowledged" && warning.isAcknowledged) ||
      (filterStatus === "Pending" && !warning.isAcknowledged);
    const policeStationMatch = filterPoliceStation === "All" || 
      warning.policeStationId?.name === filterPoliceStation;
    
    return typeMatch && statusMatch && policeStationMatch;
  });

  // Get unique police stations for filter
  const uniquePoliceStations = [...new Set(warnings.map(w => w.policeStationId?.name).filter(Boolean))];

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-xl">Loading notifications...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-xl text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <header className="bg-[#003366] text-white p-4 font-bold text-lg">
          <span>
            Notifications Dashboard - {userInfo?.district?.name || 'District'}
          </span>
        </header>

                {/* Compact Filters */}
        <div className="bg-white p-3 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All ({warnings.length})</option>
                <option value="Warning">Warnings ({warnings.filter(w => w.type === "Warning").length})</option>
                <option value="Notification">Notifications ({warnings.filter(w => w.type === "Notification").length})</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All ({warnings.length})</option>
                <option value="Pending">Pending ({warnings.filter(w => !w.isAcknowledged).length})</option>
                <option value="Acknowledged">Acknowledged ({warnings.filter(w => w.isAcknowledged).length})</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Station:</label>
              <select
                value={filterPoliceStation}
                onChange={(e) => setFilterPoliceStation(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Stations</option>
                {uniquePoliceStations.map((station) => (
                  <option key={station} value={station}>
                    {station} ({warnings.filter(w => w.policeStationId?.name === station).length})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchAllWarnings}
              className="bg-[#ffcc00] text-black px-3 py-1 rounded font-semibold hover:bg-yellow-600 text-sm"
            >
              Refresh
            </button>

            <div className="text-sm text-gray-600 ml-auto">
              Showing {filteredWarnings.length} of {warnings.length} notifications
            </div>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="bg-white overflow-hidden">
          {filteredWarnings.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-xl font-semibold">No notifications found.</div>
              <div className="text-gray-400 mt-2">Try adjusting your filters or refresh the page.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Police Station
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Current/Threshold
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWarnings.map((warning, index) => (
                    <tr 
                      key={warning._id} 
                      className={`${
                        warning.isAcknowledged 
                          ? 'bg-green-50' 
                          : warning.type === 'Warning' 
                            ? 'bg-red-50' 
                            : 'bg-yellow-50'
                      } hover:bg-blue-50 transition-colors duration-200 border-l-4 ${
                        warning.isAcknowledged 
                          ? 'border-green-400' 
                          : warning.type === 'Warning' 
                            ? 'border-red-400' 
                            : 'border-yellow-400'
                      }`}
                    >
                                            <td className="px-4 py-3 w-1/4">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {warning.policeStationId?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-4 py-3 w-1/8">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                            warning.type === "Warning"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {warning.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 w-1/6">
                        <div className="text-sm">
                          <span className="font-bold text-orange-600">
                            {warning.currentValue}
                          </span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="font-bold text-red-600">
                            {warning.thresholdValue}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((warning.currentValue / warning.thresholdValue) * 100)}%
                        </div>
                      </td>
                      <td className="px-4 py-3 w-1/6 text-sm text-gray-600">
                        <div className="text-xs">
                          {new Date(warning.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(warning.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 w-1/8">
                        {warning.isAcknowledged ? (
                          <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                            ✓ Ack
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 w-1/6 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/notification_details/${warning._id}`)}
                            className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600 transition-colors"
                          >
                            Details
                          </button>
                          {!warning.isAcknowledged && (
                            <button
                              onClick={() => acknowledgeWarning(warning._id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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