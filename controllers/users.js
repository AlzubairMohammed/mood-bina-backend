"use strict";
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlware/async");
const { Users } = require("../models");
const upload = require("../utils/fileUpload").upload;
const path = require("path");
const fs = require("fs");

// @desc    Get All Users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await Users.findAll({ include: ["products"] });
  if (users) return res.status(200).json(users);
  next(new ErrorResponse());
});

// @desc    Get Single User
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await Users.findOne({ where: { id }, include: ["products"] });
  if (!user) return next(new ErrorResponse("user not found", 404));
  if (user) return res.status(200).json(user);
  next(new ErrorResponse());
});

// @desc    Create New User
// @route   POST /api/v1/users
// @access  Private
exports.createUser = async (req, res, next) => {
  res.status(201).json({ success: true, message: `create user` });
};

// @desc    Update User
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(new ErrorResponse("please upload images only", 404));
      const { name, email, country, tel, address, role, c, u, d } = req.body;
      const id = req.params.id;
      let image;
      const user = await Users.findOne({ where: { id } });
      if (!user) return next(new ErrorResponse("user not found", 404));
      image = user.image;
      // check for image
      if (req.files[0] !== undefined) {
        // delete old image from upload
        fs.unlinkSync(path.join(__dirname, `../public/uploads/${user.image}`));
        image = req.files[0].filename;
      }
      const password = user.password;
      if (
        await Users.update(
          {
            name,
            email,
            password,
            country,
            tel,
            address,
            image,
            role,
            c,
            u,
            d,
          },
          { where: { id } }
        )
      )
        return res.status(203).json({ success: true, message: "user updated" });
    });
  } catch (err) {
    return next(new ErrorResponse());
  }
};

// @desc    Delete User
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let user = await Users.findOne({ where: { id } });
  if (!user) return next(new ErrorResponse("user not found", 404));
  // delete image from upload
  fs.unlinkSync(path.join(__dirname, `../public/uploads/${user.image}`));
  if (await Users.destroy({ where: { id } }))
    return res.status(200).json({ success: true, message: `user deleted` });
  next(new ErrorResponse());
});
