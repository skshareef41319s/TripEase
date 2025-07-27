const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// 🔐 Setup secure Gmail transporter (via .env)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,   // Your Gmail address
    pass: process.env.GMAIL_PASS    // App Password from Google
  }
});

// ✅ Show register form
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

// ✅ Step 1: Handle registration request and send OTP
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Gmail check
  if (!email.endsWith("@gmail.com")) {
    return res.render("auth/register", { error: "Only Gmail addresses are accepted." });
  }

  // Check for existing email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("auth/register", { error: "This email is already in use." });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Temporarily store user + OTP in session
  req.session.tempUser = { username, email, password, otp };

  // Send OTP via Gmail
  try {
    await transporter.sendMail({
      to: email,
      subject: "TripEase - Verify Your Email",
      html: `
        <h3>Hello ${username},</h3>
        <p>Your OTP for TripEase registration is:</p>
        <h2 style="color: #2a9d8f;">${otp}</h2>
        <p>This OTP is valid for a short time. Do not share it.</p>
      `
    });

    return res.render("auth/verifyOtp", { error: null });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    return res.render("auth/register", { error: "Could not send OTP. Please try again." });
  }
});

// ✅ Step 2: Verify OTP and complete registration
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  const tempUser = req.session.tempUser;

  if (!tempUser) return res.redirect("/register");

  if (otp !== tempUser.otp) {
    return res.render("auth/verifyOtp", { error: "Incorrect OTP. Please try again." });
  }

  try {
    const newUser = new User({ username: tempUser.username, email: tempUser.email });
    const registeredUser = await User.register(newUser, tempUser.password);

    req.login(registeredUser, (err) => {
      req.session.tempUser = null;
      if (err) return res.redirect("/login");
      return res.redirect("/listings");
    });
  } catch (e) {
    console.error("❌ Registration failed:", e);
    return res.send("Registration failed: " + e.message);
  }
});

// ✅ Show login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// ✅ Handle login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/listings",
  failureRedirect: "/login"
}));

// ✅ Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
