"use strict";

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlware/async");
const { Products, Images } = require("../models");
const upload = require("../utils/fileUpload").upload;
const path = require("path");
const fs = require("fs");

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Products.findAll({
    include: ["image", "user", "sub_sections"],
  });
  if (!products) return next(new ErrorResponse("products not found", 404));
  if (products) return res.status(200).json(products);
  next(new ErrorResponse());
});

// @desc    Get Single Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await Products.findOne({
    where: { id },
    include: ["image", "user", "sub_sections"],
  });
  if (!product) return next(new ErrorResponse("product not found", 404));
  if (product) return res.status(200).json(product);
  next(new ErrorResponse());
});

// @desc    Create New Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      const { name, price, qty, user_id, sub_section_id } = req.body;
      let image;
      if (!name)
        return next(new ErrorResponse("product must have a name", 400));
      if (!sub_section_id)
        return next(new ErrorResponse("product must have a sub category", 400));
      if (!price)
        return next(new ErrorResponse("product must have a price", 400));
      if (!qty)
        return next(new ErrorResponse("product must have a quantity", 400));
      if (err) return next(new ErrorResponse("please upload images only", 400));
      if (req.files[0] === undefined)
        return next(new ErrorResponse("product must have an image", 400));
      image = req.files[0].filename;
      const product = await Products.create({
        name,
        price,
        qty,
        user_id,
        sub_section_id,
      });
      const images = await Images.create({
        image,
        product_id: product.id,
      });
      if (product && images)
        return res
          .status(201)
          .json({ success: true, message: `product created` });
    });
  } catch (err) {
    next(new ErrorResponse());
  }
};

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    const id = req.params.id;
    const { name, price, qty, user_id, sub_section_id } = req.body;
    if (err) return next(new ErrorResponse("please upload images only", 400));
    let image;
    let product = await Images.findOne({ where: { product_id: id } });
    if (!product) return next(new ErrorResponse("product not found", 404));
    image = product.image;
    // check for image
    if (req.files[0] != undefined) {
      // delete old image from upload
      fs.unlinkSync(path.join(__dirname, `../public/uploads/${product.image}`));
      image = req.files[0].filename;
    }
    const newProduct = await Products.update(
      { name, price, qty, user_id, sub_section_id },
      { where: { id } }
    );
    const newImages = await Images.update(
      { image, product_id: id },
      { where: { product_id: id } }
    );
    if (newProduct && newImages)
      return res
        .status(203)
        .json({ success: true, message: `product updated` });
    next(new ErrorResponse());
  });
});

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let product = await Products.findOne({ where: { id } });
  let image = await Images.findOne({ where: { product_id: id } });
  if (!product) return next(new ErrorResponse("product not found", 404));
  if (!image) return next(new ErrorResponse("image not found", 404));
  // delete image from upload
  fs.unlinkSync(path.join(__dirname, `../public/uploads/${image.image}`));
  if (
    (await Images.destroy({ where: { product_id: id } })) &&
    (await Products.destroy({ where: { id } }))
  )
    return res.status(200).json({ success: true, message: `product deleted` });
  next(new ErrorResponse());
});
