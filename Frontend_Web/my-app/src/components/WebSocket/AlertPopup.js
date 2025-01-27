import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// Notification sound
const notificationSound = new Audio("/siren_alert.mp3"); // Path to your sound file

const AlertPopup = ({ alert, onClose, onSeeDetails, hasInteracted }) => {
  useEffect(() => {
    if (alert && hasInteracted) {
      notificationSound.play();
      // Loop the sound indefinitely every 7 seconds
      const soundInterval = setInterval(() => {
        notificationSound.play();
      }, 2000); // Play every 2 seconds

      // Clean up the interval when the component is unmounted or alert is cleared
      return () => clearInterval(soundInterval);
    }

    // Cleanup when the alert is cleared
    return () => {
      notificationSound.pause();
      notificationSound.currentTime = 0; // Reset sound to the beginning
    };
  }, [alert]);

  const handleStopSound = () => {
    notificationSound.pause(); // Stop sound when either button is clicked
    notificationSound.currentTime = 0; // Reset sound to start
  };

  if (!alert) return null; // Don't render if there's no alert

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-red-100 rounded-lg shadow-lg p-6 max-w-sm w-full border-4 border-red-200"
        style={{
          borderRadius: "12px",
          animation: "pulseGlow 1s infinite", // Apply the glowing animation directly
        }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Alert !!!! </h2>
        <p className="text-gray-600 mb-6">{alert.message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              handleStopSound(); // Stop the sound when clicked
              onClose();
            }}
            className="bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            OK
          </button>
          <Link to="/detail_case">
          <button
            onClick={() => {
              handleStopSound(); // Stop the sound when clicked
              onSeeDetails(alert);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            See Details
          </button>
          </Link>
        </div>
      </div>

      {/* CSS for animation */}
      <style>{`
        /* Keyframe animation for the glowing effect */
        @keyframes pulseGlow {
          0% {
            border-color: rgba(255, 0, 0, 0.7);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
          }
          50% {
            border-color: rgba(255, 0, 0, 1);
            box-shadow: 0 0 40px rgba(255, 0, 0, 1);
          }
          100% {
            border-color: rgba(255, 0, 0, 0.7);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default AlertPopup;
