// models/user.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    trim: true
    // Optional: add validation like match: /@.+\..+/
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

// Plug in passport-local-mongoose to handle username + password auth
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);