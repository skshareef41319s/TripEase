# TripEase — Plan Smart. Travel Easy.

TripEase is a full-stack travel planning platform that helps users discover destinations, manage trips, save favorites, leave reviews, and interact with a travel-focused community. The application is built to be modular, secure, and easy to extend.

## Key features

- Secure authentication with Passport.js (local strategy), OTP verification, and session management
- Intro page with a polished, animated experience
- Search and filter destinations by title, location, or country
- Save and remove favorites (like/unlike)
- Add, edit, and delete reviews and ratings
- Full CRUD for destination listings with image uploads (Cloudinary)
- User dashboard to manage favorites and bookings
- Contact form using Nodemailer
- Safe logout and the ability to replay the intro
- Input validation, error handling, hashed passwords, and secure sessions
- Responsive modern UI with Bootstrap and utility components

## Technology stack

- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: Passport.js (local), session support, OTP flow
- File uploads: Multer and Cloudinary
- Email: Nodemailer
- Frontend: EJS templating, Bootstrap, custom CSS/JS
- Optional security tools: Helmet, connect-mongo for session storage

## Quick start

Prerequisites
- Node.js (LTS)
- MongoDB (local or Atlas)

Install and run locally
```bash
git clone https://github.com/skshareef41319s/TripEase.git
cd TripEase
npm install
# Start MongoDB if running locally (e.g. mongod)
npm start
```

By default the app listens on port 8080. Open http://localhost:8080 to view the site.

## Environment variables

Create a `.env` file in the project root and include values for sensitive configuration. Typical variables:

- MONGODB_URI - MongoDB connection string
- SESSION_SECRET - secret for express-session
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET - for image uploads
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS - for Nodemailer
- OTHER_PROVIDER_KEYS - any third-party API keys (optional)

Keep `.env` out of version control.

## Project structure

```
TripEase/
├── app.js                 # Express app setup and middleware
├── cloudConfig.js         # Cloudinary configuration
├── package.json
├── public/                # Static assets: css, js, images
├── routes/                # Route modules (auth, listings, reviews, bookings, contact)
├── views/                 # EJS templates (auth, listings, pages, partials)
├── models/                # Mongoose schemas: User, Listing, Review, Booking
├── controllers/           # Route handlers and business logic
├── middleware/            # Auth guards, validation, error handlers
└── README.md
```

## Usage notes

- Authentication: register and login using Passport.js. OTP verification is optional and can be enabled in the auth flow.
- Listings: create and manage destination listings; images are uploaded to Cloudinary.
- Reviews and favorites: authenticated users can leave reviews and like/unlike listings.
- Dashboard: users can access saved favorites and bookings from their profile.
- Contact: messages from the contact form are sent using Nodemailer.

## Security and best practices

- Hash passwords before storing (bcrypt is recommended).
- Use secure session storage (connect-mongo) in production.
- Validate and sanitize user input on both client and server sides.
- Enforce file size limits and validate file types for uploads.
- Add rate limiting and CSRF protection when exposing the app publicly.
- Store secrets using environment variables or a secret manager — never commit keys to the repo.

## Testing and development tips

- Use nodemon for faster development reloads: `npx nodemon app.js`
- Seed the database locally with a small script to get sample listings and users.
- For Cloudinary testing, set up a free Cloudinary account and use separate folders for development and production assets.

## Roadmap / Future enhancements

- Google Maps integration to show listing locations
- Calendar-based trip planner and booking features
- Admin panel for user, listing, and review moderation
- Multi-factor authentication and account recovery flows
- Email notifications for booking confirmations and messages
- Pagination and search improvements for large listing sets

## Contributing

Contributions are welcome. Suggested workflow:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes with clear messages
4. Push and open a pull request describing the changes and rationale

When submitting PRs, include tests or manual verification steps for features that affect authentication, listings, or payments.

## Author & contact

Created by skshareef41319s  
Phone: 8096202611  
Email: skshareef41319@gmail.com

If you have questions, need help, or want to collaborate, open an issue or contact me directly.
