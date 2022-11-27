const router = require("express").Router();
const {
  getSubSections,
  getSubSection,
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSections");
const {
  protect,
  authorize,
  authorizeCreate,
  authorizeUpdate,
} = require("../middlware/auth");

router
  .route("/")
  .get(getSubSections)
  .post(protect, authorize("admin"), authorizeCreate(), createSubSection);
router
  .route("/:id")
  .get(getSubSection)
  .put(protect, authorize("admin"), authorizeUpdate(), updateSubSection)
  .delete(protect, authorize("admin"), deleteSubSection);
module.exports = router;
