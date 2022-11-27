const router = require("express").Router();
const {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sections");
const {
  protect,
  authorize,
  authorizeCreate,
  authorizeUpdate,
} = require("../middlware/auth");

router
  .route("/")
  .get(getSections)
  .post(protect, authorize("admin"), authorizeCreate(), createSection);
router
  .route("/:id")
  .get(getSection)
  .put(protect, authorize("admin"), authorizeUpdate(), updateSection)
  .delete(protect, authorize("admin"), deleteSection);
module.exports = router;
