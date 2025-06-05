const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const app = express();
const port = 8080;
app.use(methodOverride("_method")); // Allows using DELETE method in forms

const dbURI = "mongodb://127.0.0.1:27017/TripEase";

// MongoDB connection
async function main() {
  try {
    await mongoose.connect(dbURI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
}

main();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); 

// Root Route
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});


app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find(); // Get all listings from the database
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Internal Server Error");
  }
});

// New Listing Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Listing Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (listing) {
      res.render("listings/show.ejs", { listing });
    } else {
      res.status(404).send("Listing not found.");
    }
  } catch (err) {
    console.error("Error fetching listing details:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create Listing Route
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country,
      image: req.body.image || "https://via.placeholder.com/600x400?text=No+Image", // Default image
    });

    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Edit Listing Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (listing) {
      res.render("listings/edit.ejs", { listing });
    } else {
      res.status(404).send("Listing not found.");
    }
  } catch (err) {
    console.error("Error fetching listing for edit:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update Listing Route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensure model validations run on update
    });

    if (updatedListing) {
      res.redirect(`/listings/${updatedListing._id}`);
    } else {
      res.status(404).send("Listing not found.");
    }
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete Listing Route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing) {
      res.redirect("/listings");
    } else {
      res.status(404).send("Listing not found.");
    }
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/profile", async (req, res) => {
  const user = {
    name: "Shareef",
    email: "skshareef41319@gmail.com",
    listings: await Listing.find({ owner: "Shareef" }), // Default, no such owner field in Listing model
  };
  res.render("listings/profile", { user });
});


// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
