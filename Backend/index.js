// 1. Load Environment Variables First
import dotenv from "dotenv";
dotenv.config();

// 2. Core Dependencies
import express from "express";
import cors from "cors"; 
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoose from "mongoose"; 
import { createServer } from "node:http";

// 3. Custom Modules & Internal Imports
import { connectToSocket } from "./src/controllers/socketManager.js";
import User from "./src/models/userModel.js";
import userRoutes from "./src/routes/users.js";

const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);

// 4. Initialize Socket.io Connection
connectToSocket(server);

// 5. Connect to MongoDB 
try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("MongoDB connected successfully.");
} catch (error) {
  console.error("MongoDB connection error:", error);
  process.exit(1);
}

// 6. Session Configuration 
const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
};

// 7. Express Global Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use(session(sessionOptions));

// 8. Passport Auth Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 9. API Routes
app.use("/auth", userRoutes);

// 10. Start Server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});