const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const dbURI = "mongodb://127.0.0.1:27017/TripEase";

// MongoDB connection and DB init
async function main() {
  try {
    await mongoose.connect(dbURI);
    console.log("✅ Connected to MongoDB");

    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("✅ Database initialized with data");

    // Optional: close connection if script-only
    await mongoose.connection.close();
  } catch (err) {
    console.log("❌ Error:", err);
  }
}

main();
