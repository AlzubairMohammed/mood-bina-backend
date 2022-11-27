"use strict";
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlware/async");
const { SubSections } = require("../models");
const upload = require("../utils/fileUpload").upload;
const path = require("path");
const fs = require("fs");

// @desc    Get All SubSections
// @route   GET /api/v1/subsections
// @access  Public
exports.getSubSections = asyncHandler(async (req, res, next) => {
  const subSections = await SubSections.findAll({
    include: ["sections"],
  });
  if (subSections) return res.status(200).json(subSections);
  next(new ErrorResponse());
});

// @desc    Get Single SubSection
// @route   GET /api/v1/subsections/:id
// @access  Public
exports.getSubSection = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const subSection = await SubSections.findOne({ where: { id } });
  if (!subSection) return next(new ErrorResponse("sub section not found", 404));
  if (subSection) return res.status(200).json(subSection);
  next(new ErrorResponse());
});

// @desc    Create New SubSection
// @route   POST /api/v1/subsections
// @access  Private
exports.createSubSection = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) return next(new ErrorResponse("please upload images only", 400));

      const { name, sections_id } = req.body;
      if (!name) return next(new ErrorResponse("please add a name"), 400);
      if (req.files[0] === undefined)
        return next(new ErrorResponse("please add an image"), 400);
      const image = req.files[0].filename;
      const subSection = await SubSections.create({
        name,
        sections_id,
        image,
      });
      if (subSection)
        return res
          .status(201)
          .json({ success: true, message: `subSection created` });
    });
  } catch (err) {
    next(new ErrorResponse());
  }
};

// @desc    Update SubSection
// @route   PUT /api/v1/subsections/:id
// @access  Private
exports.updateSubSection = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return next(new ErrorResponse("please upload images only", 400));
    const id = req.params.id;
    const { name, sections_id } = req.body;
    let image;
    let subSection = await SubSections.findOne({ where: { id } });
    if (!subSection)
      return next(new ErrorResponse("sub section not found", 404));
    image = subSection.image;
    // check for image
    if (req.files[0] != undefined) {
      // delete old image from upload
      image = req.files[0].filename;
      fs.unlinkSync(
        path.join(__dirname, `../public/uploads/${subSection.image}`)
      );
    }
    if (
      await SubSections.update({ name, sections_id, image }, { where: { id } })
    )
      return res
        .status(203)
        .json({ success: true, message: `sub Section updated` });
    next(new ErrorResponse());
  });
});

// @desc    Delete SubSection
// @route   DELETE /api/v1/subsections/:id
// @access  Private
exports.deleteSubSection = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let subSection = await SubSections.findOne({ where: { id } });
  if (!subSection) return next(new ErrorResponse("sub section not found", 404));

  // delete image from upload
  fs.unlinkSync(path.join(__dirname, `../public/uploads/${subSection.image}`));
  if (await SubSections.destroy({ where: { id } }))
    return res
      .status(200)
      .json({ success: true, message: `subSection deleted` });
  next(new ErrorResponse());
});
