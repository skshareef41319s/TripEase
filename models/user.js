const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address."]
  },
  likedListings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing"
    }
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Adds username, hash, salt fields + register, authenticate methods
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username' // still using username for login, not email
});

module.exports = mongoose.model("User", userSchema);
