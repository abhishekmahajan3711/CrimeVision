import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";
import { toast } from "react-hot-toast";

export default function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        setLoading(true);
        
        if (userInfo?.district?._id) {
          // Use the same endpoint as the list to get all warnings, then filter
          const response = await fetch(`https://crimevision.onrender.com/api/v1/web/district/${userInfo.district._id}/warnings?limit=1000`);
          const data = await response.json();
          
          if (data.success) {
            // Find the specific warning by ID
            const specificWarning = data.data.find(warning => warning._id === id);
            if (specificWarning) {
              setNotification(specificWarning);
            } else {
              setError("Notification not found");
            }
          } else {
            setError("Failed to fetch notification details");
          }
        } else {
          setError("User district information not available");
        }
      } catch (err) {
        console.error("Error fetching notification details:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    if (id && userInfo) {
      fetchNotificationDetails();
    }
  }, [id, userInfo]);

  const acknowledgeWarning = async () => {
    try {
      const response = await fetch(
        `https://crimevision.onrender.com/api/v1/web/warnings/${id}/acknowledge`,
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
        setNotification(prev => ({
          ...prev,
          isAcknowledged: true,
          acknowledgedAt: new Date()
        }));
        toast.success("Warning acknowledged successfully!");
      } else {
        toast.error("Failed to acknowledge warning");
      }
    } catch (err) {
      console.error("Error acknowledging warning:", err);
      toast.error("Error acknowledging warning");
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-xl">Loading notification details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-xl text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-xl text-gray-600">Notification not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="bg-[#003366] text-white p-4 font-bold text-lg">
          <span>
            Notification Details
          </span>
        </header>

        {/* Main Details Card */}
        <div className="bg-white p-6 mb-4">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span
                className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${
                  notification.type === "Warning"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {notification.type}
              </span>
            </div>
            <div>
              {notification.isAcknowledged ? (
                <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Acknowledged
                </span>
              ) : (
                <button
                  onClick={acknowledgeWarning}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-semibold"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Police Station Info */}
            <div className="bg-blue-50 p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Police Station Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900 text-lg">
                    {notification.policeStationId?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Address:</span>
                  <p className="text-gray-900">
                    {notification.policeStationId?.address || 'Not available'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">District:</span>
                  <p className="text-gray-900">
                    {notification.policeStationId?.district || userInfo?.district?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Threshold Information */}
            <div className="bg-orange-50 p-4 border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Threshold Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Current Value:</span>
                  <p className="text-2xl font-bold text-orange-600">
                    {notification.currentValue}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Threshold Value:</span>
                  <p className="text-2xl font-bold text-red-600">
                    {notification.thresholdValue}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Percentage:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {Math.round((notification.currentValue / notification.thresholdValue) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="bg-gray-50 p-4 border border-gray-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Reason & Details
            </h3>
            <p className="text-gray-900 text-lg leading-relaxed">
              {notification.reason}
            </p>
          </div>

          {/* Timeline Section */}
          <div className="bg-indigo-50 p-4 border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <p className="text-gray-900 font-semibold">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
              </div>
              
              {notification.isAcknowledged && notification.acknowledgedAt && (
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-600">Acknowledged:</span>
                    <p className="text-gray-900 font-semibold">
                      {formatDateTime(notification.acknowledgedAt)}
                    </p>
                  </div>
                </div>
              )}
              
              {notification.updatedAt && notification.updatedAt !== notification.createdAt && (
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-600">Last Updated:</span>
                    <p className="text-gray-900 font-semibold">
                      {formatDateTime(notification.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {notification.additionalData && (
          <div className="bg-white p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Additional Information
            </h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(notification.additionalData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 