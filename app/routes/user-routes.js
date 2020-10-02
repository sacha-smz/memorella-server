const express = require("express");

const authMiddleware = require("../middlewares/auth");
const validator = require("../middlewares/validator");

const userSchema = require("../schemas/user-schema");
const userController = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.post(
  "/",
  validator(userSchema, { context: { action: "create" } }),
  userController.signup
);
userRouter.get("/private", authMiddleware(), (_, res) => {
  res.json({ data: "Welcome to this private area" });
});

module.exports = userRouter;
