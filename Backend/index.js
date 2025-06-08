import express from "express";
import cors from "cors";
import { db_connect } from "./utils/db.js";
import app_router from "./routes/app_routes/app_routes.js";
import web_router from "./routes/web_routes/web_routes.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use("/files",express.static("files"));
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
app.use("/api/v1", app_router);
app.use("/api/v1", web_router);

const port = process.env.PORT || 3001;

// Starting the server
// app.listen(port, "0.0.0.0", (req, res) => {
//   console.log(`Server started at port ${port}`);
//   //call function to connect to mongodb
//   db_connect();
// });

//websocket connection
//creating a server
const server = http.createServer(app);

//export so that it can  be accessed in other files also //server_controllers/controllers.js
//initalizing websocket server using http server
export const io = new Server(server, {
  cors: {
    origin: "*", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// In-memory store for WebSocket connections
export const stationSockets = new Map(); // For police stations: policeStationId -> socketId
export const districtSockets = new Map(); // For district officers: authorityId -> socketId

// WebSocket connection
//Purpose: This event is fired whenever a new client establishes a WebSocket connection with the server.
//socket: Represents the individual WebSocket connection between the client and the server. Each client gets its unique socket.id to identify the connection.
io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  //The register event allows the client to provide additional information (like policeStationId or districtId) that the server can use to identify and manage the connection.
  socket.on("register", async ({ policeStationId, districtId, authorityId }) => {
    if (policeStationId) {
      // Register police station client
      console.log(
        `Police Station ${policeStationId} registered with socket ${socket.id}`
      );
      stationSockets.set(policeStationId, socket.id);
    } else if (districtId && authorityId) {
      // Register district officer client
      console.log(
        `District Officer ${authorityId} for District ${districtId} registered with socket ${socket.id}`
      );
      districtSockets.set(authorityId, socket.id);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    // Check if disconnected socket was a police station
    const disconnectedStation = [...stationSockets.entries()].find(
      ([_, id]) => id === socket.id
    )?.[0];
    if (disconnectedStation) {
      stationSockets.delete(disconnectedStation);
      console.log(`Police Station ${disconnectedStation} disconnected`);
      return;
    }

    // Check if disconnected socket was a district officer
    const disconnectedDistrict = [...districtSockets.entries()].find(
      ([_, id]) => id === socket.id
    )?.[0];
    if (disconnectedDistrict) {
      districtSockets.delete(disconnectedDistrict);
      console.log(`District Officer ${disconnectedDistrict} disconnected`);
    }
  });
});

server.listen(port, "0.0.0.0", async () => {
  console.log(`Server started at http://localhost:${port}`);
  await db_connect();
  
  // Initialize warning configuration
  const seedWarningConfig = (await import("./utils/seedWarningConfig.js")).default;
  await seedWarningConfig();
  
  // Start warning scheduler
  const startWarningScheduler = (await import("./utils/warningScheduler.js")).default;
  startWarningScheduler();
});


