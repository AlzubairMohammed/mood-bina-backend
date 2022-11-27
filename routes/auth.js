const router = require("express").Router();
const { register, login, getMe, logout } = require("../controllers/auth");
const { protect } = require("../middlware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);

module.exports = router;
