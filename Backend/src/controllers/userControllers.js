import User from "../models/userModel.js";
import httpStatus from "http-status";
import passport from "passport";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: "User already exists.",
      });
    }

    const newUser = new User({
      username,
      email,
    });

    await User.register(newUser, password);

    return res.status(httpStatus.CREATED).json({
      message: "User registered successfully.",
    });
    
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};


export const login = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(httpStatus.OK).json({
        message: "Login Successful",
        user,
      });
    });

  })(req, res, next);
};