import jwt from "jsonwebtoken";
import Authority from "../models/web_models/authority.js";
import District from "../models/web_models/district.js";
import PoliceStation from "../models/web_models/police_station.js";

const verifyToken = async (req, res) => {
  try {
    // Get the token from the Authorization header

    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database
    const user = await Authority.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch district details
    let district = null;
    if (decoded.districtId) {
      district = await District.findById(decoded.districtId);
      if (!district) {
        return res.status(404).json({ message: "District not found" });
      }
    }

    // Fetch police station details if applicable
    let policeStation = null;
    if (decoded.policeStationId) {
      policeStation = await PoliceStation.findById(decoded.policeStationId);
      if (!policeStation) {
        return res.status(404).json({ message: "Police station not found" });
      }
    }

    // Attach user, district, and police station details to the request
    req.user = {
      ...user.toObject(),
      district,
      policeStation,
    };

    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid access token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyToken;
