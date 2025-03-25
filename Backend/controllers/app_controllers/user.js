import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/app_models/User.js";
import PoliceStation from "../../models/web_models/police_station.js";
import AlertReport from "../../models/common_models/report_crime.js";
async function app_signin(req, res) {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User Does Not Exits" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id},
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ token,user:userWithoutPassword });
    console.log("User signin successful");
  } catch (error) {
    console.log("Error while signin : ", error);
  }
}

async function app_signup(req, res) {
  const { name, email, aadhar, phone, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      aadhar,
      phone,
      password,
    });

    // Save user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token
    });
    console.log("User registered");
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.log("error while user signup",error);
  }
}

async function validate_token(req, res) {
  console.log("App validate  token method called");
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password")
    console.log('user in verifytoken method :',user);
    return res.status(200).json({ valid: true, user });
  } catch (error) {
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
}

const getCrimeAnalytics = async (req, res) => {
  try {
    const {station} = req.params;
    // console.log(`getAnalytics by app ${station}`)
    const policeStation = await PoliceStation.findOne({ name: station }).populate("district_id");



    if (!policeStation)
      return res.status(404).json({ error: "Police station not found" });

    const alerts = await AlertReport.find({ PoliceStationID: policeStation._id });

    if (!alerts.length) {
      return res.status(200).json({
        message: "No alerts found for this police station.",
      });
    }

    // Current Date Information
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Filter alerts for the current month and latest 7 days
    const alertsCurrentMonth = alerts.filter(
      (alert) =>
        alert.Time.getMonth() === currentMonth &&
        alert.Time.getFullYear() === currentYear
    );
    const alertsLast7Days = alerts.filter(
      (alert) => alert.Time >= sevenDaysAgo
    );

    // Calculate Crime Types (for the current month)
    const types = alertsCurrentMonth.reduce((acc, alert) => {
      acc[alert.AlertType] = (acc[alert.AlertType] || 0) + 1;
      return acc;
    }, {});

    // Calculate Crime Counts (for the current month)
  const crimeCounts = Object.entries(types).map(([name, count]) => ({
      name,
      count,
    }));

    // Calculate Monthly and Daily Counts
    // Initialize data structures
    const monthly = {};
    const daily = {};
    const stats = {};

    // Aggregate data for monthly counts (current month), daily counts (last 7 days), and stats (current month)
    alertsCurrentMonth.forEach((alert) => {
      const alertType = alert.AlertType;
      const status = alert.Status.toLowerCase();

      // Initialize crime type in stats if not present
      if (!stats[alertType]) {
        stats[alertType] = { total: 0, pending: 0, solved: 0 };
        monthly[alertType] = Array(12).fill(0); // Monthly counts (Jan-Dec)
      }

      // Update stats
      stats[alertType].total++;
      if (status === "pending") stats[alertType].pending++;
      if (status === "closed") stats[alertType].solved++;

      // Update monthly counts
      const monthIndex = alert.Time.getMonth();
      monthly[alertType][monthIndex]++;
    });

    alertsLast7Days.forEach((alert) => {
      const alertType = alert.AlertType;

      // Initialize crime type in daily counts if not present
      if (!daily[alertType]) {
        daily[alertType] = Array(7).fill(0); // Daily counts (Sun-Sat)
      }

      // Update daily counts
      const dayIndex = alert.Time.getDay(); // 0 (Sunday) to 6 (Saturday)
      daily[alertType][dayIndex]++;
    });

    // Prepare Response
    const response = {
      stationName: policeStation.name,
      districtName: policeStation.district_id.name,
      types: Object.entries(types).map(([name, count]) => ({
        name,
        percentage: parseFloat(
          ((count / alertsCurrentMonth.length) * 100).toFixed(2)
        ), // Rounded to 2 decimal places
      })),
      crimeCounts,
      monthly,
      daily,
      stats,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { app_signup, app_signin, validate_token, getCrimeAnalytics};


