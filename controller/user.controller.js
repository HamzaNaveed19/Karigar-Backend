import User from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendSMS } from "../middleWare/smsAPI.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      roles: [],
      otp: {
        code: otpCode,
        expiresAt: otpExpires,
      },
    });

    await sendSMS({
      num: phone,
      msg: `Your OTP code for Karigar Account is : ${otpCode}`,
    });

    console.log("OTP sent to phone:", phone);
    console.log("OTP code:", otpCode);

    res.status(201).json({
      message: "User registered. OTP sent to phone.",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp.code === otp && new Date() < new Date(user.otp.expiresAt)) {
      user.otp = undefined;
      await user.save();

      return res
        .status(200)
        .json({ message: "OTP verified"});
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });


    if (role && !user.roles.includes(role)) {
      return res
        .status(403)
        .json({ message: "User does not have the required role" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });


    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
