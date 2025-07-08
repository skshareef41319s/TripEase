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
const User = require("./models/user");

const app = express();
const port = 8080;

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/TripEase")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Set view engine
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

// ✅ Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Pass user to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ✅ Middleware for protected routes
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
}

// ✅ Root Route — Show intro once, then login or home
app.get("/", (req, res) => {
  if (req.session.introShown) {
    return res.redirect("/intro");
  }
  return req.isAuthenticated() ? res.redirect("/home") : res.redirect("/login");
});

// ✅ Intro Page
app.get("/intro", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/home");
  req.session.introShown = true; // mark intro as shown
  res.render("auth/intro");
});


// ✅ Home Page
app.get("/home", isLoggedIn, (req, res) => {
  res.render("listings/home");
});

// ✅ Register
app.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      res.redirect("/home");
    });
  } catch (e) {
    const message = e.name === "UserExistsError"
      ? "Username already exists. Please choose a different one."
      : "Registration failed. Please try again.";
    res.render("auth/register", { error: message });
  }
});

// ✅ Login
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
      res.redirect("/home");
    });
  })(req, res, next);
});

// ✅ Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.introShown = false; // reset intro on logout
    res.redirect("/intro");
  });
});

// ✅ Listings
app.get("/listings", isLoggedIn, async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index", { allListings });
});

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

app.post("/listings", isLoggedIn, async (req, res) => {
  const newListing = new Listing({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    country: req.body.country,
    image: req.body.image || "https://via.placeholder.com/600x400?text=No+Image"
  });
  await newListing.save();
  res.redirect("/listings");
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

// ✅ Like / Unlike
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

// ✅ Profile
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("likedListings");
    res.render("listings/profile", {
      user: {
        name: user.username,
        email: `${user.username}@tripease.com`,
        listings: user.likedListings
      }
    });
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    res.status(500).send("Error loading profile");
  }
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
