"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlware/async");
const { Users } = require("../models");
const ErrorResponse = require("../utils/errorResponse");
const upload = require("../utils/fileUpload").upload;
require("dotenv").config();

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      let image;
      const { name, email, password, country, tel, role, address } = req.body;
      if (!name) return next(new ErrorResponse("please add a name", 400));
      if (!email) return next(new ErrorResponse("please add an email", 400));
      if (!password)
        return next(new ErrorResponse("please add a password", 400));
      if (!country) return next(new ErrorResponse("please add a country", 400));
      if (!tel)
        return next(new ErrorResponse("please add a phone number", 400));
      if (!address)
        return next(new ErrorResponse("please add an address", 400));
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      if (req.files[0] === undefined)
        return next(new ErrorResponse("please add an image", 400));
      image = req.files[0].filename;
      const user = await Users.create({
        name,
        email,
        password: hashedPassword,
        country,
        image,
        tel,
        role,
        address,
      });
      if (user) return res.status(200).json({ success: true });
    });
  } catch (err) {
    next(new ErrorResponse());
  }
};

// @desc    Logging user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email and password
  if (!email) return next(new ErrorResponse("please enter your email", 400));
  if (!password)
    return next(new ErrorResponse("please enter your password", 400));
  // Check for user
  const user = await Users.findOne({ where: { email } });
  if (!user) return next(new ErrorResponse("user not found", 404));
  // Match pssword
  if (await bcrypt.compare(password, user.password)) {
    // Create token
    sendTokenResponse(user, 200, res);
  } else {
    return next(new ErrorResponse("password incorrect", 404));
  }
});

// @desc    Get current Logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  if (!user) return next(new ErrorResponse("user not found", 404));
  if (user) return res.status(200).json({ success: true, data: user });
  next(new ErrorResponse());
});
// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return res.status(200).json({ success: true, data: {} });
  next(new ErrorResponse());
});
// Format of token
// Authorizaton: Bearer <access_token>
// Verify token
exports.verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if the bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // Next middleware
    return next();
  } else {
    // Forbidden
    return res.status(403).json({ message: "Forbidden" });
  }
};

// Get token from model, create cookie and send response

const sendTokenResponse = async (user, statusCode, res) => {
  jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
    const options = {
      httpOnly: true,
    };

    if (process.env.NODE_ENC === "production") {
      options.secure = true;
    }
    if (!err)
      return res
        .status(statusCode)
        .cookie("token", token, options)
        .json({ token, success: true });
  });
};
