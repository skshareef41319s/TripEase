# ✈️ TripEase — Plan Smart. Travel Easy

**TripEase** is a modern full-stack travel planning platform that lets you explore destinations, manage trips, save favorites, leave reviews, and connect with a vibrant travel community — all in one seamless experience.

---

## 🌟 Features at a Glance

- 🔐 **Secure Authentication:** Passport.js login/register, OTP verification, & session management  
- 🎬 **Animated Intro:** Smooth & engaging welcome page  
- 🔍 **Destination Search:** Filter by title, location, or country  
- ❤️ **Like/Unlike Destinations:** Save favorites to your profile  
- 💬 **Reviews & Ratings:** Add, edit, delete reviews; view others’ feedback  
- 🗺️ **Destination Listings:** CRUD travel spots with image uploads (Cloudinary)  
- 👤 **User Dashboard:** View favorites and manage bookings  
- 📧 **Contact Form:** Send messages directly via Nodemailer  
- 🚪 **Secure Logout:** Session-safe logout with intro replay  
- 🛡️ **Security First:** Input validation, error handling, hashed passwords, secure sessions  
- 🎨 **Modern & Responsive UI:** Bootstrap, gradients, interactive elements  

---

## 🛠️ Tech Stack

**Frontend:** EJS, JavaScript, CSS, Bootstrap, Feather Icons  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Authentication:** Passport.js (Local), session & OTP  
**File Uploads:** Multer + Cloudinary  
**Email:** Nodemailer  
**Security:** Helmet.js (optional), connect-mongo session store  

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

```bash
git clone https://github.com/skshareef41319s/TripEase.git
cd TripEase
npm install
# Start MongoDB locally if needed
# mongod
npm start
```

Visit [http://localhost:8080](http://localhost:8080) to explore TripEase.

---

## 🗂️ Project Structure

```
TripEase/
│
├── public/             # Static assets (CSS, JS, images)
├── views/
│   ├── auth/           # Login, Register, Intro, OTP Verification
│   ├── listings/       # Index, Show, New, Edit, Profile
│   └── pages/          # Contact, Contact Success
├── models/             # Mongoose schemas: User, Listing, Review, Booking
├── routes/             # Modular route files
├── cloudConfig.js      # Cloudinary setup
├── app.js              # Main app logic
└── README.md
```

---

## 📸 Screenshots

<!-- Add UI screenshots for intro page, login, listings, profile, contact form, etc. -->

---

## 📌 Future Enhancements

- 🌐 Google Maps integration
- 🗓️ Trip planner with calendar view
- 💡 Admin controls (users, listings, reviews)
- 🔒 Advanced security: Helmet.js, rate limiting, input sanitization
- 🔔 Email notifications for booking confirmations

---

## 🤝 Contributing

1. **Fork** the repository  
2. **Create your feature branch**
    ```bash
    git checkout -b feature/your-feature
    ```
3. **Commit your changes**
    ```bash
    git commit -m 'feat: add feature'
    ```
4. **Push** to your branch
    ```bash
    git push origin feature/your-feature
    ```
5. **Open a Pull Request** ✅

---

## 🙋 Contact

Created by **skshareef41319s**  
📞 Mobile: 8096202611  
✉️ Email: skshareef41319@gmail.com  

For feedback, questions, or collaborations, feel free to reach out or [open an issue](https://github.com/skshareef41319s/TripEase/issues).

---

# 🌍 Plan Smart. Travel Easy. — with TripEase

---

