require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing");
const Review = require("./models/review");
const Booking = require("./models/booking");
const User = require("./models/user");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 8080;

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/TripEase")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session & Store
app.use(session({
  secret: "trip-ease-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/TripEase",
    ttl: 60 * 60 * 24, // 1 day
    autoRemove: 'native'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
}));

// ✅ Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Make user available to templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ✅ Middleware to protect routes
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
}


// ✅ Multer Setup for File Uploads
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });




// ✅ Intro logic (once per session)
app.get("/", (req, res) => {
  // Always show intro first on startup
  if (!req.session.introShown) {
    req.session.introShown = true;
    return res.redirect("/intro");
  }

  // After intro shown once in the session
  return req.isAuthenticated() ? res.redirect("/home") : res.redirect("/login");
});


app.get("/intro", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/home");
  req.session.introShown = true;
  res.render("auth/intro");
});

// ✅ Auth Routes
app.get("/intro", (req, res) => {
  res.render("auth/intro"); // Show the intro screen
});


app.get('/register', (req, res) => {
  res.render('auth/register', { error: null }   );
});



// Handle register: STEP 1 – Save temp user and send OTP
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render("auth/register", { error: "Username or Email already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save temp user details and OTP in session
    req.session.tempUser = { username, email, password, otp };

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "TripEase OTP Verification",
      text: `Your OTP for TripEase registration is: ${otp}`,
    });

    res.redirect("/verify-otp");
  } catch (e) {
    res.send("Registration error: " + e.message);
  }
});


app.get("/verify-otp", (req, res) => {
  res.render("auth/verifyOtp", { error: null });
});


app.post("/verify-otp", async (req, res) => {
  const { enteredOtp } = req.body;

  if (!req.session.tempUser) {
    return res.redirect("/register");
  }

  const { username, email, password, otp } = req.session.tempUser;

  if (parseInt(enteredOtp) === otp) {
    try {
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      
      req.login(registeredUser, (err) => {
        req.session.tempUser = null;
        if (err) return res.send("Login error after registration.");
        return res.render("auth/successRegister");
      });
    } catch (e) {
      return res.send("Registration failed after OTP: " + e.message);
    }
  } else {
    return res.render("auth/verifyOtp", { error: "Invalid OTP. Please try again." });
  }
});



app.get("/login", (req, res) => {
  const error = req.session.loginError || null;
  delete req.session.loginError;
  res.render("auth/login", { error });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err || !user) {
      req.session.loginError = "Invalid username or password!";
      return res.redirect("/login");
    }
    req.logIn(user, err => {
      if (err) {
        req.session.loginError = "Login failed. Please try again.";
        return res.redirect("/login");
      }
      return res.render("auth/successLogin");
    });
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.introShown = false;
    res.redirect("/intro");
  });
});

//forgot password
app.get("/forgot-password", (req, res) => {
  res.send("Forgot Password Page - Not Implemented Yet");
});



// ✅ Home Page
app.get("/home", isLoggedIn, (req, res) => {
  res.render("listings/home");
});

// ✅ Listings
app.get("/listings", isLoggedIn, async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index", { allListings });
});

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

app.post("/listings", isLoggedIn, upload.single("imageFile"), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      image: imageUrl
    } = req.body;

    let finalImage = imageUrl;

    if (!imageUrl && req.file) {
      finalImage = `/uploads/${req.file.filename}`; // static path
    }

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image: finalImage || "https://via.placeholder.com/600x400?text=No+Image"
    });

    await newListing.save();
    res.redirect("/listings");
  } catch (e) {
    console.error("❌ Listing creation failed:", e);
    res.status(500).send("Something went wrong.");
  }
});

app.get("/listings/:id", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  res.render("listings/show", { listing });
});

app.get("/listings/:id/edit", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
});

app.put("/listings/:id", isLoggedIn, async (req, res) => {
  const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.redirect(`/listings/${updatedListing._id}`);
});

app.delete("/listings/:id", isLoggedIn, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
});

// ✅ Reviews
app.post("/listings/:id/reviews", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
  await review.save();
  listing.reviews.push(review);
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});

app.delete("/listings/:listingId/reviews/:reviewId", isLoggedIn, async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.listingId, {
    $pull: { reviews: req.params.reviewId }
  });
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/listings/${req.params.listingId}`);
});

// ✅ Likes
app.post("/listings/:id/like", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (!req.user.likedListings.includes(id)) {
    req.user.likedListings.push(id);
    await req.user.save();
  }
  res.redirect(`/listings/${id}`);
});

app.post("/listings/:id/unlike", isLoggedIn, async (req, res) => {
  req.user.likedListings = req.user.likedListings.filter(
    (listingId) => listingId.toString() !== req.params.id
  );
  await req.user.save();
  res.redirect(`/listings/${req.params.id}`);
});

// ✅ Bookings
app.post("/listings/:id/book", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const { date, guests } = req.body;

  const booking = new Booking({
    user: req.user._id,
    listing: listing._id,
    date,
    guests
  });

  await booking.save();

  req.user.bookings.push(booking._id);
  await req.user.save();

  res.redirect("/profile");
});

// ✅ Search
app.get("/search", isLoggedIn, async (req, res) => {
  const query = req.query.q.trim();
  const listings = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { country: { $regex: query, $options: "i" } }
    ]
  });

  if (listings.length === 1) {
    return res.redirect(`/listings/${listings[0]._id}`);
  } else {
    return res.render("listings/searchResults", { listings, query });
  }
});

// ✅ Profile Page
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("likedListings")
      .populate({ path: "bookings", populate: { path: "listing" } });

    res.render("listings/profile", {
      user: {
        name: user.username,
        email: user.email, // ✅ Use actual email now
        listings: user.likedListings,
        bookings: user.bookings
      }
    });
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    res.status(500).send("Error loading profile");
  }
});


// ✅ Cancel Booking
app.delete("/bookings/:id", isLoggedIn, async (req, res) => {
  const bookingId = req.params.id;

  // Remove booking from user's list
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { bookings: bookingId }
  });

  // Delete the booking itself
  await Booking.findByIdAndDelete(bookingId);

  res.redirect("/profile");
});


// ✅ Server Listen
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
