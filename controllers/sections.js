"use strict";
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlware/async");
const { Sections } = require("../models");
const upload = require("../utils/fileUpload").upload;
const path = require("path");
const fs = require("fs");

// @desc    Get All Sections
// @route   GET /api/v1/sections
// @access  Public
exports.getSections = asyncHandler(async (req, res, next) => {
  const sections = await Sections.findAll({
    include: ["sub_sections"],
  });
  if (sections) return res.status(200).json(sections);
  next(new ErrorResponse());
});

// @desc    Get Single Section
// @route   GET /api/v1/sections/:id
// @access  Public
exports.getSection = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const section = await Sections.findOne({ where: { id } });
  if (!section) next(new ErrorResponse("section not found", 404));
  if (section) return res.status(200).json(section);
  next(new ErrorResponse());
});

// @desc    Create New Section
// @route   POST /api/v1/sections
// @access  Private
exports.createSection = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(new ErrorResponse("please upload images only", 400));

      const { name } = req.body;
      if (!name) return next("please add a name", 400);
      if (req.files[0] === undefined)
        return next(new ErrorResponse("please add an image", 400));
      const image = req.files[0].filename;
      const section = await Sections.create({
        name,
        image,
      });
      if (section)
        return res
          .status(201)
          .json({ success: true, message: `sections created` });
    });
  } catch (err) {
    next(new ErrorResponse());
  }
};

// @desc    Update Sections
// @route   PUT /api/v1/sections/:id
// @access  Private
exports.updateSection = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return next(new ErrorResponse("please upload images only", 400));
    const id = req.params.id;
    const { name } = req.body;
    let image;
    let section = await Sections.findOne({ where: { id } });
    if (!section) return next(new ErrorResponse("section not found"), 404);
    image = section.image;
    // check for image
    if (req.files[0] != undefined) {
      // delete old image from upload
      image = req.files[0].filename;
      fs.unlinkSync(path.join(__dirname, `../public/uploads/${section.image}`));
    }
    if (await Sections.update({ name, image }, { where: { id } }))
      return res
        .status(203)
        .json({ success: true, message: `section updated` });
    next(new ErrorResponse());
  });
});

// @desc    Delete Sections
// @route   DELETE /api/v1/sections/:id
// @access  Private
exports.deleteSection = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let section = await Sections.findOne({ where: { id } });
  if (!section) return next(new ErrorResponse("section not found", 404));
  // delete image from upload
  fs.unlinkSync(path.join(__dirname, `../public/uploads/${section.image}`));
  if (await Sections.destroy({ where: { id } }))
    res.status(200).json({ success: true, message: `section deleted` });
  next(new ErrorResponse());
});
