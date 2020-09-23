const express = require("express");

const authMiddleware = require("../middlewares/auth");

const authController = require("../controllers/auth-controller");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authMiddleware(), authController.logout);
router.post("/refresh", authMiddleware("refresh"), authController.refresh);

module.exports = router;
