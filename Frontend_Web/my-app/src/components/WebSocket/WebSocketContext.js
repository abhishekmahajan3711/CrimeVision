import React, { createContext, useContext, useEffect, useRef,useState } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [alert, setAlert] = useState(null); // State to store the alert

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io("http://localhost:3001");
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
    });

    //disconnect websocket connection when we go away from the website
    return () => {
      socket.disconnect(); // Clean up WebSocket on unmount
    };
  }, []);

  const clearAlert = () => setAlert(null); // Clear the alert

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

  return (
    <WebSocketContext.Provider
      value={{ socket: socketRef.current, connectToStation, alert, clearAlert }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
