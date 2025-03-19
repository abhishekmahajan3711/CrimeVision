import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/app_models/User.js";
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
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
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
        id: newUser._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
    console.log("User registered");
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.log("error while user signup",error);
  }
}

async function validate_token(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
}
export { app_signup, app_signin, validate_token };
