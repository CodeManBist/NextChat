import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

//Get All Users 
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
}

// Register Controller
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);


    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      username: user.username,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Send cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    // secure: false, // change to true in production
    // sameSite: "strict",
    // });

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};