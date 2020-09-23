const express = require("express");

const authMiddleware = require("../middlewares/auth");
const validator = require("../middlewares/validator");

const userSchema = require("../schemas/user-schema");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/", validator(userSchema), userController.signup);
router.get("/private", authMiddleware(), (_, res) => {
  res.json({ data: "Welcome to this private area" });
});

module.exports = router;
