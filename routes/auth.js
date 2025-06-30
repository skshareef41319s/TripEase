const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Show register form
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Handle register
router.post("/register", async (req, res) => {
  try {
    const user = new User({ username: req.body.username, email: req.body.email });
    const registeredUser = await User.register(user, req.body.password);
    req.login(registeredUser, () => {
      res.redirect("/listings");
    });
  } catch (e) {
    res.send("Registration Failed: " + e.message);
  }
});

// Show login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Handle login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/listings",
  failureRedirect: "/login",
}));

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
