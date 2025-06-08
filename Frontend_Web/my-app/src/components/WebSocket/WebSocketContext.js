import React, { createContext, useContext, useEffect, useRef,useState } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [alert, setAlert] = useState(null); // State to store the alert
  const [queuedWarnings, setQueuedWarnings] = useState([]); // Queue for warnings when alert is active
  const [isAlertActive, setIsAlertActive] = useState(false); // Track if alert is currently shown

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io("https://crimevision.onrender.com");
    socketRef.current = socket;

    //WebSocket Event Handlers
    //Logs when the WebSocket connection is established
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });

    //Logs when the WebSocket connection is closed.
    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    // Listens for "new-alert" events from the server and logs the received alert.
    socket.on("new-alert", (alert) => {
      console.log("New alert received:");
      setAlert(alert); // Update alert state
      setIsAlertActive(true); // Mark alert as active
    });

    //disconnect websocket connection when we go away from the website
    return () => {
      socket.disconnect(); // Clean up WebSocket on unmount
    };
  }, []);

  const clearAlert = () => {
    setAlert(null); // Clear the alert
    setIsAlertActive(false); // Mark alert as inactive
    processQueuedWarnings(); // Process any queued warnings
  };

  // Add warning to queue if alert is active, otherwise show immediately
  const queueWarning = (warningData) => {
    if (isAlertActive) {
      console.log("Alert is active, queueing warning:", warningData);
      setQueuedWarnings(prev => [...prev, warningData]);
      return true; // Indicates warning was queued
    }
    return false; // Indicates warning should be shown immediately
  };

  // Process queued warnings after alert is dismissed
  const processQueuedWarnings = () => {
    if (queuedWarnings.length > 0) {
      console.log(`Processing ${queuedWarnings.length} queued warnings`);
      
      // Create a custom event to notify components about queued warnings
      const processQueuedEvent = new CustomEvent('processQueuedWarnings', {
        detail: { warnings: queuedWarnings }
      });
      
      // Process warnings one by one with delay
      queuedWarnings.forEach((warning, index) => {
        setTimeout(() => {
          console.log('Processing queued warning:', warning);
          // Dispatch custom event for each warning
          const warningEvent = new CustomEvent('queuedWarningReady', {
            detail: { warning }
          });
          window.dispatchEvent(warningEvent);
        }, index * 1000); // 1 second delay between warnings
      });
      
      setQueuedWarnings([]); // Clear the queue
    }
  };

  const connectToStation = (policeStationId) => {
    if (socketRef.current) {
      // the emit method is used to Send Events from the Client to the Server or Vice Versa
       //It allows you to send a custom event along with data over the WebSocket connection.
       //syntax socket.emit(eventName, data);

      socketRef.current.emit("register", { policeStationId });
      console.log(
        `WebSocket registered with Police Station ID: ${policeStationId}`
      );
    }
  };

  const connectToDistrict = (districtId, authorityId) => {
    if (socketRef.current) {
      socketRef.current.emit("register", { districtId, authorityId });
      console.log(
        `WebSocket registered for District Officer - District ID: ${districtId}, Authority ID: ${authorityId}`
      );
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ 
        socket: socketRef.current, 
        connectToStation, 
        connectToDistrict, 
        alert, 
        clearAlert,
        queueWarning,
        isAlertActive,
        queuedWarnings: queuedWarnings.length
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
