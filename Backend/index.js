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
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// In-memory store for WebSocket connections
export const stationSockets = new Map(); // Key: PoliceStationID, Value: SocketID

// WebSocket connection
//Purpose: This event is fired whenever a new client establishes a WebSocket connection with the server.
//socket: Represents the individual WebSocket connection between the client and the server. Each client gets its unique socket.id to identify the connection.
io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  //The register event allows the client to provide additional information (like policeStationId) that the server can use to identify and manage the connection.
  // Register police station client
  socket.on("register", async ({ policeStationId }) => {
    console.log(
      `Police Station ${policeStationId} registered with socket ${socket.id}`
    );
    stationSockets.set(policeStationId, socket.id);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const disconnectedStation = [...stationSockets.entries()].find(
      ([_, id]) => id === socket.id
    )?.[0];
    if (disconnectedStation) {
      stationSockets.delete(disconnectedStation);
      console.log(`Police Station ${disconnectedStation} disconnected`);
    }
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${port}`);
  db_connect();
});


