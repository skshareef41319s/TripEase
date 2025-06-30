# ✈️ TripEase — Plan Smart. Travel Easy.

Welcome to **TripEase**, your modern travel planning companion.  
Built with a powerful tech stack and a beautiful UI, TripEase helps you explore destinations, plan trips, save favorites, and more — all in one seamless experience.

---

## 🌟 Features

- 🔐 **User Authentication** — Secure login & registration with session support
- 🎬 **Intro Animation** — Eye-catching welcome screen with animation and sound
- 🔍 **Search Functionality** — Instantly find and view destination details
- ❤️ **Like/Unlike Destinations** — Save your favorites to your profile
- 💬 **Reviews & Ratings** — Leave feedback and rate places
- 🗺️ **Destination Listings** — Add, view, edit, and delete travel spots
- 👤 **User Profile** — See your liked destinations and manage your profile
- 🚪 **Logout Handling** — Session-safe logout with intro replay on next login
- 🎨 **Modern UI** — Beautiful animations, responsive layout, clean navigation

---

## 🛠️ Tech Stack

- **Frontend**: EJS, JavaScript, CSS, Bootstrap, Feather Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js (Local Strategy)
- **Session Store**: connect-mongo

---

## ⚙️ Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) installed and running locally

### 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/skshareef41319s/TripEase.git
cd TripEase

# Install dependencies
npm install

# Start MongoDB locally (if required)
# mongod

# Run the server
npm start
```

Visit [http://localhost:8080](http://localhost:8080) to view the app in your browser.

---

## 🗂️ Folder Structure

```
TripEase/
│
├── public/             # Static assets (CSS, JS, images)
├── views/
│   ├── auth/           # Login, Register, Intro
│   └── listings/       # Index, Show, New, Edit, Profile
├── models/             # Mongoose schemas for User, Listing, Review
├── routes/             # (Optional if using route files)
├── app.js              # Main application logic
└── README.md
```

---

## 📸 Screenshots

<!-- Add UI screenshots showcasing intro page, login, listings, profile, etc. -->

---

## 📌 To-Do / Possible Enhancements

- ✅ File upload support (e.g. Cloudinary for listing images)
- 🌐 Google Maps integration for location previews
- 🗓️ Trip planning calendar view
- 📧 Contact / Support page
- 💡 Admin controls (for managing listings/reviews)

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repository
2. **Create your feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'feat: add feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature
   ```
5. **Open a Pull Request** ✅

---

## 🙋 Contact

Created by [skshareef41319s](https://github.com/skshareef41319s)  
📞 **Mobile:** 8096202611  
✉️ **Email:** skshareef41319@gmail.com  
For questions, suggestions, or collaborations, feel free to reach out or [open an issue](https://github.com/skshareef41319s/TripEase/issues)!

---

> 🌍 Plan Smart. Travel Easy. — with TripEase.

---

<!-- Badges example: Uncomment or add your own!
![Node.js](https://img.shields.io/badge/Node.js-Enabled-green?logo=node.js)
![Stars](https://img.shields.io/github/stars/skshareef41319s/TripEase?style=social)
-->
