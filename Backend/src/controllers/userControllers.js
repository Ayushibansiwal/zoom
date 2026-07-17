import User from "../models/userModel.js";
import httpStatus from "http-status";
import passport from "passport";

export const signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);

    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(httpStatus.CREATED).json({
        message: "User registered successfully",
        user: registerUser,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Login successful",
        user,
      });
    });
  })(req, res, next);
};

export const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.status(httpStatus.OK).json({
      message: "Logout successful",
    });
  });
};


export const getCurrentUser = (req, res) => {

    if (!req.user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "Not authenticated",
        });
    }

    return res.status(httpStatus.OK).json({
        success: true,
        user: req.user,
    });

};