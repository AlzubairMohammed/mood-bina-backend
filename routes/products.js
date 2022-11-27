const router = require("express").Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const {
  protect,
  authorize,
  authorizeCreate,
  authorizeUpdate,
} = require("../middlware/auth");

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin"), authorizeCreate(), createProduct);
//protect, authorize("admin"), authorizeCreate(),
router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), authorizeUpdate(), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);
module.exports = router;
