import Authority from "../../models/web_models/authority.js";
import District from "../../models/web_models/district.js";
import PoliceStation from "../../models/web_models/police_station.js";
import jwt from "jsonwebtoken";

async function web_signin(req, res) {
  try {
    const { district, policeStation, email, password } = req.body;

    // Validate required fields
    if (!district || !email || !password) {
      return res
        .status(400)
        .json({ message: "District, email, and password are required" });
    }

    // Find the authority by email
    const user = await Authority.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let districtExists;
    // Validate district
    if (policeStation !== "Not Applicable") {
      districtExists = await District.findOne({ name: district });
      if (!districtExists) {
        return res.status(404).json({ message: "District not found" });
      }
    } else {
      districtExists = await District.findOne({
        name: district,
        authority_id: user._id,
      });
      if (!districtExists) {
        return res.status(404).json({ message: "District not found" });
      }
    }

    let policeStationExists;
    // Validate police station if applicable
    if (policeStation !== "Not Applicable") {
      policeStationExists = await PoliceStation.findOne({
        name: policeStation,
        authority_id: user._id,
      });
      if (!policeStationExists) {
        return res.status(404).json({ message: "Police station not found" });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        districtId: districtExists._id,
        policeStationId:
          policeStation !== "Not Applicable" ? policeStationExists._id : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // Respond with token
    res.status(200).json({
      message: "Sign-in successful",
      token,
    });
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default web_signin;
